/**
 * Pure helpers for Memory Mode: splitting material into blocks, building a
 * spaced-review plan, and scoring what the person recalls. No UI in here.
 */

export type MemoryKind = 'digits' | 'text';

export interface MemoryItem {
  id: string;
  title: string;
  kind: MemoryKind;
  /** digits: only the digits to learn (no dot or spaces). text: the raw text. */
  content: string;
  /** digits only: the part given for free, e.g. "3." for pi. */
  prefix?: string;
  note?: string;
  /** Right-to-left script (Arabic). Changes how the text is shown and checked. */
  rtl?: boolean;
  /** Optional translation shown beside the text (e.g. English meaning of each Quran verse). */
  meaning?: string;
  builtIn?: boolean;
  createdAt?: number;
}

export const ARABIC_FONT = "'Amiri','Noto Naskh Arabic','Scheherazade New','Traditional Arabic',serif";
export const MAX_CONTENT_CHARS = 20000;
export const DIGITS_PER_BLOCK = 20;

// ---------- Reading what the person gave us ----------

/** Decide whether pasted material is a number to learn or text. */
export function detectKind(raw: string): MemoryKind {
  const compact = raw.replace(/\s/g, '');
  if (compact.length === 0) return 'text';
  const digits = compact.replace(/[^0-9]/g, '').length;
  return digits / compact.length >= 0.8 ? 'digits' : 'text';
}

/** Turn pasted digits into { prefix, content }, e.g. "3.14159" → "3." + "14159". */
export function parseDigits(raw: string): { prefix: string; content: string } {
  const cleaned = raw.replace(/[\s,_]/g, '');
  const m = /^(\d+)[.,](\d+)/.exec(cleaned);
  if (m) return { prefix: `${m[1]}.`, content: m[2].replace(/\D/g, '') };
  return { prefix: '', content: cleaned.replace(/\D/g, '') };
}

// ---------- Blocks ----------

/** A word: letters, combining marks (Arabic vowel signs), digits, inner apostrophes/hyphens. */
export const WORD_PATTERN = /[\p{L}\p{M}\p{N}]+(?:['’-][\p{L}\p{M}\p{N}]+)*/gu;

/** Words in a line (letters, digits and inner apostrophes/hyphens). */
export function wordsOf(text: string): string[] {
  return text.match(WORD_PATTERN) ?? [];
}

/** Split text into blocks of about 20–30 words, never breaking a line. */
export function textBlocks(text: string): string[] {
  let lines = text.replace(/\r\n?/g, '\n').split('\n');
  const nonEmpty = lines.filter((l) => l.trim());
  // One long paragraph: break it into sentences so blocks stay readable.
  if (nonEmpty.length <= 2 && wordsOf(text).length > 40) {
    lines = (text.match(/[^.!?؟।]+[.!?؟।]*\s*/g) ?? [text]).map((s) => s.trim());
  }
  const blocks: string[] = [];
  let current: string[] = [];
  let count = 0;
  const flush = () => {
    if (current.some((l) => l.trim())) blocks.push(current.join('\n').trim());
    current = [];
    count = 0;
  };
  for (const line of lines) {
    if (!line.trim()) {
      if (count >= 12) flush();
      else if (current.length) current.push('');
      continue;
    }
    current.push(line.trim());
    count += wordsOf(line).length;
    if (count >= 24) flush();
  }
  flush();
  return blocks;
}

/** Split digits into blocks of DIGITS_PER_BLOCK. */
export function digitBlocks(digits: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < digits.length; i += DIGITS_PER_BLOCK) out.push(digits.slice(i, i + DIGITS_PER_BLOCK));
  return out;
}

export function blocksOf(item: Pick<MemoryItem, 'kind' | 'content'>): string[] {
  return item.kind === 'digits' ? digitBlocks(item.content) : textBlocks(item.content);
}

/** Group digits for reading, e.g. "31415926" → ["3141","5926"]. */
export function groupDigits(digits: string, size: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < digits.length; i += size) out.push(digits.slice(i, i + size));
  return out;
}

// ---------- Plan ----------

export interface BlockRange {
  /** 1-based, inclusive. */
  from: number;
  to: number;
}

export interface PlanDay {
  day: number;
  learn: BlockRange | null;
  /** Earlier blocks to revisit today (spaced: 1, 3 and 7 days after learning). */
  review: BlockRange[];
  /** Say everything learned so far from memory. */
  recite: boolean;
  final: boolean;
  minutes: number;
}

export const MINUTES_PER_NEW_BLOCK = 3;
export const MINUTES_PER_REVIEW_BLOCK = 1;
export const MINUTES_PER_RECITE_BLOCK = 0.5;

function rangeSize(r: BlockRange): number {
  return r.to - r.from + 1;
}

/**
 * Build a day-by-day plan. About 60% of the days introduce new blocks; each
 * learned block is revisited 1, 3 and 7 days later; the remaining days are
 * consolidation, and the last day is a full recital.
 */
