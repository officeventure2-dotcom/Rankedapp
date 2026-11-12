import React from 'react';
import { useRanked } from '../context/RankedContext';
import {
  calculateDailyStreakXp,
  getRevolvingStreakTrack,
  getUpcomingMilestone,
  STREAK_MILESTONES
} from '../utils/streakMath';
import {
  Flame,
  X,
  Trophy,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Gift,
  ArrowRight,
  Zap,
  TrendingUp,
  FastForward,
  Clock
} from 'lucide-react';
import { haptics } from '../utils/haptics';

export const DailyStreakModal: React.FC = () => {
  const {
    user,
    streakModalOpen,
    setStreakModalOpen,
    claimDailyStreakBonus,
    advanceStreakDaySimulated
  } = useRanked();

  if (!streakModalOpen) return null;

  const isClaimedToday = !!user.streakClaimedToday;
  const currentCalc = calculateDailyStreakXp(user.streakDays);
  const nextMilestone = getUpcomingMilestone(user.streakDays);
  const daysUntilNextMilestone = Math.max(0, nextMilestone.day - user.streakDays);
  const revolvingTrack = getRevolvingStreakTrack(user.streakDays, isClaimedToday);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto pb-safe">
        
        {/* Mobile Bottom Sheet Pull Affordance */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700/80 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-rose-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10 border-b border-zinc-100 dark:border-zinc-800/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 fill-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50 leading-tight">
                  Daily Streak
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 sm:line-clamp-none">
                Compound daily XP bonuses towards Level 1,000.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStreakModalOpen(false)}
            className="p-2 min-h-touch min-w-touch rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner: Current Streak Counter & Retention Shield */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-zinc-900/50 border border-amber-500/30 relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Unbroken Polymath Discipline
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
                  {user.streakDays}
                </span>
                <span className="text-base font-semibold text-zinc-500 dark:text-zinc-400">
                  Consecutive Days
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Total streak bonus earned to date:{' '}
                <strong className="font-mono text-amber-600 dark:text-amber-400">
                  +{(user.totalStreakXpEarned || 139200).toLocaleString()} XP
                </strong>
              </p>
            </div>

            {/* Streak Shield / Grace Protection Status */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1 sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Streak Shield Active</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                {user.streakFreezeAvailable ?? 2} free freeze protections left
              </p>
              <span className="text-[10px] text-zinc-400 block font-mono">
                Preserves rank if day is missed
              </span>
            </div>
          </div>

          {/* Today's Reward Claim Action Card */}
          <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                Today's Attendance Reward (Day {user.streakDays})
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-amber-500">
                  +{currentCalc.totalDailyXp.toLocaleString()} XP
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  (500 Base + {(Math.min(user.streakDays, 100) * 50).toLocaleString()} Loyalty
                  {currentCalc.milestoneBonus > 0 ? ` + ${currentCalc.milestoneBonus.toLocaleString()} Milestone` : ''})
                </span>
              </div>
            </div>

            {isClaimedToday ? (
              <div className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-xs whitespace-nowrap min-h-[48px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Claimed for Today · Next Opens Tomorrow</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  haptics.success();
                  claimDailyStreakBonus();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer touch-manipulation"
              >
                <Gift className="w-4 h-4" />
                <span>Claim Day {user.streakDays} Bonus (+{currentCalc.totalDailyXp.toLocaleString()} XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* 7-Day Revolving Calendar Attendance Track */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Consecutive Day Track</span>
            </h3>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono truncate ml-2">
              Next: Day {nextMilestone.day} ({daysUntilNextMilestone}d)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {revolvingTrack.map(day => {
              const isPast = day.status === 'completed';
              const isCurrent = day.status === 'current';
              const isMilestone = day.isMilestone;

              return (
                <div
                  key={day.dayNumber}
                  className={`p-1 sm:p-2.5 rounded-xl border text-center transition-all relative flex flex-col justify-between min-h-[76px] sm:min-h-[90px] ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/40'
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : isMilestone
                      ? 'border-yellow-500/40 bg-yellow-500/5'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-70'
                  }`}
                >
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold block text-zinc-500 dark:text-zinc-400 truncate">
                      D{day.dayNumber}
                    </span>
                    {isMilestone && (
                      <span className="hidden sm:inline-block mt-0.5 text-[9px] font-mono font-bold text-yellow-500 bg-yellow-500/10 px-1 rounded">
                        ★
                      </span>
                    )}
                  </div>

                  <div className="my-0.5 sm:my-1 flex items-center justify-center">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500 animate-bounce" />
                    ) : isMilestone ? (
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    )}
                  </div>

                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold tabular-nums truncate ${
                    isCurrent ? 'text-amber-500' : isPast ? 'text-emerald-500' : 'text-zinc-400'
                  }`}>
                    +{day.xpReward >= 1000 ? `${(day.xpReward / 1000).toFixed(1)}k` : day.xpReward}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Roadmap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Retention Milestone Bonuses</span>
            </h3>
            <span className="text-[11px] text-zinc-400">
              Long-term compounding attendance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STREAK_MILESTONES.slice(2, 6).map(m => {
              const isUnlocked = user.streakDays >= m.day;
              const isNext = m.day === nextMilestone.day;

              return (
                <div
                  key={m.day}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isUnlocked
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : isNext
                      ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/30'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 opacity-75'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {m.title}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        Day {m.day}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">
                      {m.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 block tabular-nums">
                      +{m.bonusXp.toLocaleString()} XP
                    </span>
                    <span className="text-[10px] font-medium text-zinc-400">
                      {isUnlocked ? 'Achieved ✓' : `${m.day - user.streakDays}d left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer & User Interactive Testing Strip */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Interactive Streak Testing:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={advanceStreakDaySimulated}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
              title="Fast-forward one day to simulate tomorrow's consecutive visit"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Simulate Next Day (Day {user.streakDays + 1})</span>
            </button>

            <button
              onClick={() => setStreakModalOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
