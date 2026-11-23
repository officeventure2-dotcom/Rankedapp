import type { BookChapter } from '../types';

const HEADING = /^(chapter|book|part|letter|volume|act|canto)\b[^\n]{0,60}$/i;
const CHUNK = 6000;

/** Turn raw book text into reader chapters: paragraphs grouped ~6000 characters, titled by a "CHAPTER …" line when one starts the group. */
export function toChapters(text: string): BookChapter[] {
  const paras = text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  const out: BookChapter[] = [];
  let cur: string[] = [];
  let size = 0;
  let title = '';
  const flush = () => {
    if (!cur.length) return;
    const n = out.length + 1;
    out.push({ id: `c${n}`, chapterNumber: n, title: title || `Part ${n}`, content: cur, estimatedMinutes: Math.max(1, Math.round(size / 1100)) });
    cur = []; size = 0; title = '';
  };
  for (const p of paras) {
    if (HEADING.test(p) && size >= CHUNK / 2) flush();
    if (HEADING.test(p) && cur.length === 0 && !title) { title = p; continue; }
    cur.push(p); size += p.length;
    if (size >= CHUNK) flush();
  }
  flush();
  return out;
}