export function buildPlan(blockCount: number, days: number): PlanDay[] {
  const total = Math.max(1, Math.round(days));
  if (blockCount <= 0) return [];
  const learnDays = Math.min(blockCount, Math.max(1, total === 1 ? 1 : Math.round(total * 0.6)));

  const learnByDay = new Map<number, BlockRange>();
  let next = 1;
  for (let d = 1; d <= learnDays; d++) {
    const remaining = blockCount - next + 1;
    const take = Math.ceil(remaining / (learnDays - d + 1));
    learnByDay.set(d, { from: next, to: next + take - 1 });
    next += take;
  }

  const plan: PlanDay[] = [];
  for (let d = 1; d <= total; d++) {
    const review: BlockRange[] = [];
    for (const gap of [1, 3, 7]) {
      const src = learnByDay.get(d - gap);
      if (src) review.push(src);
    }
    const learn = learnByDay.get(d) ?? null;
    const learnedSoFar = learn ? learn.to : d > learnDays ? blockCount : 0;
    const recite = d === total || (d > learnDays && learnedSoFar > 0);
    const minutes =
      (learn ? rangeSize(learn) * MINUTES_PER_NEW_BLOCK : 0) +
      review.reduce((n, r) => n + rangeSize(r) * MINUTES_PER_REVIEW_BLOCK, 0) +
      (recite ? Math.ceil(learnedSoFar * MINUTES_PER_RECITE_BLOCK) : 0);
    plan.push({ day: d, learn, review, recite, final: d === total, minutes: Math.max(1, Math.ceil(minutes)) });
  }
  return plan;
}

/** The smallest number of days whose busiest day fits in minutesPerDay (capped at 90). */
export function suggestDays(blockCount: number, minutesPerDay: number): number {
  for (let d = 1; d <= 90; d++) {
    const peak = Math.max(...buildPlan(blockCount, d).map((p) => p.minutes));
    if (peak <= minutesPerDay) return d;
  }
  return 90;
}

// ---------- Scoring ----------

export interface DigitResult {
  /** One entry per expected digit: the typed digit was right, wrong or missing. */
  marks: Array<'ok' | 'wrong' | 'missing'>;
  /** Digits right in a row before the first mistake. */
  streak: number;
  correct: number;
  total: number;
  /** Typed digits beyond the expected length. */
  extra: number;
}

export function compareDigits(expected: string, typed: string): DigitResult {
  const t = typed.replace(/\D/g, '');
  const marks: DigitResult['marks'] = [];
  let correct = 0;
  let streak = 0;
  let broken = false;
  for (let i = 0; i < expected.length; i++) {
    if (i >= t.length) marks.push('missing');
    else if (t[i] === expected[i]) {
      marks.push('ok');
      correct++;
      if (!broken) streak++;
    } else {
      marks.push('wrong');
      broken = true;
    }
    if (marks[i] !== 'ok') broken = true;
  }
  return { marks, streak, correct, total: expected.length, extra: Math.max(0, t.length - expected.length) };
}

export interface TextResult {
  /** The expected words, each flagged as recalled or not. */
  words: Array<{ word: string; hit: boolean }>;
  hits: number;
  total: number;
  accuracy: number;
  /** Words typed that are not in the right place. */
  extra: string[];
}

const ARABIC = /[\u0600-\u06FF]/;

/**
 * Comparison form of a word. Latin: case, curly apostrophes. Arabic: vowel signs,
 * Quranic marks and tatweel are dropped and alef/yaa/taa-marbuta variants merged,
 * so typing without diacritics still counts as correct.
 */
export function normWord(w: string): string {
  let out = w.toLowerCase().normalize('NFC').replace(/[’‘]/g, "'");
  if (ARABIC.test(out)) {
    out = out
      .normalize('NFD')
      .replace(/[\p{M}\u0640\u06D6-\u06ED]/gu, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
      .replace(/\u0649/g, '\u064A')
      .replace(/\u0629/g, '\u0647')
      .replace(/\u06A9/g, '\u0643')
      .replace(/\u06CC/g, '\u064A');
  }
  return out;
}

const norm = normWord;

export function compareText(expected: string, typed: string): TextResult {
  const exp = wordsOf(expected);
  const got = wordsOf(typed);
  const a = exp.map(norm);
  const b = got.map(norm);
  // Longest common subsequence of words (typed words in the right order).
  const n = a.length;
  const m = b.length;
  const cap = 4000;
  if (n > cap || m > cap) {
    const hit = a.map((w, i) => w === b[i]);
    const hits = hit.filter(Boolean).length;
    return { words: exp.map((word, i) => ({ word, hit: hit[i] })), hits, total: n, accuracy: n ? hits / n : 0, extra: [] };
  }
  const dp: Uint16Array[] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const hit = new Array<boolean>(n).fill(false);
  const used = new Array<boolean>(m).fill(false);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      hit[i] = true;
      used[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const hits = hit.filter(Boolean).length;
  return {
    words: exp.map((word, k) => ({ word, hit: hit[k] })),
    hits,
    total: n,
    accuracy: n ? hits / n : 0,
    extra: got.filter((_, k) => !used[k])
  };
}

// ---------- Dates ----------

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Which plan day (1-based) a calendar day is, counting from the start date. */
export function planDayFor(startKey: string, nowKey = todayKey()): number {
  const [sy, sm, sd] = startKey.split('-').map(Number);
  const [ny, nm, nd] = nowKey.split('-').map(Number);
  const ms = Date.UTC(ny, nm - 1, nd) - Date.UTC(sy, sm - 1, sd);
  return Math.floor(ms / 86400000) + 1;
}
