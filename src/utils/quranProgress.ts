/**
 * Quran memorization progress and XP. Pure functions, no UI.
 *
 * A verse counts as memorized once it is recited from memory at 90% or better.
 * Each verse pays XP once; later recitals pay a smaller review bonus.
 */
import { compareText, wordsOf } from './memoryTools';
import type { Verse } from './quran';

export const TOTAL_VERSES = 6236;
export const PASS = 0.9;
export const REVIEW_AFTER_MS = 3 * 24 * 3600 * 1000;

export const XP_VERSE_BASE = 1000;
export const XP_PER_WORD = 40;
export const XP_REVIEW = 300;
export const XP_DAILY = 2500;
export const XP_SURAH_BASE = 5000;
export const XP_SURAH_PER_VERSE = 500;

export const verseXp = (words: number) => XP_VERSE_BASE + XP_PER_WORD * Math.min(60, Math.max(1, words));
export const surahBonus = (verses: number) => XP_SURAH_BASE + XP_SURAH_PER_VERSE * verses;

export const RANKS = [
  { min: 0, name: 'Beginner' },
  { min: 10, name: 'Learner' },
  { min: 50, name: 'Student' },
  { min: 150, name: 'Devoted' },
  { min: 400, name: 'Steadfast' },
  { min: 1000, name: 'Guardian' },
  { min: 2500, name: 'Scholar' },
  { min: TOTAL_VERSES, name: 'Hafiz' }
] as const;

export function rankFor(verses: number) {
  let index = 0;
  RANKS.forEach((r, i) => {
    if (verses >= r.min) index = i;
  });
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const pct = next ? (verses - current.min) / (next.min - current.min) : 1;
  return { current, next, pct: Math.max(0, Math.min(1, pct)), index };
}

export interface QuranPassage {
  id: string;
  surah: number;
  englishName: string;
  /** Verses in the whole surah. */
  total: number;
  from: number;
  to: number;
  verses: Verse[];
  createdAt: number;
}

export interface QuranState {
  passages: QuranPassage[];
  /** surah number -> verse number -> last time it was recited well (ms). */
  memorized: Record<string, Record<string, number>>;
  lastDaily: string;
  xpEarned: number;
  surahsDone: number[];
}

export const emptyState = (): QuranState => ({ passages: [], memorized: {}, lastDaily: '', xpEarned: 0, surahsDone: [] });

export const countMemorized = (s: QuranState) =>
  Object.values(s.memorized).reduce((sum, v) => sum + Object.keys(v).length, 0);

export const countInSurah = (s: QuranState, surah: number) => Object.keys(s.memorized[String(surah)] ?? {}).length;

/** Which verse each line of the recited text is, matched in order (a refrain can repeat). */
export function matchLines(lines: string[], verses: Verse[]): Array<number | null> {
  let p = 0;
  return lines.map((line) => {
    for (let j = p; j < verses.length; j++) {
      if (verses[j].ar.trim() === line) {
        p = j + 1;
        return j;
      }
    }
    return null;
  });
}

export interface VerseScore {
  verse: number;
  words: number;
  accuracy: number;
}

/** Score each verse inside what the person typed against the expected text (one verse per line). */
export function scoreRecital(verses: Verse[], expected: string, typed: string): VerseScore[] {
  const lines = expected
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const match = matchLines(lines, verses);
  const result = compareText(expected, typed);
  const out: VerseScore[] = [];
  let w = 0;
  lines.forEach((line, i) => {
    const n = wordsOf(line).length;
    const hits = result.words.slice(w, w + n).filter((x) => x.hit).length;
    w += n;
    const idx = match[i];
    if (idx !== null && n > 0) out.push({ verse: verses[idx].n, words: n, accuracy: hits / n });
  });
  return out;
}

export interface Award {
  state: QuranState;
  xp: number;
  newlyMemorized: number[];
  reviewed: number[];
  surahCompleted: boolean;
  daily: boolean;
  rankedUp: string | null;
}

export function applyRecital(
  state: QuranState,
  passage: Pick<QuranPassage, 'surah' | 'total'>,
  scores: VerseScore[],
  now: number,
  today: string
): Award {
  const key = String(passage.surah);
  const before = countMemorized(state);
  const surahMap = { ...(state.memorized[key] ?? {}) };
  let xp = 0;
  const newlyMemorized: number[] = [];
  const reviewed: number[] = [];
  let anyPass = false;

  for (const s of scores) {
    if (s.accuracy < PASS) continue;
    anyPass = true;
    const last = surahMap[String(s.verse)];
    if (last === undefined) {
      xp += verseXp(s.words);
      surahMap[String(s.verse)] = now;
      newlyMemorized.push(s.verse);
    } else if (now - last >= REVIEW_AFTER_MS) {
      xp += XP_REVIEW;
      surahMap[String(s.verse)] = now;
      reviewed.push(s.verse);
    }
  }

  let surahCompleted = false;
  const surahsDone = state.surahsDone.slice();
  if (Object.keys(surahMap).length >= passage.total && !surahsDone.includes(passage.surah)) {
    xp += surahBonus(passage.total);
    surahsDone.push(passage.surah);
    surahCompleted = true;
  }

  let daily = false;
  let lastDaily = state.lastDaily;
  if (anyPass && lastDaily !== today) {
    xp += XP_DAILY;
    lastDaily = today;
    daily = true;
  }

  const next: QuranState = {
    ...state,
    memorized: { ...state.memorized, [key]: surahMap },
    surahsDone,
    lastDaily,
    xpEarned: state.xpEarned + xp
  };
  const after = countMemorized(next);
  const rankedUp = rankFor(after).index > rankFor(before).index ? rankFor(after).current.name : null;
  return { state: next, xp, newlyMemorized, reviewed, surahCompleted, daily, rankedUp };
}
