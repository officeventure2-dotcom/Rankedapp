import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  Eye,
  FileText,
  FileUp,
  Hash,
  BookOpenText,
  Camera,
  Plus,
  RotateCcw,
  Trash2,
  Volume2
} from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { MemoryAiSearch } from './MemoryAiSearch';
import { PhotoMemoryView } from './PhotoMemoryView';
import { MEMORY_LIBRARY } from '../data/memoryLibrary';
import { haptics } from '../utils/haptics';
import {
  ARABIC_FONT,
  MAX_CONTENT_CHARS,
  blocksOf,
  buildPlan,
  compareDigits,
  compareText,
  detectKind,
  groupDigits,
  parseDigits,
  planDayFor,
  suggestDays,
  todayKey,
  wordsOf,
  type BlockRange,
  type MemoryItem,
  type MemoryKind
} from '../utils/memoryTools';

// ---------- Saved data (this device only) ----------

export interface Progress {
  bestStreak?: number;
  bestAccuracy?: number;
  plan?: { start: string; days: number; minutes: number };
  done?: number[];
}
interface Store {
  custom: MemoryItem[];
  progress: Record<string, Progress>;
}

const STORE_KEY = 'ranked.memory.v1';

function loadStore(): Store {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { custom: parsed.custom ?? [], progress: parsed.progress ?? {} };
    }
  } catch {
    /* storage can be unavailable; Memory Mode still works for this visit */
  }
  return { custom: [], progress: {} };
}

