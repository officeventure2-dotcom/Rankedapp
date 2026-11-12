import React from 'react';
import { useRanked } from '../context/RankedContext';
import { getTierForLevel, getTierColor, CATEGORY_METADATA } from '../utils/levelMath';
import { BADGES_CATALOG } from '../data/mockData';
import {
  X,
  Trophy,
  Brain,
  BookOpen,
  Activity,
  GraduationCap,
  Sparkles,
  Globe,
  Film,
  Flame,
  MessageCircle,
  Watch,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CategoryType } from '../types';
import { Avatar } from './Avatar';

export const UserProfileModal: React.FC = () => {
  const {
    inspectingUser,
    closeUserProfile,
    user,
    setActiveFriendId,
    setActiveTab
  } = useRanked();

  if (!inspectingUser) return null;

  const tier = getTierForLevel(inspectingUser.level);
  const tierColor = getTierColor(tier);
  const isSelf = inspectingUser.id === user.id || inspectingUser.id === 'usr_me';

  const pillarIcons: Record<CategoryType, React.ReactNode> = {
    trivia: <Sparkles className="w-3.5 h-3.5 text-cyan-500" />,
    language: <Globe className="w-3.5 h-3.5 text-purple-500" />,
    books: <BookOpen className="w-3.5 h-3.5 text-amber-500" />,
    movies: <Film className="w-3.5 h-3.5 text-pink-500" />,
    fitness: <Activity className="w-3.5 h-3.5 text-emerald-500" />,
    degree: <GraduationCap className="w-3.5 h-3.5 text-blue-500" />,
    iq: <Brain className="w-3.5 h-3.5 text-rose-500" />
  };

  const unlockedBadges = BADGES_CATALOG.filter(b =>
    inspectingUser.unlockedBadgeIds?.includes(b.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl max-h-[90vh] overflow-y-auto pb-safe">
        
        {/* Mobile Pull Affordance */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-600 mx-auto mt-2 sm:hidden shrink-0" />
        
        {/* Cover & Top Bar */}
        <div className="relative h-28 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 p-4 flex justify-end items-start">
          <button
            onClick={closeUserProfile}
            className="p-1.5 rounded-full bg-black/40 text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 sm:px-8 pb-6 -mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar src={inspectingUser.avatar} name={inspectingUser.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl bg-zinc-800" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50">
                    {inspectingUser.name}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${tierColor.badgeBorder} ${tierColor.badgeBg} ${tierColor.badgeText}`}>
                    Level {inspectingUser.level} · {tier.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-400">
                  {inspectingUser.handle} · {inspectingUser.yearsDedicated} years dedicated mastery
                </p>
              </div>
            </div>

            {!isSelf && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    closeUserProfile();
                    setActiveFriendId(inspectingUser.id);
                    setActiveTab('chat');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {inspectingUser.bio}
          </p>

          {/* Core Metric KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-0.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Cumulative XP</span>
              </div>
              <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {inspectingUser.xp.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-0.5">
                <Brain className="w-3.5 h-3.5 text-rose-500" />
                <span>Verified IQ</span>
              </div>
              <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {inspectingUser.stats.iqScore} <span className="text-xs font-normal text-zinc-400">pts</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-0.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Endurance Km</span>
              </div>
              <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {inspectingUser.stats.kmLogged.toLocaleString()} <span className="text-xs font-normal text-zinc-400">km</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-0.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Books Read</span>
              </div>
              <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {inspectingUser.stats.booksRead} <span className="text-xs font-normal text-zinc-400">tomes</span>
              </p>
            </div>
          </div>

          {/* 7 Pillars Radar Scores */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              Disciplinary Mastery Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(CATEGORY_METADATA) as CategoryType[]).map(cat => {
                const score = inspectingUser.pillarMastery[cat] || 50;
                const meta = CATEGORY_METADATA[cat];

                return (
                  <div
                    key={cat}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30"
                  >
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        {pillarIcons[cat]}
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{meta.name}</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
                        {score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${score}%`, backgroundColor: meta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Achievements & Badges Showcase */}
          <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Unlocked Badges & Verified Proof ({unlockedBadges.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unlockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {badge.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {badge.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span className="text-amber-500 font-semibold">+{badge.xpReward.toLocaleString()} XP</span>
                      <span>·</span>
                      <span>{badge.rarity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close Action */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              onClick={closeUserProfile}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
            >
              Done Viewing Profile
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
