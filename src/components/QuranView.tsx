import React, { useState } from 'react';
import { BookOpenText, ChevronRight, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { haptics } from '../utils/haptics';
import { todayKey } from '../utils/memoryTools';
import { quranItem } from '../utils/quran';
import {
  TOTAL_VERSES,
  XP_DAILY,
  XP_PER_WORD,
  XP_REVIEW,
  XP_SURAH_BASE,
  XP_SURAH_PER_VERSE,
  XP_VERSE_BASE,
  applyRecital,
  countInSurah,
  countMemorized,
  emptyState,
  rankFor,
  scoreRecital,
  type QuranPassage,
  type QuranState
} from '../utils/quranProgress';
import { ItemDetail, type Progress } from './MemoryModeView';
import { QuranPicker } from './QuranPicker';

const KEY = 'ranked.quran.v1';

interface Store {
  q: QuranState;
  progress: Record<string, Progress>;
}

function load(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Store>;
      if (p && p.q && Array.isArray(p.q.passages)) {
        return { q: { ...emptyState(), ...p.q }, progress: p.progress ?? {} };
      }
    }
  } catch {
    /* ignore */
  }
  return { q: emptyState(), progress: {} };
}

const card =
  'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const primaryBtn =
  'min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const num = (n: number) => n.toLocaleString();

const passageLabel = (p: QuranPassage) => `${p.englishName} (${p.surah}) ${p.from === p.to ? p.from : `${p.from}–${p.to}`}`;

interface LastAward {
  xp: number;
  text: string;
}

