/**
 * Quran text. Fetched from the QuranHub API (Misraj AI), falling back to Al-Quran Cloud
 * (same paths) if QuranHub fails or answers in an unexpected shape.
 * The text is fetched when the person picks a surah (never typed in by hand, so it cannot drift
 * from the source), then saved on the device.
 */
import { MAX_CONTENT_CHARS, normWord, wordsOf, type MemoryItem } from './memoryTools';

// QuranHub is licensed for non-commercial use only: see https://github.com/misraj-ai/quranhub
const APIS = ['https://api.quranhub.com/v1', 'https://api.alquran.cloud/v1'];
export const ARABIC_EDITION = 'quran-uthmani';
export const MEANING_EDITION = 'en.sahih';

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

export interface Verse {
  n: number;
  ar: string;
  en: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';

async function getData(base: string, path: string): Promise<unknown> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await fetch(`${base}${path}`, { signal: ctl.signal });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const body: unknown = await res.json();
    if (!isObj(body) || !('data' in body)) throw new Error('unexpected response');
    return body.data;
  } finally {
    clearTimeout(timer);
  }
}

type Get = (path: string) => Promise<unknown>;

/** Run `use` against each API in turn; the first one that returns a usable result wins. */
async function withFallback<T>(use: (get: Get) => Promise<T>): Promise<T> {
  let last: unknown;
  for (const base of APIS) {
    try {
      return await use((path) => getData(base, path));
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

let listCache: SurahInfo[] | null = null;

export const fetchSurahList = async (): Promise<SurahInfo[]> => listCache ?? withFallback(loadSurahList);

async function loadSurahList(get: Get): Promise<SurahInfo[]> {
  const data = await get('/surah');
  if (!Array.isArray(data)) throw new Error('unexpected list');
  const list = data
    .filter(isObj)
    .map((d) => ({
      number: Number(d.number),
      name: String(d.name ?? ''),
      englishName: String(d.englishName ?? ''),
      englishNameTranslation: String(d.englishNameTranslation ?? ''),
      numberOfAyahs: Number(d.numberOfAyahs)
    }))
    .filter((s) => Number.isInteger(s.number) && s.number >= 1 && s.number <= 114 && s.numberOfAyahs > 0)
    .sort((a, b) => a.number - b.number);
  if (list.length < 100) throw new Error('incomplete list');
  listCache = list;
  return list;
}

const BISMILLAH = ['بسم', 'الله', 'الرحمن', 'الرحيم'];

/** The API puts the opening "Bismillah" inside verse 1 of most surahs; it is not part of verse 1. */
export function stripBismillah(text: string, surah: number): string {
  if (surah === 1 || surah === 9) return text;
  const parts = text.trim().split(/\s+/);
  if (parts.length > 4 && BISMILLAH.every((w, i) => normWord(parts[i]) === w)) return parts.slice(4).join(' ');
  return text;
}

/** Fetch one surah in Arabic (Uthmani script) with its English meaning. */
export const fetchSurah = (number: number): Promise<Verse[]> => withFallback((get) => loadSurah(get, number));

async function loadSurah(get: Get, number: number): Promise<Verse[]> {
  const data = await get(`/surah/${number}/editions/${ARABIC_EDITION},${MEANING_EDITION}`);
  if (!Array.isArray(data)) throw new Error('unexpected surah');
  const edition = (id: string) => {
    const e = data.find((d) => isObj(d) && isObj(d.edition) && d.edition.identifier === id);
    return isObj(e) && Array.isArray(e.ayahs) ? e.ayahs.filter(isObj) : [];
  };
  const arabic = edition(ARABIC_EDITION);
  const english = edition(MEANING_EDITION);
  if (arabic.length === 0) throw new Error('no Arabic text');
  return arabic.map((a, i) => {
    const n = Number(a.numberInSurah);
    return {
      n,
      ar: n === 1 ? stripBismillah(String(a.text ?? ''), number) : String(a.text ?? ''),
      en: String(english[i]?.text ?? '')
    };
  });
}

/** How many characters a verse range would take once saved. */
export function rangeChars(verses: Verse[], from: number, to: number): number {
  return verses.filter((v) => v.n >= from && v.n <= to).reduce((sum, v) => sum + v.ar.length + 1, 0);
}

/** Build the Memory item for a verse range. One verse per line, so parts never split a verse. */
export function quranItem(surah: SurahInfo, verses: Verse[], from: number, to: number): MemoryItem {
  const chosen = verses.filter((v) => v.n >= from && v.n <= to);
  const range = from === to ? `${from}` : `${from}–${to}`;
  return {
    id: `quran_${surah.number}_${from}_${to}_${Date.now()}`,
    title: `Quran · ${surah.englishName} (${surah.number}) ${range}`,
    kind: 'text',
    content: chosen.map((v) => v.ar).join('\n').slice(0, MAX_CONTENT_CHARS),
    rtl: true,
    meaning: chosen.map((v) => `${v.n}. ${v.en}`).join('\n'),
    note:
      'Arabic text (Uthmani script) and English meaning (Sahih International) from QuranHub by Misraj AI. ' +
      'Learn recitation and tajweed with a qualified teacher; this app checks the words only.',
    createdAt: Date.now()
  };
}

export const quranWordCount = (verses: Verse[], from: number, to: number) =>
  wordsOf(verses.filter((v) => v.n >= from && v.n <= to).map((v) => v.ar).join(' ')).length;
