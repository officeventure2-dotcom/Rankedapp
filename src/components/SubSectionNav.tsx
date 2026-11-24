import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import {
  Trophy,
  Globe,
  MessageCircle,
  Award,
  User,
  MoreVertical
} from 'lucide-react';
import { haptics } from '../utils/haptics';
import { BackBar } from './HubTiles';

const PROFILE_SECTIONS = [
  { id: 'social', label: 'Social Feed', icon: <Globe className="w-4 h-4" /> },
  { id: 'overview', label: 'Info & Pillars', icon: <User className="w-4 h-4" /> },
  { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
  { id: 'chat', label: 'Direct Messages', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'badges', label: 'Badges Catalog', icon: <Award className="w-4 h-4" /> }
] as const;

/** Profile opens on the feed; every other section lives behind the three-dot menu. */
const ProfileBar: React.FC = () => {
  const { activeTab, setActiveTab } = useRanked();
  const [open, setOpen] = useState(false);
  const current = PROFILE_SECTIONS.find(t => t.id === activeTab) || PROFILE_SECTIONS[0];
  return (
    <div className="mb-4 relative flex items-center justify-between gap-3">
      <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Profile</h1>
      <button
        aria-label="More sections" aria-haspopup="menu" aria-expanded={open}
        onClick={() => { haptics.tap(); setOpen(o => !o); }}
        className="w-11 h-11 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 cursor-pointer"
      ><MoreVertical className="w-5 h-5" /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 top-12 z-50 w-56 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl">
            {PROFILE_SECTIONS.map(t => (
              <button
                key={t.id} role="menuitem"
                onClick={() => { haptics.tap(); setOpen(false); setActiveTab(t.id); }}
                className={`w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-semibold cursor-pointer ${t.id === current.id ? 'bg-amber-500/15 text-amber-500' : 'text-zinc-700 dark:text-zinc-200'}`}
              >{t.icon}{t.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const SubSectionNav: React.FC = () => {
  const { activeTab, setActiveTab } = useRanked();

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
  }
  if (activeTab === 'overview' || activeTab === 'leaderboard' || activeTab === 'social' || activeTab === 'chat' || activeTab === 'badges') {
    return <ProfileBar />;
  }

  return null;
};
