import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Crown,
  Eye,
  Heart,
  HeartHandshake,
  MessagesSquare,
  Repeat,
  Wind,
  Lightbulb
} from 'lucide-react';
import {
  EVIDENCE_LABEL,
  PSYCH_CATEGORIES,
  lessonCount,
  readMinutes,
  type PsychCategory,
  type PsychLesson
} from '../data/psychologyLessons';
import { factArt } from '../utils/artwork';
import { haptics } from '../utils/haptics';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  confidence: Crown,
  partner: Heart,
  romance: HeartHandshake,
  leadership: Compass,
  communication: MessagesSquare,
  habits: Repeat,
  emotions: Wind,
  people: Eye
};

const STORE_KEY = 'ranked.psychology.v1';

function loadRead(): string[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw).read ?? [];
  } catch {
    /* storage can be unavailable; progress just won't be remembered */
  }
  return [];
}

const card = 'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const softBtn =
  'min-h-touch px-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer inline-flex items-center justify-center gap-2';

const evidenceTone: Record<string, string> = {
  strong: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  moderate: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  mixed: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  practical: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300'
};

export const PsychologyView: React.FC = () => {
  const [read, setRead] = useState<string[]>(loadRead);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  const category = PSYCH_CATEGORIES.find((c) => c.id === categoryId) ?? null;
  const lesson = category?.lessons.find((l) => l.id === lessonId) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [categoryId, lessonId]);

  const toggleRead = (id: string, value?: boolean) =>
    setRead((prev) => {
      const has = prev.includes(id);
      const want = value ?? !has;
      if (want === has) return prev;
      const next = want ? [...prev, id] : prev.filter((x) => x !== id);
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify({ read: next }));
      } catch {
        /* ignore */
      }
      return next;
    });

  if (category && lesson) {
    return (
      <LessonReader
        category={category}
        lesson={lesson}
        isRead={read.includes(lesson.id)}
        onToggleRead={() => {
          haptics.tap();
          toggleRead(lesson.id);
        }}
        onBack={() => setLessonId(null)}
        onNext={(next) => {
          toggleRead(lesson.id, true);
          setLessonId(next.id);
        }}
      />
    );
  }

  if (category) {
    return (
      <CategoryView
        category={category}
        read={read}
        onBack={() => setCategoryId(null)}
        onOpen={(l) => {
          haptics.tap();
          setLessonId(l.id);
        }}
      />
    );
  }

  return <Overview read={read} onOpen={(c) => { haptics.tap(); setCategoryId(c.id); }} />;
};

// ---------- Overview ----------

const Overview: React.FC<{ read: string[]; onOpen: (c: PsychCategory) => void }> = ({ read, onOpen }) => {
  const total = lessonCount();
  const done = read.length;
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50">Psychology</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Short, practical lessons on confidence, love, leadership and more, based on psychology research. Each one ends with something to try today.
        </p>
      </div>

      <div className={`${card} p-3.5 flex items-center gap-3`}>
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Your progress</span>
            <span className="font-mono text-zinc-500">{done}/{total} lessons</span>
          </div>
          <div className="psy-track h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PSYCH_CATEGORIES.map((c) => {
          const Icon = ICONS[c.id] ?? Lightbulb;
          const n = c.lessons.filter((l) => read.includes(l.id)).length;
          return (
            <button
              key={c.id}
              onClick={() => onOpen(c)}
              className={`${card} p-4 flex items-center gap-3 text-left cursor-pointer hover:border-amber-500/60 transition-colors`}
            >
              <span className={`flex items-center justify-center w-11 h-11 shrink-0 rounded-xl ${c.tile}`}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">{c.title}</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">{c.tagline}</span>
                <span className="block mt-1 text-[10px] font-mono text-zinc-400">
                  {c.lessons.length} lessons · {n} read
                </span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
        General education drawn from psychology research. It is not therapy or medical advice. If a relationship feels unsafe or you are struggling, please talk to a professional or someone you trust.
      </p>
    </div>
  );
};