function useMemoryStore() {
  const [store, setStore] = useState<Store>(loadStore);
  const update = (change: (prev: Store) => Store) =>
    setStore((prev) => {
      const next = change(prev);
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  const patchProgress = (id: string, patch: Partial<Progress>) =>
    update((prev) => ({ ...prev, progress: { ...prev.progress, [id]: { ...prev.progress[id], ...patch } } }));
  return { store, update, patchProgress };
}

const card =
  'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const primaryBtn =
  'min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const softBtn =
  'min-h-touch px-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-40';

function describe(item: MemoryItem) {
  const parts = blocksOf(item).length;
  const size = item.kind === 'digits' ? `${item.content.length} digits` : `${wordsOf(item.content).length} words`;
  return `${size} · ${parts} ${parts === 1 ? 'part' : 'parts'}`;
}

// ---------- Screen ----------

export const MemoryModeView: React.FC = () => {
  const { store, update, patchProgress } = useMemoryStore();
  const { setActiveTab } = useRanked();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [photo, setPhoto] = useState(false);

  const items = useMemo(() => [...MEMORY_LIBRARY, ...store.custom], [store.custom]);
  const open = items.find((i) => i.id === openId) ?? null;

  const saveCustom = (item: MemoryItem) => {
    update((prev) => ({ ...prev, custom: [item, ...prev.custom] }));
    setAdding(false);
    setOpenId(item.id);
  };

  if (photo) return <PhotoMemoryView onBack={() => setPhoto(false)} />;

  if (adding) {
    return (
      <AddForm
        onCancel={() => setAdding(false)}
        onSave={saveCustom}
      />
    );
  }

  if (open) {
    return (
      <ItemDetail
        key={open.id}
        item={open}
        progress={store.progress[open.id] ?? {}}
        patch={(p) => patchProgress(open.id, p)}
        onBack={() => setOpenId(null)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">Memory Mode</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Memorize numbers, poems or anything you want to keep. Pick a set below or add your own, and get a
          day-by-day plan.
        </p>
      </div>

      <MemoryAiSearch onSave={saveCustom} onOpenQuran={() => setActiveTab('quran')} />

      <button
        onClick={() => {
          haptics.tap();
          setPhoto(true);
        }}
        className={`${card} w-full p-4 flex items-center gap-3 text-left cursor-pointer hover:border-amber-500/60 transition-colors`}
      >
        <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Camera className="w-6 h-6" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">Photo Memory</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
            Train your visual memory with picture games.
          </span>
        </span>
      </button>

      <button
        onClick={() => {
          haptics.tap();
          setAdding(true);
        }}
        className={`${card} w-full p-4 flex items-center gap-3 text-left cursor-pointer hover:border-fuchsia-500/60 transition-colors`}
      >
        <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400">
          <Plus className="w-6 h-6" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">Add your own</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
            Paste a poem, text or number, or import a text file.
          </span>
        </span>
      </button>

      <div className="space-y-2.5">
        {items.map((item) => {
          const p = store.progress[item.id] ?? {};
          const day = p.plan ? planDayFor(p.plan.start) : 0;
          const Icon = item.kind === 'digits' ? Hash : item.rtl ? BookOpenText : FileText;
          return (
            <div key={item.id} className={`${card} flex items-stretch`}>
              <button
                onClick={() => {
                  haptics.tap();
                  setOpenId(item.id);
                }}
                className="flex-1 min-w-0 p-4 flex items-center gap-3 text-left cursor-pointer"
              >
                <span
                  className={`flex items-center justify-center w-11 h-11 shrink-0 rounded-xl ${
                    item.kind === 'digits'
                      ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                      : 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                  }`}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.title}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">{describe(item)}</span>
                  <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-mono">
                    {p.bestStreak ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Best {p.bestStreak} digits
                      </span>
                    ) : null}
                    {p.bestAccuracy ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Best {Math.round(p.bestAccuracy * 100)}%
                      </span>
                    ) : null}
                    {p.plan ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {day > p.plan.days ? 'Plan done' : `Plan day ${Math.max(1, day)}/${p.plan.days}`}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
              {!item.builtIn && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete “${item.title}”? This can’t be undone.`)) {
                      update((prev) => {
                        const { [item.id]: _gone, ...rest } = prev.progress;
                        return { custom: prev.custom.filter((c) => c.id !== item.id), progress: rest };
                      });
                    }
                  }}
                  aria-label={`Delete ${item.title}`}
                  className="min-h-touch min-w-touch px-3 flex items-center justify-center text-zinc-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-zinc-400 text-center">Your own items are saved on this device only.</p>
    </div>
  );
};

// ---------- Add your own ----------

const AddForm: React.FC<{ onCancel: () => void; onSave: (item: MemoryItem) => void }> = ({ onCancel, onSave }) => {
  const [title, setTitle] = useState('');
  const [raw, setRaw] = useState('');
  const [kindOverride, setKindOverride] = useState<MemoryKind | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const kind = kindOverride ?? detectKind(raw);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    if (/\.(pdf|docx?|pages|rtf|odt)$/i.test(file.name) || file.type === 'application/pdf') {
      setError('PDF and Word files can’t be read here yet. Copy the text and paste it in instead.');
      return;
    }
    if (file.size > 500_000) {
      setError('That file is too large. Try a shorter piece (up to 20,000 characters).');
      return;
    }
    try {
      const text = await file.text();
      setRaw(text);
      setKindOverride(null);
      if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ''));
    } catch {
      setError('Could not read that file. Try pasting the text instead.');
    }
  };

  const save = () => {
    setError('');
    const name = title.trim() || (kind === 'digits' ? 'My number' : 'My text');
    if (raw.length > MAX_CONTENT_CHARS * 2) {
      setError(`That is too long. The limit is ${MAX_CONTENT_CHARS.toLocaleString()} characters.`);
      return;
    }
    let item: MemoryItem;
    if (kind === 'digits') {
      const { prefix, content } = parseDigits(raw);
      if (content.length < 6) return setError('Add at least 6 digits.');
      if (content.length > MAX_CONTENT_CHARS) return setError(`Too long: the limit is ${MAX_CONTENT_CHARS.toLocaleString()} digits.`);
      item = { id: `own_${Date.now()}`, title: name, kind, prefix, content, createdAt: Date.now() };
    } else {
      const content = raw.replace(/\r\n?/g, '\n').trim();
      if (wordsOf(content).length < 5) return setError('Add at least 5 words.');
      if (content.length > MAX_CONTENT_CHARS) return setError(`Too long: the limit is ${MAX_CONTENT_CHARS.toLocaleString()} characters.`);
      item = { id: `own_${Date.now()}`, title: name, kind, content, createdAt: Date.now() };
    }
    haptics.tap();
    onSave(item);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <button onClick={onCancel} className={`${softBtn} inline-flex items-center gap-2`}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className={`${card} p-4 space-y-4`}>
        <h2 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-50">Add your own</h2>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="e.g. My favourite poem, or Phone numbers"
            className="w-full min-h-touch px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            Paste your text or numbers
          </span>
          <textarea
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setError('');
            }}
            rows={9}
            placeholder="Paste a poem, a passage, or digits such as 3.14159 26535 …"
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm leading-relaxed"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.text,text/plain"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <button onClick={() => fileRef.current?.click()} className={`${softBtn} inline-flex items-center gap-2`}>
            <FileUp className="w-4 h-4" /> Import a text file
          </button>
          <span className="text-[11px] text-zinc-400">.txt, .md or .csv</span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            This is {raw.trim() ? 'detected as' : ''}
          </span>
          <div className="flex gap-2" role="radiogroup" aria-label="Kind of material">
            {(['digits', 'text'] as MemoryKind[]).map((k) => (
              <button
                key={k}
                role="radio"
                aria-checked={kind === k}
                onClick={() => setKindOverride(k)}
                className={`min-h-touch px-3.5 rounded-xl text-sm font-semibold border cursor-pointer ${
                  kind === k
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent mem-on'
                    : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {k === 'digits' ? 'Numbers' : 'Text or poem'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-400">
            {raw.length.toLocaleString()} / {MAX_CONTENT_CHARS.toLocaleString()}
          </span>
          <button onClick={save} disabled={!raw.trim()} className={primaryBtn}>
            Save and make a plan
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- One item ----------

type Tab = 'plan' | 'study' | 'recite';

export const ItemDetail: React.FC<{
  item: MemoryItem;
  progress: Progress;
  patch: (p: Partial<Progress>) => void;
  onBack: () => void;
  /** Called each time a typed recital is checked (used by the Quran section to award XP). */
  onChecked?: (info: { expected: string; typed: string; accuracy: number }) => void;
  backLabel?: string;
}> = ({ item, progress, patch, onBack, onChecked, backLabel = 'Back to Memory Mode' }) => {
  const blocks = useMemo(() => blocksOf(item), [item]);
  const [tab, setTab] = useState<Tab>('plan');
  const [focus, setFocus] = useState<BlockRange | null>(null);

  const practise = (range: BlockRange | null, to: Tab) => {
    setFocus(range);
    setTab(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <button onClick={onBack} aria-label={backLabel} className={`${softBtn} px-3`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h2 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-50 truncate">{item.title}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{describe(item)}</p>
        </div>
      </div>

      <div className="p-1 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-white/10 flex gap-1" role="tablist">
        {(
          [
            ['plan', 'Plan', CalendarCheck],
            ['study', 'Study', Eye],
            ['recite', 'Recite', RotateCcw]
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              haptics.tap();
              setTab(id);
            }}
            className={`flex-1 min-h-touch inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold cursor-pointer ${
              tab === id
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      {(item.note || item.meaning) && (
        <details className={`${card} px-3.5 py-2.5 text-sm`}>
          <summary className="cursor-pointer min-h-touch flex items-center font-semibold text-zinc-700 dark:text-zinc-200">
            {item.meaning ? 'Meaning and source' : 'About this text'}
          </summary>
          {item.meaning && (
            <p className="mt-1 whitespace-pre-line leading-relaxed text-zinc-700 dark:text-zinc-300">{item.meaning}</p>
          )}
          {item.note && <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{item.note}</p>}
        </details>
      )}

      {focus && tab !== 'plan' && (
        <div className="flex items-center justify-between gap-2 text-xs rounded-xl px-3 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <span>
            Practising {rangeLabel(focus)} from your plan
          </span>
          <button onClick={() => setFocus(null)} className="font-semibold underline cursor-pointer min-h-touch px-2">
            Use everything
          </button>
        </div>
      )}

      {tab === 'plan' && <PlanTab item={item} blocks={blocks} progress={progress} patch={patch} practise={practise} />}
      {tab === 'study' && <StudyTab item={item} blocks={blocks} range={focus} />}
      {tab === 'recite' && <ReciteTab item={item} blocks={blocks} range={focus} progress={progress} patch={patch} onChecked={onChecked} />}
    </div>
  );
};

function rangeLabel(r: BlockRange): string {
  return r.from === r.to ? `part ${r.from}` : `parts ${r.from}–${r.to}`;
}

function sliceRange(blocks: string[], range: BlockRange | null): { list: string[]; offset: number } {
  const from = range ? Math.max(1, range.from) : 1;
  const to = range ? Math.min(blocks.length, range.to) : blocks.length;
  return { list: blocks.slice(from - 1, to), offset: from - 1 };
}

// ---------- Plan ----------

const PlanTab: React.FC<{
  item: MemoryItem;
  blocks: string[];
  progress: Progress;
  patch: (p: Partial<Progress>) => void;
  practise: (range: BlockRange | null, to: Tab) => void;
}> = ({ blocks, progress, patch, practise }) => {
  const [days, setDays] = useState(progress.plan?.days ?? 7);
  const [minutes, setMinutes] = useState(progress.plan?.minutes ?? 15);

  const draft = useMemo(() => buildPlan(blocks.length, days), [blocks.length, days]);
  const peak = draft.length ? Math.max(...draft.map((d) => d.minutes)) : 0;
  const suggested = useMemo(() => suggestDays(blocks.length, minutes), [blocks.length, minutes]);

  const plan = progress.plan;
  const done = progress.done ?? [];

  if (!plan) {
    return (
      <div className={`${card} p-4 space-y-4`}>
        <div>
          <h3 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-50">Make a memorizing plan</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            New parts are introduced first, then each part comes back 1, 3 and 7 days later. The last day is a full
            recital from memory.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">How many days?</span>
          <div className="flex flex-wrap gap-2">
            {[3, 7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                aria-pressed={days === d}
                className={`min-h-touch min-w-touch px-3.5 rounded-xl text-sm font-semibold border cursor-pointer ${
                  days === d
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent mem-on'
                    : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {d}
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(Math.min(90, Math.max(1, Number(e.target.value) || 1)))}
              aria-label="Number of days"
              className="w-20 min-h-touch px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Minutes you can give each day</span>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                aria-pressed={minutes === m}
                className={`min-h-touch min-w-touch px-3.5 rounded-xl text-sm font-semibold border cursor-pointer ${
                  minutes === m
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent mem-on'
                    : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl px-3 py-2.5 text-sm ${
            peak > minutes ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          {peak > minutes ? (
            <>
              Your busiest day would take about {peak} min, more than {minutes}. {suggested} days would fit.{' '}
              <button onClick={() => setDays(suggested)} className="font-semibold underline cursor-pointer">
                Use {suggested} days
              </button>
            </>
          ) : (
            <>Your busiest day would take about {peak} min. That fits.</>
          )}
        </div>

        <button
          onClick={() => {
            haptics.tap();
            patch({ plan: { start: todayKey(), days, minutes }, done: [] });
          }}
          className={`${primaryBtn} w-full`}
        >
          Start my plan today
        </button>
      </div>
    );
  }

  const full = buildPlan(blocks.length, plan.days);
  const today = planDayFor(plan.start);
  const finished = today > plan.days && done.length >= plan.days;

  const toggle = (day: number) => {
    haptics.tap();
    patch({ done: done.includes(day) ? done.filter((d) => d !== day) : [...done, day] });
  };

  return (
    <div className="space-y-3">
      <div className={`${card} p-4 space-y-2`}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-50">
            {finished ? 'Plan complete' : today > plan.days ? 'Plan ended' : `Day ${Math.max(1, today)} of ${plan.days}`}
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            {done.length}/{plan.days} done
          </span>
        </div>
        <div className="mem-track h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(done.length / plan.days) * 100}%` }} />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              if (window.confirm('Start a new plan? Your ticks for this plan will be cleared.')) {
                patch({ plan: undefined, done: [] });
              }
            }}
            className={softBtn}
          >
            Change plan
          </button>
        </div>
      </div>

      {full.map((d) => {
        const isToday = d.day === today;
        const isDone = done.includes(d.day);
        const missed = d.day < today && !isDone;
        return (
          <div
            key={d.day}
            className={`${card} p-3.5 ${isToday ? 'ring-2 ring-amber-500/60' : ''}`}
            aria-current={isToday ? 'step' : undefined}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggle(d.day)}
                role="checkbox"
                aria-checked={isDone}
                aria-label={`Mark day ${d.day} as done`}
                className={`mem-box min-h-touch min-w-touch shrink-0 rounded-xl border flex items-center justify-center cursor-pointer ${
                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-600 text-transparent'
                }`}
              >
                <Check className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Day {d.day}</span>
                  {isToday && <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">TODAY</span>}
                  {missed && <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">MISSED</span>}
                  {d.final && <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400">FINAL</span>}
                  <span className="ml-auto text-[11px] font-mono text-zinc-400">~{d.minutes} min</span>
                </div>
                <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                  {d.learn && (
                    <li className="flex items-center justify-between gap-2">
                      <span>
                        <b>Learn</b> {rangeLabel(d.learn)}
                      </span>
                      <button onClick={() => practise(d.learn, 'study')} className="text-xs font-semibold underline cursor-pointer min-h-touch px-2">
                        Study
                      </button>
                    </li>
                  )}
                  {d.review.map((r) => (
                    <li key={`${r.from}-${r.to}`} className="flex items-center justify-between gap-2">
                      <span>
                        <b>Review</b> {rangeLabel(r)}
                      </span>
                      <button onClick={() => practise(r, 'recite')} className="text-xs font-semibold underline cursor-pointer min-h-touch px-2">
                        Recite
                      </button>
                    </li>
                  ))}
                  {d.recite && (
                    <li className="flex items-center justify-between gap-2">
                      <span>
                        <b>{d.final ? 'Final test:' : 'Recite'}</b> {d.final ? 'say it all from memory' : 'everything so far'}
                      </span>
                      <button
                        onClick={() => practise(d.final ? null : { from: 1, to: d.learn ? d.learn.to : blocks.length }, 'recite')}
                        className="text-xs font-semibold underline cursor-pointer min-h-touch px-2"
                      >
                        Recite
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Study ----------

const PAGE_PARTS = 3;
const LEVELS = ['Read', 'Some gaps', 'More gaps', 'First letters', 'All hidden'];

const WORD_RE = /([\p{L}\p{M}\p{N}]+(?:['’-][\p{L}\p{M}\p{N}]+)*)/u;

const StudyTab: React.FC<{ item: MemoryItem; blocks: string[]; range: BlockRange | null }> = ({ item, blocks, range }) => {
  const { list, offset } = sliceRange(blocks, range);
  const [page, setPage] = useState(0);
  const [level, setLevel] = useState(0);
  const [group, setGroup] = useState(4);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  const pages = Math.max(1, Math.ceil(list.length / PAGE_PARTS));
  const safePage = Math.min(page, pages - 1);
  const visible = list.slice(safePage * PAGE_PARTS, safePage * PAGE_PARTS + PAGE_PARTS);
  const firstPart = offset + safePage * PAGE_PARTS + 1;

  const reveal = (key: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const changeLevel = (l: number) => {
    setLevel(l);
    setRevealed(new Set());
  };

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = () => {
    try {
      const text = item.kind === 'digits' ? visible.join(' ').split('').join(' ') : visible.join('\n');
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (item.rtl) utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    } catch {
      /* speech not available */
    }
  };

  return (
    <div className="space-y-3">
      <div className={`${card} p-3.5 space-y-2.5`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Hide more as you learn</span>
          {canSpeak && (
            <button onClick={speak} aria-label="Read aloud" className={`${softBtn} px-3 inline-flex items-center gap-2`}>
              <Volume2 className="w-4 h-4" /> Read aloud
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="How much is hidden">
          {LEVELS.slice(0, item.kind === 'digits' ? 3 : 5).map((name, l) => (
            <button
              key={name}
              role="radio"
              aria-checked={level === l}
              onClick={() => changeLevel(l)}
              className={`min-h-touch px-3 rounded-xl text-xs font-semibold border cursor-pointer ${
                level === l
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent mem-on'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {item.kind === 'digits' ? ['Read', 'Half hidden', 'All hidden'][l] : name}
            </button>
          ))}
        </div>
        {item.kind === 'digits' && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            Group digits by
            {[3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                aria-pressed={group === g}
                className={`min-h-touch min-w-touch rounded-lg border text-sm font-semibold cursor-pointer ${
                  group === g ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent mem-on' : 'border-zinc-200 dark:border-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.map((block, bi) => {
        const partNo = firstPart + bi;
        return (
          <div key={partNo} className={`${card} p-4`}>
            <div className="text-[11px] font-mono text-zinc-400 mb-2">
              PART {partNo}
              {item.kind === 'digits' ? ` · digits ${(partNo - 1) * 20 + 1}–${(partNo - 1) * 20 + block.length}` : ''}
            </div>
            {item.kind === 'digits' ? (
              <p className="font-mono text-lg sm:text-xl tracking-wider leading-loose flex flex-wrap gap-x-3 gap-y-1">
                {partNo === 1 && item.prefix ? <span className="text-amber-600 dark:text-amber-400">{item.prefix}</span> : null}
                {groupDigits(block, group).map((g, gi) => {
                  const hidden = level === 2 || (level === 1 && gi % 2 === 1);
                  const key = `${partNo}-${gi}`;
                  const show = !hidden || revealed.has(key);
                  return show ? (
                    <span key={key} onClick={hidden ? () => reveal(key) : undefined}>
                      {g}
                    </span>
                  ) : (
                    <button
                      key={key}
                      onClick={() => reveal(key)}
                      aria-label="Show these digits"
                      className="rounded-md px-1 bg-zinc-200 dark:bg-zinc-700 text-transparent select-none cursor-pointer"
                    >
                      {g}
                    </button>
                  );
                })}
              </p>
            ) : (
              <TextBlock block={block} partNo={partNo} level={level} revealed={revealed} reveal={reveal} rtl={item.rtl} />
            )}
          </div>
        );
      })}

      <div className="flex items-center justify-between">
        <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0} className={softBtn}>
          Previous
        </button>
        <span className="text-xs font-mono text-zinc-400">
          {safePage + 1} / {pages}
        </span>
        <button onClick={() => setPage(Math.min(pages - 1, safePage + 1))} disabled={safePage >= pages - 1} className={softBtn}>
          Next
        </button>
      </div>
    </div>
  );
};

const TextBlock: React.FC<{
  block: string;
  partNo: number;
  level: number;
  revealed: Set<string>;
  reveal: (key: string) => void;
  rtl?: boolean;
}> = ({ block, partNo, level, revealed, reveal, rtl }) => {
  let w = 0;
  return (
    <div
      dir={rtl ? 'rtl' : undefined}
      lang={rtl ? 'ar' : undefined}
      style={rtl ? { fontFamily: ARABIC_FONT } : undefined}
      className={`text-zinc-800 dark:text-zinc-100 space-y-0.5 ${rtl ? 'text-2xl leading-[2.4]' : 'text-base leading-relaxed'}`}
    >
      {block.split('\n').map((line, li) =>
        line.trim() === '' ? (
          <div key={li} className="h-3" />
        ) : (
          <p key={li}>
            {line.split(WORD_RE).map((piece, pi) => {
              if (pi % 2 === 0) return <React.Fragment key={pi}>{piece}</React.Fragment>;
              const idx = w++;
              const hidden =
                level === 4 || level === 3 || (level === 2 && idx % 2 === 1) || (level === 1 && idx % 4 === 3);
              const key = `${partNo}-${idx}`;
              if (!hidden || revealed.has(key)) {
                return (
                  <span key={pi} onClick={hidden ? () => reveal(key) : undefined} className={hidden ? 'text-amber-600 dark:text-amber-400 cursor-pointer' : ''}>
                    {piece}
                  </span>
                );
              }
              const label = level === 3 ? `${piece.slice(0, 1)}${'·'.repeat(Math.min(4, Math.max(0, piece.length - 1)))}` : '_'.repeat(Math.min(8, Math.max(2, piece.length)));
              return (
                <button
                  key={pi}
                  onClick={() => reveal(key)}
                  aria-label="Show this word"
                  className="px-0.5 mx-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700/70 font-mono text-sm cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </p>
        )
      )}
    </div>
  );
};

// ---------- Recite ----------

const ReciteTab: React.FC<{
  item: MemoryItem;
  blocks: string[];
  range: BlockRange | null;
  progress: Progress;
  patch: (p: Partial<Progress>) => void;
  onChecked?: (info: { expected: string; typed: string; accuracy: number }) => void;
}> = ({ item, blocks, range, progress, patch, onChecked }) => {
  const { list } = sliceRange(blocks, range);
  const expected = item.kind === 'digits' ? list.join('') : list.join('\n');
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const { showToast } = useRanked();

  const digitResult = useMemo(
    () => (checked && item.kind === 'digits' ? compareDigits(expected, typed) : null),
    [checked, item.kind, expected, typed]
  );
  const textResult = useMemo(
    () => (checked && item.kind === 'text' ? compareText(expected, typed) : null),
    [checked, item.kind, expected, typed]
  );
  const wholeItem = !range || (range.from <= 1 && range.to >= blocks.length);

  const check = () => {
    haptics.tap();
    setChecked(true);
    if (item.kind === 'text') onChecked?.({ expected, typed, accuracy: compareText(expected, typed).accuracy });
    if (!wholeItem) return;
    if (item.kind === 'digits') {
      const r = compareDigits(expected, typed);
      if (r.streak > (progress.bestStreak ?? 0)) {
        patch({ bestStreak: r.streak });
        if (r.streak > 0) showToast(`New best: ${r.streak} digits in a row`);
      }
    } else {
      const r = compareText(expected, typed);
      if (r.accuracy > (progress.bestAccuracy ?? 0)) {
        patch({ bestAccuracy: r.accuracy });
        if (r.accuracy > 0) showToast(`New best: ${Math.round(r.accuracy * 100)}% recalled`);
      }
    }
  };

  const typedDigitCount = typed.replace(/\D/g, '').length;
  const typedWordCount = wordsOf(typed).length;

  return (
    <div className="space-y-3">
      <div className={`${card} p-4 space-y-3`}>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {item.kind === 'digits'
            ? `Type the digits from memory${item.prefix && (!range || range.from <= 1) ? ` (starts with ${item.prefix})` : ''}. Spaces are ignored.`
            : item.rtl
              ? 'Type it from memory with an Arabic keyboard. Vowel marks (tashkeel) do not matter.'
              : 'Type the text from memory. Capital letters and punctuation do not matter.'}
        </p>
        <textarea
          value={typed}
          onChange={(e) => {
            setTyped(e.target.value);
            setChecked(false);
          }}
          rows={item.kind === 'digits' ? 4 : 8}
          inputMode={item.kind === 'digits' ? 'numeric' : 'text'}
          aria-label="Your answer from memory"
          dir={item.rtl ? 'rtl' : undefined}
          lang={item.rtl ? 'ar' : undefined}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={`w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent leading-relaxed ${
            item.kind === 'digits' ? 'font-mono text-lg tracking-wider' : 'text-sm'
          }`}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-zinc-400">
            {item.kind === 'digits' ? `${typedDigitCount} / ${expected.length} digits` : `${typedWordCount} / ${wordsOf(expected).length} words`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTyped('');
                setChecked(false);
              }}
              className={softBtn}
            >
              Clear
            </button>
            <button onClick={check} disabled={!typed.trim()} className={primaryBtn}>
              Check
            </button>
          </div>
        </div>
      </div>

      {digitResult && (
        <div className={`${card} p-4 space-y-3`} role="status">
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {digitResult.streak === digitResult.total
              ? `Perfect: all ${digitResult.total} digits`
              : `${digitResult.streak} digit${digitResult.streak === 1 ? '' : 's'} in a row`}
          </p>
          <p className="text-xs text-zinc-500">
            {digitResult.correct} of {digitResult.total} digits in the right place
            {digitResult.extra ? ` · ${digitResult.extra} extra typed` : ''}
            {wholeItem && progress.bestStreak ? ` · your best: ${progress.bestStreak}` : ''}
          </p>
          <p className="font-mono text-lg tracking-wider leading-loose break-all" aria-label="The correct digits, marked">
            {digitResult.marks.map((m, i) => (
              <span
                key={i}
                className={
                  (i > 0 && i % 5 === 0 ? 'ml-2 ' : '') +
                  (m === 'ok'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : m === 'wrong'
                      ? 'text-rose-600 dark:text-rose-400 underline decoration-2'
                      : 'text-zinc-400 dark:text-zinc-500')
                }
              >
                {expected[i]}
              </span>
            ))}
          </p>
          <p className="text-[11px] text-zinc-400">Green: right · Red underlined: wrong · Grey: not typed yet</p>
        </div>
      )}

      {textResult && (
        <div className={`${card} p-4 space-y-3`} role="status">
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {Math.round(textResult.accuracy * 100)}% recalled
          </p>
          <p className="text-xs text-zinc-500">
            {textResult.hits} of {textResult.total} words
            {wholeItem && progress.bestAccuracy ? ` · your best: ${Math.round(progress.bestAccuracy * 100)}%` : ''}
          </p>
          <p
            dir={item.rtl ? 'rtl' : undefined}
            lang={item.rtl ? 'ar' : undefined}
            style={item.rtl ? { fontFamily: ARABIC_FONT } : undefined}
            className={item.rtl ? 'text-2xl leading-[2.4]' : 'text-base leading-relaxed'}
          >
            {textResult.words.map((w, i) => (
              <span
                key={i}
                className={w.hit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 underline decoration-2'}
              >
                {w.word}{' '}
              </span>
            ))}
          </p>
          {textResult.extra.length > 0 && (
            <p className="text-xs text-zinc-500">Not in the original: {textResult.extra.slice(0, 12).join(', ')}{textResult.extra.length > 12 ? '…' : ''}</p>
          )}
          <p className="text-[11px] text-zinc-400">Green: recalled · Red underlined: missed</p>
        </div>
      )}
    </div>
  );
};
