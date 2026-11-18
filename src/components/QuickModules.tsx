import React from 'react';
import { useRanked } from '../context/RankedContext';
import { ArrowRight, Atom, BookOpen, BookOpenText, BrainCircuit, GalleryVertical, HeartHandshake, MapPin, Swords, Youtube } from 'lucide-react';

/** Shortcuts to every mode of the app. Lives at the top of the Arena tab. */
export const QuickModules: React.FC = () => {
  const { setActiveTab } = useRanked();
  return (
    <>
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
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Swords className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-amber-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                2P & Solo
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                1v1 Mind Games
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Chess, Sudoku, Wordle, & Mind Matrix.
              </p>
              </div>
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
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-emerald-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Geolocation
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                Player Radar Map
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Enable GPS & view players and their levels.
              </p>
              </div>
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
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                <Atom className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-cyan-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Discovery Cards
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-500 transition-colors">
                Science Codex
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Vocabulary, facts & breakthrough quizzes.
              </p>
              </div>
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
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-blue-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Online Library
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                Foundational Books
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Marcus Aurelius, Einstein, Sun Tzu, Nietzsche.
              </p>
              </div>
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
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
                <Youtube className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-red-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Video Academy
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-red-500 transition-colors">
                Masterclasses
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Quantum physics, neuroscience & cinema.
              </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-red-600 dark:text-red-400">
              <span>Watch Lessons</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('scroll')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-fuchsia-500/70 dark:hover:border-fuchsia-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400">
                <GalleryVertical className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-fuchsia-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Endless Facts
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-fuchsia-500 transition-colors">
                Scroll Mode
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Science, history & general knowledge with pictures.
              </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">
              <span>Start Scrolling</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('memory')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-violet-500/70 dark:hover:border-violet-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                <BrainCircuit className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-violet-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Train Recall
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-violet-500 transition-colors">
                Memory Mode
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Memorize π, poems or your own text with a plan.
              </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <span>Start Memorizing</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('psychology')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-rose-500/70 dark:hover:border-rose-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <HeartHandshake className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-rose-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Mind & People
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-rose-500 transition-colors">
                Psychology
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Confidence, love, leadership and more, with exercises.
              </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('quran')}
            className="w-[240px] sm:w-auto shrink-0 snap-start p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-emerald-500/70 dark:hover:border-emerald-500/70 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <BookOpenText className="w-6 h-6" aria-hidden="true" />
              </span>
              <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-emerald-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Memorize &amp; Level Up
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                Quran
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Memorize verses and earn big XP for every one.
              </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Start Memorizing</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
