/** Pure logic for Photo Memory: build rounds and grade answers. No UI in here. */

export const POOL_SIZE = 28;

export interface Round {
  /** Pool indexes shown in the grid, in cell order. */
  cells: number[];
  cols: number;
  /** Seconds to study the grid. */
  studySeconds: number;
  /** Items offered when rebuilding: the shown ones plus decoys, shuffled. */
  tray: number[];
}

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: T[], rand: () => number): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const cellCount = (level: number) => Math.min(12, 3 + Math.max(1, level));
export const colsFor = (cells: number) => (cells <= 4 ? 2 : 3);
export const studySecondsFor = (cells: number) => Math.round(4 + cells * 0.8);

export function makeRound(level: number, seed: number): Round {
  const rand = rng(seed);
  const n = cellCount(level);
  const order = shuffle(Array.from({ length: POOL_SIZE }, (_, i) => i), rand);
  const cells = order.slice(0, n);
  const decoys = order.slice(n, n + 3);
  return { cells, cols: colsFor(n), studySeconds: studySecondsFor(n), tray: shuffle([...cells, ...decoys], rand) };
}

/** Grade a rebuilt grid: `placed[i]` is the pool index put in cell i, or null. */
export function gradeGrid(round: Round, placed: Array<number | null>): { correct: number; total: number } {
  const correct = round.cells.reduce((sum, item, i) => sum + (placed[i] === item ? 1 : 0), 0);
  return { correct, total: round.cells.length };
}

/** Level after a grid round: perfect goes up, under half goes down. */
export function nextLevel(level: number, correct: number, total: number): number {
  if (correct === total) return Math.min(9, level + 1);
  if (correct * 2 < total) return Math.max(1, level - 1);
  return level;
}

export interface ChangeRound {
  before: number[];
  after: number[];
  changedCell: number;
  cols: number;
  studySeconds: number;
}

/** One cell is swapped for an item that was not in the grid. */
export function makeChangeRound(level: number, seed: number): ChangeRound {
  const rand = rng(seed);
  const n = Math.max(6, cellCount(level));
  const order = shuffle(Array.from({ length: POOL_SIZE }, (_, i) => i), rand);
  const before = order.slice(0, n);
  const changedCell = Math.floor(rand() * n);
  const after = before.slice();
  after[changedCell] = order[n];
  return { before, after, changedCell, cols: colsFor(n), studySeconds: Math.max(4, Math.round(n * 0.6)) };
}
