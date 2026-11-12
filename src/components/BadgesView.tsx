import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { Badge, BadgeRarity } from '../types';
import {
  Trophy,
  Sparkles,
  BookOpen,
  Globe,
  Flame,
  Brain,
  Film,
  GraduationCap,
  Crown,
  Lock,
  CheckCircle,
  X,
  Activity
} from 'lucide-react';

export const BadgesView: React.FC = () => {
  const { badges, user } = useRanked();
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [inspectBadge, setInspectBadge] = useState<Badge | null>(null);

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    Globe: <Globe className="w-5 h-5" />,
    Flame: <Flame className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
    Film: <Film className="w-5 h-5" />,
    GraduationCap: <GraduationCap className="w-5 h-5" />,
    Trophy: <Trophy className="w-5 h-5" />,
    Crown: <Crown className="w-5 h-5" />,
    Activity: <Activity className="w-5 h-5" />
  };

  const rarityColors: Record<BadgeRarity, { border: string; bg: string; text: string; glow: string }> = {
    Common: {
      border: 'border-zinc-300 dark:border-zinc-700',
      bg: 'bg-zinc-100 dark:bg-zinc-800',
      text: 'text-zinc-600 dark:text-zinc-300',
      glow: ''
    },
    Rare: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-950/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      glow: 'shadow-cyan-500/10'
    },
    Epic: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-950/20',
      text: 'text-purple-600 dark:text-purple-400',
      glow: 'shadow-purple-500/10'
    },
    Legendary: {
      border: 'border-amber-500/60',
      bg: 'bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    Mythic: {
      border: 'border-yellow-400',
      bg: 'bg-gradient-to-br from-amber-500/20 via-yellow-400/20 to-amber-600/20',
      text: 'text-yellow-600 dark:text-yellow-300',
      glow: 'shadow-yellow-500/30 shadow-lg'
    }
  };

  const filteredBadges = badges.filter(b => {
    if (selectedRarity === 'all') return true;
    if (selectedRarity === 'unlocked') return user.unlockedBadgeIds.includes(b.id);
    return b.rarity.toLowerCase() === selectedRarity.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            Collectible Digital Badges
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Verified proof tokens of life accomplishments, endurance feats, and academic credentials.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-x-auto scrollbar-none">
          {['all', 'unlocked', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap capitalize transition-colors ${
                selectedRarity === r
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map(b => {
          const isUnlocked = user.unlockedBadgeIds.includes(b.id);
          const rarity = rarityColors[b.rarity];

          return (
            <div
              key={b.id}
              onClick={() => setInspectBadge(b)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 relative group ${
                isUnlocked
                  ? `${rarity.border} bg-white dark:bg-zinc-900/90 hover:scale-[1.01] ${rarity.glow}`
                  : 'border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-900/40 opacity-70 hover:opacity-90'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    isUnlocked
                      ? `${rarity.border} ${rarity.bg} ${rarity.text}`
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {iconMap[b.iconName] || <Trophy className="w-5 h-5" />}
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${rarity.text}`}>
                    {b.rarity}
                  </span>
                  <p className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                    +{b.xpReward.toLocaleString()} XP
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>{b.title}</span>
                  {!isUnlocked && <Lock className="w-3.5 h-3.5 text-zinc-400" />}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px]">
                {isUnlocked ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Unlocked
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Required: Level {b.requiredLevel || 1}
                  </span>
                )}
                <span className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Inspection Modal */}
      {inspectBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl text-center space-y-5">
            <div className="flex justify-end">
              <button
                onClick={() => setInspectBadge(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center border-2 shadow-lg bg-zinc-950 border-amber-500/60 text-amber-400">
              {iconMap[inspectBadge.iconName] || <Trophy className="w-8 h-8" />}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                {inspectBadge.rarity} Badge
              </span>
              <h3 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                {inspectBadge.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 px-4 leading-relaxed">
                {inspectBadge.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Mastery XP Grant:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  +{inspectBadge.xpReward.toLocaleString()} XP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className={user.unlockedBadgeIds.includes(inspectBadge.id) ? 'text-emerald-500 font-bold' : 'text-zinc-400'}>
                  {user.unlockedBadgeIds.includes(inspectBadge.id) ? 'Verified Unlocked' : `Requires Level ${inspectBadge.requiredLevel}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => setInspectBadge(null)}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
