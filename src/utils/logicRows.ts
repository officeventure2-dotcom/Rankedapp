/**
 * Logic Rows: put N items into N coloured rows (one per row, top to bottom) using clues.
 * Puzzles are generated from a seed and always have exactly one solution.
 */
import { rng } from './photoMemory';

export const ROW_COLORS = [
  { name: 'Green', hex: '#22c55e' },
  { name: 'Orange', hex: '#f59e0b' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Black', hex: '#18181b' },
  { name: 'Blue', hex: '#38bdf8' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Red', hex: '#ef4444' }
] as const;

export const THEMES: Record<string, string[]> = {
  Food: ['BREAD', 'EGGS', 'CREAM', 'BACON', 'FLOUR', 'JAM', 'FRUIT', 'RICE', 'HONEY'],
  Animals: ['FOX', 'OWL', 'BEAR', 'DEER', 'LYNX', 'HARE', 'WOLF', 'SEAL', 'CROW'],
  Space: ['MARS', 'VENUS', 'SATURN', 'EARTH', 'MOON', 'COMET', 'PLUTO', 'SUN', 'NOVA'],
  Tools: ['SAW', 'DRILL', 'HAMMER', 'PLIER', 'LEVEL', 'WRENCH', 'CHISEL', 'FILE', 'RULER']
};

/** Row index 0 is the top row. `p[item]` is the row an item sits in. */
export type Perm = number[];

export type Clue =
  | { t: 'at'; a: number; row: number }
  | { t: 'notAt'; a: number; row: number }
  | { t: 'edge'; a: number } // first or last row
  | { t: 'first'; a: number }
  | { t: 'last'; a: number }
  | { t: 'above'; a: number; b: number } // a somewhere above b
  | { t: 'justAbove'; a: number; b: number }
  | { t: 'between'; a: number; b: number; c: number } // a anywhere between b and c
  | { t: 'next'; a: number; b: number }
  | { t: 'either'; a: number; r1: number; r2: number };

export function holds(c: Clue, p: Perm): boolean {
  const n = p.length;
  switch (c.t) {
    case 'at': return p[c.a] === c.row;
    case 'notAt': return p[c.a] !== c.row;
    case 'edge': return p[c.a] === 0 || p[c.a] === n - 1;
    case 'first': return p[c.a] === 0;
    case 'last': return p[c.a] === n - 1;
    case 'above': return p[c.a] < p[c.b];
    case 'justAbove': return p[c.a] + 1 === p[c.b];
    case 'between': return (p[c.b] < p[c.a] && p[c.a] < p[c.c]) || (p[c.c] < p[c.a] && p[c.a] < p[c.b]);
    case 'next': return Math.abs(p[c.a] - p[c.b]) === 1;
    case 'either': return p[c.a] === c.r1 || p[c.a] === c.r2;
  }
}

function* permutations(n: number): Generator<Perm> {
  const a = Array.from({ length: n }, (_, i) => i);
  function* go(k: number): Generator<Perm> {
    if (k === n) { yield a.slice(); return; }
    for (let i = k; i < n; i++) {
      [a[k], a[i]] = [a[i], a[k]];
      yield* go(k + 1);
      [a[k], a[i]] = [a[i], a[k]];
    }
  }
  yield* go(0);
}

/** How many arrangements satisfy every clue (stops counting at `limit`). */
export function countSolutions(n: number, clues: Clue[], limit = 2): number {
  let found = 0;
  for (const p of permutations(n)) {
    if (clues.every((c) => holds(c, p))) {
      found++;
      if (found >= limit) break;
    }
  }
  return found;
}

export type Level = 'easy' | 'medium' | 'hard' | 'expert';
export const LEVELS: Record<Level, { size: number; label: string; xp: number }> = {
  easy: { size: 4, label: 'Easy', xp: 800 },
  medium: { size: 5, label: 'Medium', xp: 1500 },
  hard: { size: 6, label: 'Hard', xp: 2500 },
  expert: { size: 7, label: 'Expert', xp: 4000 }
};

function randomClue(sol: Perm, rand: () => number, level: Level): Clue {
  const n = sol.length;
  const pick = () => Math.floor(rand() * n);
  const other = (x: number) => { let y = pick(); while (y === x) y = pick(); return y; };
  const kinds = level === 'easy'
    ? ['at', 'above', 'above', 'justAbove', 'first', 'last', 'notAt']
    : ['above', 'above', 'justAbove', 'between', 'next', 'edge', 'either', 'notAt', 'above', 'at'];
  const kind = kinds[Math.floor(rand() * kinds.length)];
  const a = pick();
  const b = other(a);
  switch (kind) {
    case 'at': return { t: 'at', a, row: sol[a] };
    case 'notAt': { let r = Math.floor(rand() * n); while (r === sol[a]) r = Math.floor(rand() * n); return { t: 'notAt', a, row: r }; }
    case 'edge': return { t: 'edge', a };
    case 'first': return { t: 'first', a };
    case 'last': return { t: 'last', a };
    case 'above': return sol[a] < sol[b] ? { t: 'above', a, b } : { t: 'above', a: b, b: a };
    case 'justAbove': return sol[a] + 1 === sol[b] ? { t: 'justAbove', a, b } : { t: 'next', a, b };
    case 'between': { let c = other(a); while (c === b) c = other(a); return { t: 'between', a, b, c }; }
    case 'next': return { t: 'next', a, b };
    default: { let r = Math.floor(rand() * n); while (r === sol[a]) r = Math.floor(rand() * n); return { t: 'either', a, r1: Math.min(r, sol[a]), r2: Math.max(r, sol[a]) }; }
  }
}

export interface Puzzle {
  items: string[];
  theme: string;
  rows: number[]; // indexes into ROW_COLORS, top to bottom
  clues: Clue[];
  solution: Perm; // item -> row
  level: Level;
}

export function makePuzzle(level: Level, seed: number): Puzzle {
  const rand = rng(seed);
  const n = LEVELS[level].size;
  const themeName = Object.keys(THEMES)[Math.floor(rand() * Object.keys(THEMES).length)];
  const pool = THEMES[themeName].slice().sort(() => rand() - 0.5).slice(0, n);
  const colors = ROW_COLORS.map((_, i) => i).sort(() => rand() - 0.5).slice(0, n);
  const solution = Array.from({ length: n }, (_, i) => i).sort(() => rand() - 0.5);
  const clues: Clue[] = [];
  // Add true clues until exactly one arrangement is left. Always ends: 'at' for every item pins it.
  for (let guard = 0; guard < 200 && countSolutions(n, clues) !== 1; guard++) {
    const c = randomClue(solution, rand, level);
    if (holds(c, solution)) clues.push(c);
  }
  // Drop clues the rest do not need, so every clue pulls its weight.
  for (let i = clues.length - 1; i >= 0; i--) {
    const rest = clues.filter((_, j) => j !== i);
    if (countSolutions(n, rest) === 1) clues.splice(i, 1);
  }
  return { items: pool, theme: themeName, rows: colors, clues, solution, level };
}

/** Plain-English clue. `item(i)` and `row(r)` give display names. */
export function clueText(c: Clue, item: (i: number) => string, row: (r: number) => string): string {
  switch (c.t) {
    case 'at': return `${item(c.a)} is in the ${row(c.row)} row.`;
    case 'notAt': return `${item(c.a)} is not in the ${row(c.row)} row.`;
    case 'edge': return `${item(c.a)} is either in the first or last row.`;
    case 'first': return `${item(c.a)} is in the first row.`;
    case 'last': return `${item(c.a)} is in the last row.`;
    case 'above': return `${item(c.a)} is somewhere above ${item(c.b)}.`;
    case 'justAbove': return `${item(c.a)} is just above ${item(c.b)}.`;
    case 'between': return `${item(c.a)} is in between ${item(c.b)} and ${item(c.c)}.`;
    case 'next': return `${item(c.a)} is right next to ${item(c.b)}.`;
    case 'either': return `${item(c.a)} is in the ${row(c.r1)} or ${row(c.r2)} row.`;
  }
}
