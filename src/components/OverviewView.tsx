import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { getLevelProgress, getTierColor, CATEGORY_METADATA, MAX_XP } from '../utils/levelMath';
import { HERO_CREST_PATH } from '../data/mockData';
import { LevelingArchitectureModal } from './LevelingArchitectureModal';
import {
  Flame,
  Brain,
  BookOpen,
  Film,
  Activity,
  GraduationCap,
  Globe,
  Sparkles,
  ArrowRight,
  Watch,
  CheckCircle2,
  Trophy,
  Zap,
  Youtube,
  Swords,
  Atom,
  Hourglass,
  MapPin
} from 'lucide-react';
import { CategoryType } from '../types';

export const OverviewView: React.FC = () => {
  const {
    user,
    dailyQuests,
    setActiveTab,
    setChallengePillar,
    gainXp,
    setWearablesModalOpen,
    setStreakModalOpen,
    syncWearables,
    isSyncingWearable,
    openUserProfile
  } = useRanked();

  const [showArchModal, setShowArchModal] = useState(false);

  const progress = getLevelProgress(user.xp);
  const tierStyle = getTierColor(progress.tier);

  const pillarIcons: Record<CategoryType, React.ReactNode> = {
    trivia: <Sparkles className="w-4 h-4 text-cyan-500" />,
    language: <Globe className="w-4 h-4 text-purple-500" />,
    books: <BookOpen className="w-4 h-4 text-amber-500" />,
    movies: <Film className="w-4 h-4 text-pink-500" />,
    fitness: <Activity className="w-4 h-4 text-emerald-500" />,
    degree: <GraduationCap className="w-4 h-4 text-blue-500" />,
    iq: <Brain className="w-4 h-4 text-rose-500" />
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Level Progression Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
          
          {/* Left Column: Crest & Level Designation */}
          <div className="lg:col-span-4 flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 text-left">
            <div
              onClick={() => openUserProfile(user.id)}
              className="relative cursor-pointer group shrink-0 sm:mb-4 touch-manipulation"
            >
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-950 shadow-md group-hover:ring-2 group-hover:ring-amber-500 transition-all">
                <img
                  src={HERO_CREST_PATH}
                  alt="Ranked Mastery Crest"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1 sm:-bottom-2 sm:-right-2 px-2 py-0.5 rounded-md bg-zinc-900 text-amber-400 font-mono text-[10px] sm:text-xs font-bold border border-amber-500/40 shadow-sm">
                {progress.tier.toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1
                onClick={() => openUserProfile(user.id)}
                className="text-xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight text-zinc-900 dark:text-zinc-50 cursor-pointer hover:text-amber-500 transition-colors leading-tight truncate"
              >
                Level {progress.currentLevel} <span className="text-zinc-400 text-base sm:text-lg font-normal">/ 1,000</span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                {progress.tier} Rank · {user.yearsDedicated}y mastery
              </p>
              <button
                onClick={() => openUserProfile(user.id)}
                className="mt-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 touch-manipulation py-1"
              >
                <span>View Profile & Stats</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Level XP Math & Metric Stats */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Progress to Level {Math.min(1000, progress.currentLevel + 1)}
                </span>
                <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400 text-[11px] sm:text-xs">
                  {progress.xpInCurrentLevel.toLocaleString()} / {progress.xpNeededForNextLevel.toLocaleString()} XP ({progress.percent.toFixed(1)}%)
                </span>
              </div>

              {/* High-craft level progress meter */}
              <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400"
                  style={{ width: `${Math.max(2, progress.percent)}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 font-mono gap-1 sm:gap-2">
                <span>Total: {user.xp.toLocaleString()} XP</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="hidden sm:inline">Goal: {MAX_XP.toLocaleString()} XP ·</span>
                  <button
                    onClick={() => setShowArchModal(true)}
                    className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer touch-manipulation py-0.5"
                  >
                    <Hourglass className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>Leveling Curve Guide</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div
                onClick={() => setStreakModalOpen(true)}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all group touch-manipulation min-h-[58px]"
              >
                <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                    <span className="group-hover:text-amber-500 transition-colors">Streak</span>
                  </div>
                  {!user.streakClaimedToday ? (
                    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 animate-pulse">
                      Claim!
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-emerald-500">
                      ✓ Done
                    </span>
                  )}
                </div>
                <p className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {user.streakDays} <span className="text-xs font-normal text-zinc-500">days</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 min-h-[58px]">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1">
                  <Brain className="w-3.5 h-3.5 text-purple-500" />
                  <span>Verified IQ</span>
                </div>
                <p className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {user.stats.iqScore} <span className="text-xs font-normal text-zinc-500">Mensa</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 min-h-[58px]">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Bio-Km</span>
                </div>
                <p className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {user.stats.kmLogged.toLocaleString()} <span className="text-xs font-normal text-zinc-500">km</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 min-h-[58px]">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Books Read</span>
                </div>
                <p className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {user.stats.booksRead} <span className="text-xs font-normal text-zinc-500">tomes</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Quick Access: Mobile Horizontal Carousel / Desktop 5-Col Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5 sm:hidden">
          <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Quick Modules
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            Swipe sideways →
          </span>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible sm:pb-0">
          <div
            onClick={() => setActiveTab('challenges')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-amber-500/70 dark:hover:border-amber-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" /> 2P & Solo
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                1v1 Mind Games
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Chess, Sudoku, Wordle, & Mind Matrix.
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Play Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('map')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-emerald-500/70 dark:hover:border-emerald-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-emerald-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Geolocation
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                Player Radar Map
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Enable GPS & view players and their levels.
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Explore Radar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('science')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-cyan-500/70 dark:hover:border-cyan-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-cyan-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" /> Discovery Cards
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-500 transition-colors">
                Science Codex
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Vocabulary, facts & breakthrough quizzes.
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Study Codex</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('library')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-blue-500/70 dark:hover:border-blue-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-blue-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Online Library
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                Foundational Books
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Marcus Aurelius, Einstein, Sun Tzu, Nietzsche.
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Read Classics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('academy')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-red-500/70 dark:hover:border-red-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-red-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5" /> Video Academy
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-red-500 transition-colors">
                Masterclasses
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Quantum physics, neuroscience & cinema.
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-red-600 dark:text-red-400">
              <span>Watch Lessons</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: 7-Pillars of Mastery & Daily Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: 7 Pillars of Life Mastery Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                7 Mastery Pillars
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Comprehensive score across intellectual, physical, and academic disciplines.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('challenges')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Train Disciplines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {(Object.keys(CATEGORY_METADATA) as CategoryType[]).map(catKey => {
              const meta = CATEGORY_METADATA[catKey];
              const score = user.pillarMastery[catKey] || 50;

              return (
                <button
                  type="button"
                  key={catKey}
                  onClick={() => {
                    setChallengePillar(catKey);
                    setActiveTab('challenges');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label={`Open ${meta.name}: ${score}% mastery`}
                  className="group block w-full text-left cursor-pointer p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 hover:border-amber-400/60 dark:hover:border-amber-400/40 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        {pillarIcons[catKey]}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {meta.name}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2 hidden sm:inline">
                          {meta.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200 tabular-nums">
                        {score}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${score}%`,
                        backgroundColor: meta.color
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Daily Challenges & Wearable Sync Hub */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Quests Card */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Daily Quests</span>
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Resets in 11h 37m · Complete for bonus streak XP
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {dailyQuests.map(quest => (
                <div
                  key={quest.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    quest.completed
                      ? 'border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {quest.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        <span>{quest.title}</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {quest.description}
                      </p>
                      <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                        +{quest.xpReward.toLocaleString()} XP Reward
                      </p>
                    </div>

                    {!quest.completed ? (
                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="min-h-[44px] min-w-[56px] sm:min-h-0 sm:min-w-0 px-3.5 py-2 sm:py-1 sm:px-2.5 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white whitespace-nowrap shrink-0 transition-colors touch-manipulation flex items-center justify-center"
                      >
                        Start
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/40">
                        Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wearables, Reading & Movies Sync Card */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Watch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                    Connected Apps & Settings
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Sync Kindle, Goodreads, Letterboxd & Strava
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWearablesModalOpen(true)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Settings
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setWearablesModalOpen(true)}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/50 transition-colors text-left space-y-1"
              >
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Reading Apps</span>
                </div>
                <p className="text-[10px] text-zinc-500">Kindle & Goodreads</p>
              </button>

              <button
                onClick={() => setWearablesModalOpen(true)}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 hover:border-pink-500/50 transition-colors text-left space-y-1"
              >
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Movie Apps</span>
                </div>
                <p className="text-[10px] text-zinc-500">Letterboxd & IMDb</p>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Leveling Architecture & Pacing Guide Modal */}
      <LevelingArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />

    </div>
  );
};