/** The Quran section: memorize verses, earn XP, climb the Quran ranks. */
export const QuranView: React.FC = () => {
  const { user, gainXp, showToast } = useRanked();
  const [store, setStore] = useState<Store>(load);
  const [picking, setPicking] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [award, setAward] = useState<LastAward | null>(null);

  const update = (change: (prev: Store) => Store) =>
    setStore((prev) => {
      const next = change(prev);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage can be unavailable; progress still counts for this visit */
      }
      return next;
    });

  const memorized = countMemorized(store.q);
  const rank = rankFor(memorized);
  const open = store.q.passages.find((p) => p.id === openId) ?? null;
  const claimedToday = store.q.lastDaily === todayKey();

  if (picking) {
    return (
      <QuranPicker
        actionLabel="Start memorizing"
        onCancel={() => setPicking(false)}
        onSave={(item, picked) => {
          const passage: QuranPassage = {
            id: item.id,
            surah: picked.surah.number,
            englishName: picked.surah.englishName,
            total: picked.surah.numberOfAyahs,
            from: picked.from,
            to: picked.to,
            verses: picked.verses,
            createdAt: Date.now()
          };
          update((prev) => ({ ...prev, q: { ...prev.q, passages: [passage, ...prev.q.passages] } }));
          setPicking(false);
          setAward(null);
          setOpenId(passage.id);
        }}
      />
    );
  }

  if (open) {
    const item = { ...quranItem({ number: open.surah, englishName: open.englishName, name: '', englishNameTranslation: '', numberOfAyahs: open.total }, open.verses, open.from, open.to), id: open.id };
    const onChecked = ({ expected, typed }: { expected: string; typed: string }) => {
      const scores = scoreRecital(open.verses, expected, typed);
      const result = applyRecital(store.q, open, scores, Date.now(), todayKey());
      if (result.xp <= 0) {
        const near = scores.filter((s) => s.accuracy >= 0.9).length;
        setAward({
          xp: 0,
          text:
            near === 0
              ? 'No verse reached 90% yet. A verse counts once you recite it with at most one mistake in ten words.'
              : 'Those verses are already counted. Come back in 3 days for review XP.'
        });
        return;
      }
      update((prev) => ({ ...prev, q: result.state }));
      const parts: string[] = [];
      if (result.newlyMemorized.length) parts.push(`${result.newlyMemorized.length} new verse${result.newlyMemorized.length === 1 ? '' : 's'} memorized`);
      if (result.reviewed.length) parts.push(`${result.reviewed.length} reviewed`);
      if (result.surahCompleted) parts.push(`Surah ${open.englishName} complete!`);
      if (result.daily) parts.push('daily recital bonus');
      if (result.rankedUp) parts.push(`new rank: ${result.rankedUp}`);
      setAward({ xp: result.xp, text: parts.join(' · ') });
      gainXp(result.xp, 'iq', `Quran: ${parts.join(', ')}`);
    };
    return (
      <div className="space-y-4">
        <div className="max-w-2xl mx-auto">
          <div
            role="status"
            className={`rounded-xl px-3.5 py-2.5 text-sm ${
              award && award.xp > 0
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                : 'bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300'
            }`}
          >
            {award ? (
              <>
                {award.xp > 0 && <b>+{num(award.xp)} XP · </b>}
                {award.text}
              </>
            ) : (
              <>
                {countInSurah(store.q, open.surah)} of {open.total} verses of this surah memorized. Recite a verse from memory at 90% or
                better to earn <b>{num(XP_VERSE_BASE)}+ XP</b> for it.
              </>
            )}
          </div>
        </div>
        <ItemDetail
          key={open.id}
          item={item}
          progress={store.progress[open.id] ?? {}}
          patch={(p) =>
            update((prev) => ({ ...prev, progress: { ...prev.progress, [open.id]: { ...prev.progress[open.id], ...p } } }))
          }
          onBack={() => {
            setOpenId(null);
            setAward(null);
          }}
          onChecked={onChecked}
          backLabel="Back to Quran"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">Quran</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Memorize verses, recite them from memory and earn big XP. Your level goes up with every verse.
        </p>
      </div>

      <section aria-label="Your Quran progress" className={`${card} p-4 space-y-3`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <BookOpenText className="w-6 h-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Quran rank</p>
            <p className="text-lg font-extrabold font-display text-zinc-900 dark:text-zinc-50 leading-tight">{rank.current.name}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-lg font-extrabold font-mono text-zinc-900 dark:text-zinc-50 leading-tight">{num(memorized)}</p>
            <p className="text-[11px] text-zinc-500">of {num(TOTAL_VERSES)} verses</p>
          </div>
        </div>
        <div className="mem-track h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden" role="progressbar" aria-valuenow={Math.round(rank.pct * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next rank">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(2, rank.pct * 100)}%` }} />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {rank.next
            ? `${num(rank.next.min - memorized)} more verse${rank.next.min - memorized === 1 ? '' : 's'} to reach ${rank.next.name}`
            : 'You have memorized the whole Quran.'}
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            [num(store.q.xpEarned), 'Quran XP'],
            [String(store.q.surahsDone.length), 'Surahs done'],
            [`Lv ${user.level}`, 'Your level']
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl py-2 bg-black/[0.03] dark:bg-white/[0.05]">
              <p className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-50">{v}</p>
              <p className="text-[11px] text-zinc-500">{l}</p>
            </div>
          ))}
        </div>
        <p className={`text-xs rounded-lg px-3 py-2 flex items-center gap-2 ${claimedToday ? 'bg-black/[0.04] dark:bg-white/[0.06] text-zinc-500' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {claimedToday ? 'Daily recital bonus claimed. Come back tomorrow.' : `Daily recital bonus ready: +${num(XP_DAILY)} XP for your first good recital today.`}
        </p>
      </section>

      <button
        onClick={() => {
          haptics.tap();
          setPicking(true);
        }}
        className={`${primaryBtn} w-full inline-flex items-center justify-center gap-2`}
      >
        <Plus className="w-4 h-4" aria-hidden="true" /> Start a new passage
      </button>

      {store.q.passages.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Your passages</h3>
          {store.q.passages.map((p) => {
            const mem = Object.keys(store.q.memorized[String(p.surah)] ?? {}).filter((n) => Number(n) >= p.from && Number(n) <= p.to).length;
            const size = p.to - p.from + 1;
            const done = store.q.surahsDone.includes(p.surah);
            return (
              <div key={p.id} className={`${card} flex items-stretch`}>
                <button
                  onClick={() => {
                    haptics.tap();
                    setAward(null);
                    setOpenId(p.id);
                  }}
                  className="flex-1 min-w-0 p-4 flex items-center gap-3 text-left cursor-pointer"
                >
                  <span className="min-w-0 flex-1 space-y-1.5">
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{passageLabel(p)}</span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {mem} of {size} verse{size === 1 ? '' : 's'} memorized{done ? ' · surah complete' : ''}
                    </span>
                    <span className="mem-track block h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${(mem / size) * 100}%` }} />
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove “${passageLabel(p)}” from your list? Verses you already memorized stay counted.`)) {
                      update((prev) => ({ ...prev, q: { ...prev.q, passages: prev.q.passages.filter((x) => x.id !== p.id) } }));
                      showToast('Passage removed');
                    }
                  }}
                  aria-label={`Remove ${passageLabel(p)}`}
                  className="min-h-touch min-w-touch px-3 flex items-center justify-center text-zinc-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <details className={`${card} px-3.5 py-2.5 text-sm`}>
        <summary className="cursor-pointer min-h-touch flex items-center font-semibold text-zinc-700 dark:text-zinc-200">How XP works</summary>
        <ul className="mt-1 space-y-1.5 text-zinc-600 dark:text-zinc-300 text-[13px] leading-relaxed">
          <li>
            <b>New verse:</b> {num(XP_VERSE_BASE)} XP plus {XP_PER_WORD} per word, when you recite it from memory at 90% or better.
          </li>
          <li>
            <b>Review:</b> {num(XP_REVIEW)} XP per verse when you recite it well again after 3 days.
          </li>
          <li>
            <b>Daily bonus:</b> {num(XP_DAILY)} XP for your first good recital each day.
          </li>
          <li>
            <b>Finish a surah:</b> {num(XP_SURAH_BASE)} XP plus {num(XP_SURAH_PER_VERSE)} per verse.
          </li>
          <li className="text-xs text-zinc-500">Each verse pays its new-verse XP once, so XP reflects what you really know. Typing without vowel marks is fine.</li>
        </ul>
      </details>
      <p className="text-[11px] text-zinc-400 text-center">
        Text from QuranHub by Misraj AI. For recitation and tajweed, learn with a qualified teacher. Progress is saved on this device.
      </p>
    </div>
  );
};
