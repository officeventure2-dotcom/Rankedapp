import React from 'react';
import { useRanked } from '../context/RankedContext';
import {
  Trophy,
  Globe,
  MessageCircle,
  Award,
  User
} from 'lucide-react';
import { haptics } from '../utils/haptics';
import { BackBar } from './HubTiles';

export const SubSectionNav: React.FC = () => {
  const { activeTab, setActiveTab } = useRanked();

  // Determine current hub configuration
  let subTabs: Array<{ id: string; label: string; icon: React.ReactNode }> | null = null;
  let hubName = '';

  if (activeTab === 'knowledge') return null;
  if (activeTab === 'books' || activeTab === 'library' || activeTab === 'store') {
    const tabs = [['books', 'My Books'], ['library', 'Read'], ['store', 'Store']] as const;
    return (
      <div className="mb-4 space-y-3">
        <BackBar label="Knowledge" onBack={() => setActiveTab('knowledge')} />
        <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Books sections">
          {tabs.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}
              className={`min-h-touch rounded-xl text-sm font-semibold cursor-pointer border ${activeTab === id ? 'mem-on bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent' : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'}`}>{label}</button>
          ))}
        </div>
      </div>
    );
  }
  if (activeTab === 'academy' || activeTab === 'science' || activeTab === 'language' || activeTab === 'memory' || activeTab === 'psychology' || activeTab === 'quran') {
    return <BackBar label="Knowledge" onBack={() => setActiveTab('knowledge')} />;
  } else if (
    activeTab === 'overview' ||
    activeTab === 'leaderboard' ||
    activeTab === 'social' ||
    activeTab === 'chat' ||
    activeTab === 'badges'
  ) {
    hubName = 'Profile & Ranks';
    subTabs = [
      { id: 'overview', label: 'Info & Pillars', icon: <User className="w-3.5 h-3.5" /> },
      { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-3.5 h-3.5" /> },
      { id: 'social', label: 'Social Feed', icon: <Globe className="w-3.5 h-3.5" /> },
      { id: 'chat', label: 'Direct Messages', icon: <MessageCircle className="w-3.5 h-3.5" /> },
      { id: 'badges', label: 'Badges Catalog', icon: <Award className="w-3.5 h-3.5" /> }
    ];
  }

  // If on Home ('overview') or Map ('map'), no sub-section bar needed
  if (!subTabs) return null;

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Transparent Glass Sub-Section Switcher (Jakob's Law UX) */}
        <div className="p-1 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/60 dark:border-white/10 shadow-sm flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {subTabs.map(tab => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptics.tap();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-[1.02]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-amber-400 dark:text-amber-600' : 'text-zinc-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Context Pill */}
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 hidden md:block">
          {hubName}
        </span>
      </div>
    </div>
  );
};
