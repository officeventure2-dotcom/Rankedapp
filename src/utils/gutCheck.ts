import { rng } from './photoMemory';

/** Gut Check: five quick tests of how well you sense counts, motion, angles, rhythm and proportion. */

export type TestId = 'count' | 'track' | 'angle' | 'tempo' | 'split';
export const TESTS: { id: TestId; title: string; how: string }[] = [
  { id: 'count', title: 'Count', how: 'Dots flash for two seconds. Type how many you saw.' },
  { id: 'track', title: 'Track', how: 'A ball flies, then vanishes. Mark where it lands.' },
  { id: 'angle', title: 'Angle', how: 'Drag the line to the angle you are asked for.' },
  { id: 'tempo', title: 'Tempo', how: 'Listen to four beats, then keep the beat for eight taps.' },
  { id: 'split', title: 'Split', how: 'Mark the asked share of the line.' }
];

/** Small errors cost few points, big ones many: 100 at zero error, about 64 at one tolerance. */
export const curve = (err: number, tol: number): number => Math.round(100 * Math.exp(-Math.pow(Math.abs(err) / (1.5 * tol), 2)));

export const GRADES: [number, string][] = [[95, 'S'], [85, 'A'], [70, 'B'], [55, 'C'], [40, 'D'], [0, 'F']];
export const gradeFor = (avg: number): string => GRADES.find(([min]) => avg >= min)![1];

export const scoreCount = (guess: number, truth: number) => curve((guess - truth) / truth, 0.2);
export const scoreAngle = (guess: number, truth: number) => {
  const d = Math.abs(guess - truth) % 360;
  return curve(Math.min(d, 360 - d), 8);
};
export const scoreSplit = (guessPct: number, truthPct: number) => curve(guessPct - truthPct, 5);

export const TRACK_W = 300;
export const scoreTrack = (guessX: number, truthX: number) => curve(guessX - truthX, 30);

/** Drift of the average gap plus jitter between gaps, in ms against the target gap. */
export function scoreTempo(taps: number[], gap: number): { score: number; drift: number; jitter: number } {
  const gaps = taps.slice(1).map((t, i) => t - taps[i]);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const jitter = Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length);
  const drift = mean - gap;
  return { score: curve(Math.abs(drift) + jitter, 60), drift, jitter };
}

export interface Round {
  dots: { x: number; y: number }[];
  ball: { x0: number; vx: number; peak: number }; // flies from x0 to x0 + vx over 1 time unit
  angle: number;
  gap: number;
  split: { pct: number; label: string };
}

export function makeRound(seed: number): Round {
  const r = rng(seed);
  const n = 45 + Math.floor(r() * 41);
  const dots = Array.from({ length: n }, () => ({ x: 6 + r() * 288, y: 6 + r() * 188 }));
  const x0 = 20 + r() * 40;
  const ball = { x0, vx: 120 + r() * 100, peak: 90 + r() * 50 };
  const angle = 10 + Math.floor(r() * 340);
  const gap = 520 + Math.floor(r() * 400);
  const pct = 5 + Math.floor(r() * 91);
  const nice = [[25, '1/4'], [50, '1/2'], [75, '3/4'], [33, '1/3'], [20, '1/5']] as const;
  const pick = r() < 0.4 ? nice[Math.floor(r() * nice.length)] : null;
  return { dots, ball, angle, gap, split: pick ? { pct: pick[0], label: `${pick[1]} (${pick[0]}%)` } : { pct, label: `${pct}%` } };
}

export const xpFor = (avg: number, daily: boolean) => Math.round(avg * 20) * (daily ? 2 : 1);
