import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { ARABIC_FONT, MAX_CONTENT_CHARS, type MemoryItem } from '../utils/memoryTools';
import {
  fetchSurah,
  fetchSurahList,
  quranItem,
  quranWordCount,
  rangeChars,
  type SurahInfo,
  type Verse
} from '../utils/quran';

const card =
  'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const primaryBtn =
  'min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const softBtn =
  'min-h-touch px-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-40';
const field = 'w-full min-h-touch px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm';

const clampInt = (v: string, min: number, max: number, fallback: number) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Pick a surah and a range of verses to memorize. The text comes from QuranHub (Misraj AI). */
export interface PickedPassage {
  surah: SurahInfo;
  verses: Verse[];
  from: number;
  to: number;
}

export const QuranPicker: React.FC<{
  onCancel: () => void;
  onSave: (item: MemoryItem, picked: PickedPassage) => void;
  actionLabel?: string;
}> = ({ onCancel, onSave, actionLabel = 'Add to my memory' }) => {
  const [list, setList] = useState<SurahInfo[]>([]);
  const [listError, setListError] = useState(false);
  const [reload, setReload] = useState(0);
  const [surahNo, setSurahNo] = useState(112);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [verseError, setVerseError] = useState(false);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);

  useEffect(() => {
    let live = true;
    setListError(false);
    fetchSurahList()
      .then((l) => live && setList(l))
      .catch(() => live && setListError(true));
    return () => {
      live = false;
    };
  }, [reload]);

  useEffect(() => {
    if (list.length === 0) return;
    let live = true;
    setLoading(true);
    setVerseError(false);
    setVerses([]);
    fetchSurah(surahNo)
      .then((v) => {
        if (!live) return;
        setVerses(v);
        setFrom(1);
        setTo(Math.min(v.length, 5));
      })
      .catch(() => live && setVerseError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [surahNo, list.length, reload]);

  const surah = list.find((s) => s.number === surahNo);
  const total = verses.length;
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const chars = useMemo(() => rangeChars(verses, lo, hi), [verses, lo, hi]);
  const tooLong = chars > MAX_CONTENT_CHARS;
  const count = hi - lo + 1;
  const preview = verses.filter((v) => v.n >= lo && v.n <= hi).slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <button onClick={onCancel} className={`${softBtn} inline-flex items-center gap-2`}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className={`${card} p-4 space-y-4`}>
        <div className="space-y-1">
          <h2 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-50">Quran</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Choose a surah and the verses to learn. You get the Arabic text, the English meaning and a daily plan, and every verse you recite from memory earns XP.
          </p>
        </div>

        {listError ? (
          <div role="alert" className="space-y-2 text-sm text-rose-600 dark:text-rose-400">
            <p>Could not load the surah list. Check your connection.</p>
            <button onClick={() => setReload((n) => n + 1)} className={softBtn}>
              Try again
            </button>
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-zinc-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading surahs…
          </p>
        ) : (
          <>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Surah</span>
              <select value={surahNo} onChange={(e) => setSurahNo(Number(e.target.value))} className={field}>
                {list.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} ({s.numberOfAyahs} verses)
                  </option>
                ))}
              </select>
            </label>

            {loading && (
              <p className="text-sm text-zinc-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading verses…
              </p>
            )}
            {verseError && (
              <div role="alert" className="space-y-2 text-sm text-rose-600 dark:text-rose-400">
                <p>Could not load this surah. Check your connection.</p>
                <button onClick={() => setReload((n) => n + 1)} className={softBtn}>
                  Try again
                </button>
              </div>
            )}

            {total > 0 && surah && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">From verse</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={total}
                      value={from}
                      onChange={(e) => setFrom(clampInt(e.target.value, 1, total, 1))}
                      className={field}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">To verse</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={total}
                      value={to}
                      onChange={(e) => setTo(clampInt(e.target.value, 1, total, total))}
                      className={field}
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFrom(1); setTo(Math.min(total, 5)); }} className={softBtn}>
                    First 5
                  </button>
                  <button onClick={() => { setFrom(1); setTo(total); }} className={softBtn}>
                    Whole surah
                  </button>
                </div>

                <div className="rounded-xl p-3 bg-black/[0.03] dark:bg-white/[0.04] space-y-3" aria-label="Preview">
                  {preview.map((v) => (
                    <div key={v.n} className="space-y-1">
                      <p dir="rtl" lang="ar" style={{ fontFamily: ARABIC_FONT }} className="text-2xl leading-[2.2] text-zinc-900 dark:text-zinc-50">
                        {v.ar}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {v.n}. {v.en}
                      </p>
                    </div>
                  ))}
                  {count > preview.length && (
                    <p className="text-[11px] text-zinc-400">…and {count - preview.length} more</p>
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {surah.englishName} {lo === hi ? lo : `${lo}–${hi}`} · {count} {count === 1 ? 'verse' : 'verses'} ·{' '}
                  {quranWordCount(verses, lo, hi)} words
                </p>
                {tooLong && (
                  <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
                    That is too much for one item. Pick a shorter range (up to {MAX_CONTENT_CHARS.toLocaleString()} characters).
                  </p>
                )}
                <button
                  disabled={tooLong}
                  onClick={() => {
                    haptics.tap();
                    onSave(quranItem(surah, verses, lo, hi), { surah, verses: verses.filter((v) => v.n >= lo && v.n <= hi), from: lo, to: hi });
                  }}
                  className={`${primaryBtn} w-full inline-flex items-center justify-center gap-2`}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" /> {actionLabel}
                </button>
              </>
            )}
          </>
        )}
      </div>
      <p className="text-[11px] text-zinc-400 text-center">
        Text from QuranHub by Misraj AI. For recitation and tajweed, learn with a qualified teacher.
      </p>
    </div>
  );
};