// ---------- One category ----------

const CategoryView: React.FC<{
  category: PsychCategory;
  read: string[];
  onBack: () => void;
  onOpen: (l: PsychLesson) => void;
}> = ({ category, read, onBack, onOpen }) => {
  const Icon = ICONS[category.id] ?? Lightbulb;
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <button onClick={onBack} aria-label="Back to Psychology" className={`${softBtn} px-3`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-xl ${category.tile}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50 truncate">{category.title}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{category.tagline}</p>
        </div>
      </div>

      <div className="space-y-3">
        {category.lessons.map((l, i) => {
          const isRead = read.includes(l.id);
          return (
            <button
              key={l.id}
              onClick={() => onOpen(l)}
              className={`${card} w-full overflow-hidden flex items-stretch text-left cursor-pointer hover:border-amber-500/60 transition-colors`}
            >
              <img
                src={factArt(category.art, l.id)}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-24 sm:w-32 shrink-0 object-cover"
              />
              <span className="flex-1 min-w-0 p-3.5">
                <span className="block text-[10px] font-mono text-zinc-400">LESSON {i + 1}</span>
                <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">{l.title}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Clock className="w-3 h-3" aria-hidden="true" /> {readMinutes(l)} min
                  </span>
                  <span className={`px-1.5 py-0.5 rounded ${evidenceTone[l.evidence]}`}>
                    {EVIDENCE_LABEL[l.evidence].label}
                  </span>
                  {isRead && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3 h-3" aria-hidden="true" /> Read
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---------- One lesson ----------

const LessonReader: React.FC<{
  category: PsychCategory;
  lesson: PsychLesson;
  isRead: boolean;
  onToggleRead: () => void;
  onBack: () => void;
  onNext: (next: PsychLesson) => void;
}> = ({ category, lesson, isRead, onToggleRead, onBack, onNext }) => {
  const index = category.lessons.findIndex((l) => l.id === lesson.id);
  const next = category.lessons[index + 1];
  const ev = EVIDENCE_LABEL[lesson.evidence];
  const art = useMemo(() => factArt(category.art, lesson.id), [category.art, lesson.id]);

  return (
    <article className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <button onClick={onBack} className={softBtn}>
        <ArrowLeft className="w-4 h-4" /> {category.title}
      </button>

      <div className={`${card} overflow-hidden`}>
        <img src={art} alt="" className="w-full aspect-[16/8] object-cover" decoding="async" />
        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="text-zinc-400">
                LESSON {index + 1} OF {category.lessons.length}
              </span>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Clock className="w-3 h-3" aria-hidden="true" /> {readMinutes(lesson)} min
              </span>
            </div>
            <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50 leading-snug">{lesson.title}</h2>
          </div>

          <div className="space-y-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200">
            {lesson.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="rounded-xl p-3.5 bg-zinc-100/70 dark:bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Key points</h3>
            <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
              {lesson.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-3.5 border border-amber-500/40 bg-amber-500/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">Try this today</h3>
            <p className="text-sm text-zinc-800 dark:text-zinc-100 leading-relaxed">{lesson.action}</p>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <span className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] ${evidenceTone[lesson.evidence]}`}>
              {ev.label}
            </span>
            <p>{ev.hint}</p>
            <p className="font-mono text-[11px]">Source: {lesson.source}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onToggleRead}
          role="checkbox"
          aria-checked={isRead}
          className={`${softBtn} ${isRead ? 'psy-read' : ''}`}
        >
          <Check className="w-4 h-4" /> {isRead ? 'Marked as read' : 'Mark as read'}
        </button>
        {next ? (
          <button
            onClick={() => {
              haptics.tap();
              onNext(next);
            }}
            className="min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer inline-flex items-center gap-2 mem-on"
          >
            Next lesson <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onBack} className={softBtn}>
            Back to lessons
          </button>
        )}
      </div>
    </article>
  );
};
