import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { THEME_PRESETS, WEARABLE_PREVIEW_PATH } from '../data/mockData';
import {
  X,
  Check,
  Watch,
  Activity,
  RefreshCw,
  BookOpen,
  Film,
  Sparkles,
  Layers,
  ArrowRight,
  Palette,
  Sun,
  Moon,
  Zap,
  Flame,
  Shield,
  Eye
} from 'lucide-react';
import { UserProfile, ThemeMode, ThemePreset } from '../types';
import { haptics } from '../utils/haptics';

type SettingsTab = 'theme' | 'reading' | 'movies' | 'fitness';

export const WearablesModal: React.FC = () => {
  const {
    wearablesModalOpen,
    setWearablesModalOpen,
    user,
    theme,
    setTheme,
    showToast,
    syncWearables,
    isSyncingWearable,
    syncReadingApps,
    syncMovieApps,
    isSyncingReading,
    isSyncingMovies,
    toggleConnectedApp
  } = useRanked();

  const [activeTab, setActiveTab] = useState<SettingsTab>('theme');
  const [themeCategoryFilter, setThemeCategoryFilter] = useState<'All' | 'Standard' | 'Neo-Brutalism' | 'Anime & Gaming'>('All');

  if (!wearablesModalOpen) return null;

  const fitnessIntegrations: Array<{
    id: keyof UserProfile['connectedWearables'];
    brandKey: 'strava' | 'appleWatch' | 'garmin';
    name: string;
    category: string;
    description: string;
    connected: boolean;
    badge?: string;
  }> = [
    {
      id: 'strava',
      brandKey: 'strava',
      name: 'Strava GPS',
      category: 'Running & Cycling',
      description: 'Syncs verified outdoor distance, elevation gain, and segment PRs directly into your Fitness pillar.',
      connected: !!user.connectedWearables.strava,
      badge: 'Popular'
    },
    {
      id: 'appleWatch',
      brandKey: 'appleWatch',
      name: 'Apple Watch Ultra',
      category: 'Heart Rate & Active Energy',
      description: 'Imports daily active move rings, VO2 max metrics, and gym workouts automatically.',
      connected: !!user.connectedWearables.appleWatch
    },
    {
      id: 'garmin',
      brandKey: 'garmin',
      name: 'Garmin Connect',
      category: 'Endurance & Triathlon',
      description: 'High-precision telemetry for marathon pacing, multisport, and training readiness.',
      connected: !!user.connectedWearables.garmin
    },
    {
      id: 'whoop',
      brandKey: 'strava',
      name: 'Whoop 4.0',
      category: 'Recovery & Strain',
      description: 'Sleep performance, circadian strain logs, and recovery heart rate variability telemetry.',
      connected: !!user.connectedWearables.whoop
    }
  ];

  const readingIntegrations: Array<{
    id: keyof UserProfile['connectedWearables'];
    brandKey: 'goodreads' | 'kindle' | 'appleBooks' | 'storyGraph';
    name: string;
    category: string;
    description: string;
    connected: boolean;
    badge?: string;
  }> = [
    {
      id: 'goodreads',
      brandKey: 'goodreads',
      name: 'Goodreads Shelf',
      category: 'Reading Social & Reviews',
      description: 'Syncs "Read" and "Want to Read" shelves. Automatically verifies completed literature for Literature XP.',
      connected: !!user.connectedWearables.goodreads,
      badge: 'Popular'
    },
    {
      id: 'kindle',
      brandKey: 'kindle',
      name: 'Amazon Kindle Whispersync',
      category: 'E-Reader Telemetry',
      description: 'Reads verified digital page turns, reading speed, and finished books directly from your Kindle library.',
      connected: !!user.connectedWearables.kindle,
      badge: 'Auto-Sync'
    },
    {
      id: 'appleBooks',
      brandKey: 'appleBooks',
      name: 'Apple Books Library',
      category: 'iOS & macOS Reading',
      description: 'Imports completed titles, audiobooks, and highlighted passages into your ranked books archive.',
      connected: !!user.connectedWearables.appleBooks
    },
    {
      id: 'storyGraph',
      brandKey: 'storyGraph',
      name: 'The StoryGraph',
      category: 'Mood & Pace Analytics',
      description: 'Imports book page counts, genres, pacing metrics, and star ratings into your Literature profile.',
      connected: !!user.connectedWearables.storyGraph
    }
  ];

  const movieIntegrations: Array<{
    id: keyof UserProfile['connectedWearables'];
    brandKey: 'letterboxd' | 'imdb' | 'trakt';
    name: string;
    category: string;
    description: string;
    connected: boolean;
    badge?: string;
  }> = [
    {
      id: 'letterboxd',
      brandKey: 'letterboxd',
      name: 'Letterboxd Diary',
      category: 'Social Cinema & Reviews',
      description: 'Syncs film logs, 5-star ratings, and watch dates into your Cinema Canon for +2,200 XP per film.',
      connected: !!user.connectedWearables.letterboxd,
      badge: 'Auteur Choice'
    },
    {
      id: 'imdb',
      brandKey: 'imdb',
      name: 'IMDb Rated Watchlist',
      category: 'Film Database & Ratings',
      description: 'Imports user ratings, rated films, and watch history from your IMDb account automatically.',
      connected: !!user.connectedWearables.imdb
    },
    {
      id: 'trakt',
      brandKey: 'trakt',
      name: 'Trakt.tv Scrobbler',
      category: 'Automated Media Tracking',
      description: 'Scrobbles watched movies and cinema releases directly from Plex, Apple TV, and streaming apps.',
      connected: !!user.connectedWearables.trakt,
      badge: 'Auto-Scrobble'
    }
  ];

  const filteredThemes = THEME_PRESETS.filter(preset => {
    if (themeCategoryFilter === 'All') return true;
    return preset.category === themeCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl pb-safe">
        
        {/* Mobile Pull Affordance */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                Settings & Aesthetics
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 sm:line-clamp-none">
                Choose visual themes, connect reading logs & wearables.
              </p>
            </div>
          </div>
          <button
            onClick={() => setWearablesModalOpen(false)}
            aria-label="Close settings"
            className="p-2 min-h-touch min-w-touch rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs font-semibold">
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('theme');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'theme'
                ? 'bg-white dark:bg-zinc-900 text-amber-500 shadow-sm font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>

          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('reading');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'reading'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reading ({readingIntegrations.filter(i => i.connected).length})</span>
          </button>

          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('movies');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'movies'
                ? 'bg-white dark:bg-zinc-900 text-pink-600 dark:text-pink-400 shadow-sm font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies ({movieIntegrations.filter(i => i.connected).length})</span>
          </button>

          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('fitness');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'fitness'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Wearables</span>
          </button>
        </div>

        {/* ==========================================================================
            TAB 1: APP APPEARANCE & THEME SELECTOR
            ========================================================================== */}
        {activeTab === 'theme' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            {/* Banner Overview */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    Interface Theme Engine
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Switch between Daylight Light Mode, Obsidian Dark, High-Contrast Dark Neo, or legendary Anime Themes.
                </p>
              </div>

              {/* Current Active Theme Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 border border-zinc-300/60 dark:border-zinc-700/60 shrink-0">
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">ACTIVE:</span>
                <span className="text-xs font-bold font-mono text-amber-500">
                  {THEME_PRESETS.find(p => p.id === theme)?.name || theme}
                </span>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {(['All', 'Standard', 'Neo-Brutalism', 'Anime & Gaming'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    haptics.tap();
                    setThemeCategoryFilter(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold whitespace-nowrap transition-colors ${
                    themeCategoryFilter === cat
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Theme Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredThemes.map(preset => {
                const isSelected = theme === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      haptics.success();
                      setTheme(preset.id);
                      showToast(`✨ Switched to "${preset.name}" theme!`);
                    }}
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `ring-2 ring-amber-500 dark:ring-amber-400 border-transparent shadow-lg bg-zinc-50 dark:bg-zinc-800/90 ${preset.glowClass}`
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <div>
                      {/* Top Row: Theme Name + Badge */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                            {preset.name}
                          </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {preset.badge}
                        </span>
                      </div>

                      {/* Subtitle */}
                      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2.5">
                        {preset.subtitle}
                      </p>

                      {/* Visual Palette Preview Bar */}
                      <div className="flex items-center gap-2 mb-2 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="flex items-center gap-1.5">
                          {/* Background swatch */}
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.bgHex }}
                            title={`Background: ${preset.bgHex}`}
                          />
                          {/* Primary accent swatch */}
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.accentHex }}
                            title={`Accent: ${preset.accentHex}`}
                          />
                          {/* Secondary swatch */}
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: preset.secondaryHex }}
                            title={`Secondary: ${preset.secondaryHex}`}
                          />
                        </div>

                        {/* Mini UI pill simulation */}
                        <div
                          className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border text-center"
                          style={{
                            backgroundColor: `${preset.accentHex}18`,
                            borderColor: `${preset.accentHex}40`,
                            color: preset.accentHex
                          }}
                        >
                          UI PREVIEW
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Bottom Status / Select Button */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {preset.category}
                      </span>

                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active Theme</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 font-mono flex items-center gap-1 transition-colors"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 2: READING APPS
            ========================================================================== */}
        {activeTab === 'reading' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            {/* Banner with One-Click Sync */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                  Automated Reading Shelf Sync
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-0.5">
                  Import completed books and verified page counts from Kindle, Goodreads, Apple Books, and StoryGraph.
                </p>
              </div>

              <button
                disabled={isSyncingReading}
                onClick={() => syncReadingApps('kindle')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingReading ? 'animate-spin' : ''}`} />
                <span>{isSyncingReading ? 'Syncing Shelves...' : 'Sync Reading List Now'}</span>
              </button>
            </div>

            {/* Reading Services List */}
            <div className="space-y-3">
              {readingIntegrations.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                      <span className="text-[11px] text-zinc-400">· {item.category}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.connected && (
                      <button
                        disabled={isSyncingReading}
                        onClick={() => syncReadingApps(item.brandKey as any)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingReading ? 'animate-spin' : ''}`} />
                        <span>Sync Shelf</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleConnectedApp(item.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        item.connected
                          ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                          : 'border-amber-500 bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold'
                      }`}
                    >
                      {item.connected ? 'Disconnect' : 'Connect Account'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 3: MOVIE APPS
            ========================================================================== */}
        {activeTab === 'movies' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            {/* Banner with One-Click Sync */}
            <div className="p-4 rounded-xl border border-pink-200 dark:border-pink-900/50 bg-gradient-to-r from-pink-50/80 to-pink-100/30 dark:from-pink-950/30 dark:to-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider block">
                  Cinematic Canon Diary Sync
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-0.5">
                  Import 5-star ratings and verified film diaries from Letterboxd, IMDb, and Trakt.tv.
                </p>
              </div>

              <button
                disabled={isSyncingMovies}
                onClick={() => syncMovieApps('letterboxd')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-pink-500 hover:bg-pink-400 text-white transition-colors shadow-sm disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMovies ? 'animate-spin' : ''}`} />
                <span>{isSyncingMovies ? 'Syncing Diary...' : 'Sync Movie Logs Now'}</span>
              </button>
            </div>

            {/* Movie Services List */}
            <div className="space-y-3">
              {movieIntegrations.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                      <span className="text-[11px] text-zinc-400">· {item.category}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.connected && (
                      <button
                        disabled={isSyncingMovies}
                        onClick={() => syncMovieApps(item.brandKey as any)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-pink-500 hover:bg-pink-400 text-white transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMovies ? 'animate-spin' : ''}`} />
                        <span>Sync Diary</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleConnectedApp(item.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        item.connected
                          ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                          : 'border-pink-500 bg-pink-500 text-white hover:bg-pink-400 font-bold'
                      }`}
                    >
                      {item.connected ? 'Disconnect' : 'Connect Account'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 4: FITNESS WEARABLES
            ========================================================================== */}
        {activeTab === 'fitness' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            {/* Wearable Preview Banner */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 h-32">
              <img
                src={WEARABLE_PREVIEW_PATH}
                alt="Wearable Telemetry"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Live Biometric GPS Engine
                </span>
                <p className="text-xs text-zinc-200 font-medium">
                  Every verified kilometer and active calorie pushes your Level 1–1,000 rank forward.
                </p>
              </div>
            </div>

            {/* Fitness Integrations List */}
            <div className="space-y-3">
              {fitnessIntegrations.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                      <span className="text-[11px] text-zinc-400">· {item.category}</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.connected && (
                      <button
                        disabled={isSyncingWearable}
                        onClick={() => syncWearables(item.brandKey)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWearable ? 'animate-spin' : ''}`} />
                        <span>Sync Activity</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleConnectedApp(item.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        item.connected
                          ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                          : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {item.connected ? 'Disconnect' : 'Connect Account'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-[11px] text-zinc-400">
            Ranked Design Engine: Instant theme rendering with persistent local preference.
          </p>
          <button
            onClick={() => setWearablesModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
