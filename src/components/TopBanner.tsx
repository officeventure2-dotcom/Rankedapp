import React from 'react';
import { Activity, BookOpen, Brain, Check, Film, GraduationCap, Globe, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { CategoryType } from '../types';
import { useRanked } from '../context/RankedContext';
import { getLevelProgress } from '../utils/levelMath';
import { HERO_CREST_PATH } from '../data/mockData';

/** Slim banner pinned to the top of every screen: level, rank and XP bar. Tap to open the profile. */
const QUEST_ICON: Record<CategoryType, React.ReactNode> = {
  trivia: <Sparkles className="w-3.5 h-3.5" />,
  language: <Globe className="w-3.5 h-3.5" />,
  books: <BookOpen className="w-3.5 h-3.5" />,
  movies: <Film className="w-3.5 h-3.5" />,
  fitness: <Activity className="w-3.5 h-3.5" />,
  degree: <GraduationCap className="w-3.5 h-3.5" />,
  iq: <Brain className="w-3.5 h-3.5" />
};

export const TopBanner: React.FC = () => {
  const { user, openUserProfile, setSettingsSheetOpen, dailyQuests, activeTab, setActiveTab, showToast } = useRanked();
  const progress = getLevelProgress(user.xp);
  return (
    <div className="mb-3 space-y-2">
    <div className="flex items-center gap-2">
      <button
        onClick={() => openUserProfile(user.id)}
        aria-label={`Open profile, level ${progress.currentLevel}`}
        className="flex-1 min-w-0 min-h-touch flex items-center gap-3 px-3 py-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-left cursor-pointer"
      >
        <img src={HERO_CREST_PATH} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" />
        <span className="flex-1 min-w-0">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50 truncate">Level {progress.currentLevel} · {progress.tier}</span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0">{progress.percent.toFixed(0)}%</span>
          </span>
          <span className="mt-1 block h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <span className="block h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: `${Math.max(2, progress.percent)}%` }} />
          </span>
        </span>
      </button>
      <button
        onClick={() => setSettingsSheetOpen(true)}
        aria-label="Open quick settings"
        className="min-h-touch min-w-touch flex items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
    {activeTab === 'scroll' && dailyQuests.length > 0 && (
      <div className="flex items-center gap-2 px-1" role="group" aria-label="Daily quests">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1">Daily</span>
        {dailyQuests.map((q) => {
          const pct = Math.min(100, Math.round((q.current / Math.max(1, q.target)) * 100));
          return (
            <button
              key={q.id}
              onClick={() => (q.completed ? showToast(`Done: ${q.title}`) : setActiveTab('challenges'))}
              aria-label={`${q.title}: ${q.completed ? 'done' : `${q.current} of ${q.target} ${q.unit}`}`}
              title={q.title}
              className="w-8 h-8 rounded-full p-[2.5px] cursor-pointer shrink-0"
              style={{ background: `conic-gradient(${q.completed ? '#10b981' : '#f59e0b'} ${q.completed ? 100 : pct}%, rgba(113,113,122,0.35) 0)` }}
            >
              <span className={`w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 ${q.completed ? 'text-emerald-500' : 'text-zinc-700 dark:text-zinc-200'}`}>
                {q.completed ? <Check className="w-3.5 h-3.5" /> : QUEST_ICON[q.category]}
              </span>
            </button>
          );
        })}
      </div>
    )}
    </div>
  );
};
