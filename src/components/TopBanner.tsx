import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { getLevelProgress } from '../utils/levelMath';
import { HERO_CREST_PATH } from '../data/mockData';

/** Slim banner pinned to the top of every screen: level, rank and XP bar. Tap to open the profile. */
export const TopBanner: React.FC = () => {
  const { user, openUserProfile, setSettingsSheetOpen } = useRanked();
  const progress = getLevelProgress(user.xp);
  return (
    <div className="mb-3 flex items-center gap-2">
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
  );
};
