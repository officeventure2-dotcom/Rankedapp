import React, { useState } from 'react';
import { Activity, BookOpen, Brain, Check, Film, GraduationCap, Globe, MessageCircle, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { CategoryType } from '../types';
import { useRanked } from '../context/RankedContext';
import { getLevelProgress } from '../utils/levelMath';
import { HERO_CREST_PATH } from '../data/mockData';
import { CHALLENGE_ITEMS } from './ChallengesView';
import { KNOWLEDGE_ITEMS } from './KnowledgeHub';

// Search jumps to a section: every Challenges and Knowledge tile plus the main pages.
// shortcut: matches section names only, not content inside them; add content search when asked.
const SEARCH_TARGETS = [
  ...CHALLENGE_ITEMS.map(i => ({ label: i.label, where: 'Challenges', go: () => ({ tab: 'challenges' as const, pillar: i.id }) })),
  ...KNOWLEDGE_ITEMS.map(i => ({ label: i.label, where: 'Knowledge', go: () => ({ tab: i.id }) })),
  ...[['Leaderboard', 'leaderboard'], ['Social Feed', 'social'], ['Direct Messages', 'chat'], ['Badges', 'badges'], ['Radar Map', 'map']]
    .map(([label, tab]) => ({ label, where: 'Go to', go: () => ({ tab }) }))
];

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
  const { user, openUserProfile, setSettingsSheetOpen, dailyQuests, activeTab, setActiveTab, showToast, setChallengePillar } = useRanked();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = q ? SEARCH_TARGETS.filter(t => t.label.toLowerCase().includes(q)).slice(0, 6) : [];
  const open = (t: typeof SEARCH_TARGETS[number]) => {
    const r = t.go() as { tab: any; pillar?: any };
    if (r.pillar) setChallengePillar(r.pillar);
    setActiveTab(r.tab);
    setQuery('');
  };
  const progress = getLevelProgress(user.xp);
  return (
    <div className="mb-3 space-y-2">
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => openUserProfile(user.id)}
        aria-label={`Open profile, level ${progress.currentLevel}`}
        className="flex-1 min-w-0 mr-1.5 min-h-touch flex items-center gap-3 px-3 py-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-left cursor-pointer"
      >
        <img src={HERO_CREST_PATH} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" />
        <span className="flex-1 min-w-0">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50 truncate">Level {progress.currentLevel}<span className="hidden min-[420px]:inline"> · {progress.tier}</span></span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0">{progress.percent.toFixed(0)}%</span>
          </span>
          <span className="mt-1 block h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <span className="block h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: `${Math.max(2, progress.percent)}%` }} />
          </span>
        </span>
      </button>
      <button
        onClick={() => setActiveTab('chat')}
        aria-label="Direct messages"
        className="min-h-touch min-w-touch flex items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      <button
        onClick={() => setSettingsSheetOpen(true)}
        aria-label="Open quick settings"
        className="min-h-touch min-w-touch flex items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
    <div>
      <label className="flex items-center gap-2 px-3 min-h-touch rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:ring-1 focus-within:ring-amber-500">
        <Search className="w-4 h-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <input
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && results[0]) open(results[0]); if (e.key === 'Escape') setQuery(''); }}
          placeholder="Search games, books, sections…"
          aria-label="Search sections"
          className="bare-input flex-1 min-w-0 bg-transparent text-base py-2 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
        />
      </label>
        {q && (
          <ul className="mt-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl p-1">
            {results.length === 0 && <li className="px-3 py-2 text-xs text-zinc-500">No match</li>}
            {results.map(t => (
              <li key={t.where + t.label}>
                <button onClick={() => open(t)} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-left text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
                  <span>{t.label}</span><span className="text-[10px] font-mono text-zinc-500">{t.where}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
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
              className="w-11 h-11 flex items-center justify-center cursor-pointer shrink-0"
            >
              {/* 32px ring inside a 44px tap area */}
              <span className="w-8 h-8 rounded-full p-[2.5px]" style={{ background: `conic-gradient(${q.completed ? '#10b981' : '#f59e0b'} ${q.completed ? 100 : pct}%, rgba(113,113,122,0.35) 0)` }}>
                <span className={`w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 ${q.completed ? 'text-emerald-500' : 'text-zinc-700 dark:text-zinc-200'}`}>
                  {q.completed ? <Check className="w-3.5 h-3.5" /> : QUEST_ICON[q.category]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    )}
    </div>
  );
};
