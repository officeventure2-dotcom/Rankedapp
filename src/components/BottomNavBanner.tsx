import React from 'react';
import { useRanked } from '../context/RankedContext';
import {
  Home,
  Swords,
  Compass,
  BookOpen,
  Users,
  Flame,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { haptics } from '../utils/haptics';

export type MainNavHub = 'home' | 'arena' | 'map' | 'knowledge' | 'community';

export const BottomNavBanner: React.FC = () => {
  const { activeTab, setActiveTab, user, theme } = useRanked();

  // Map activeTab to its main hub
  const getActiveHub = (): MainNavHub => {
    switch (activeTab) {
      case 'overview':
        return 'home';
      case 'challenges':
      case 'science':
        return 'arena';
      case 'map':
        return 'map';
      case 'library':
      case 'academy':
        return 'knowledge';
      case 'leaderboard':
      case 'social':
      case 'chat':
      case 'badges':
        return 'community';
      default:
        return 'home';
    }
  };

  const currentHub = getActiveHub();

  // Theme-aware active color mapping
  const getThemeHighlight = () => {
    switch (theme) {
      case 'dark-neo':
        return {
          text: 'text-cyan-400',
          bgGlow: 'bg-cyan-500/15',
          border: 'border-cyan-500/40',
          dot: 'bg-cyan-400',
          centerRing: 'ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
          centerBg: 'bg-cyan-950/80'
        };
      case 'anime-solo':
        return {
          text: 'text-sky-400',
          bgGlow: 'bg-sky-500/15',
          border: 'border-sky-500/40',
          dot: 'bg-sky-400',
          centerRing: 'ring-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.35)]',
          centerBg: 'bg-sky-950/80'
        };
      case 'anime-cyberpunk':
        return {
          text: 'text-emerald-400',
          bgGlow: 'bg-emerald-500/15',
          border: 'border-emerald-500/40',
          dot: 'bg-emerald-400',
          centerRing: 'ring-emerald-500/50 shadow-[0_0_20px_rgba(34,197,94,0.35)]',
          centerBg: 'bg-purple-950/80'
        };
      case 'anime-sakura':
        return {
          text: 'text-pink-400',
          bgGlow: 'bg-pink-500/15',
          border: 'border-pink-500/40',
          dot: 'bg-pink-400',
          centerRing: 'ring-pink-500/50 shadow-[0_0_20px_rgba(244,114,182,0.35)]',
          centerBg: 'bg-pink-950/80'
        };
      case 'anime-saiyan':
        return {
          text: 'text-yellow-400',
          bgGlow: 'bg-yellow-500/15',
          border: 'border-yellow-500/40',
          dot: 'bg-yellow-400',
          centerRing: 'ring-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.35)]',
          centerBg: 'bg-amber-950/80'
        };
      case 'light':
        return {
          text: 'text-amber-600',
          bgGlow: 'bg-amber-500/15',
          border: 'border-amber-600/30',
          dot: 'bg-amber-600',
          centerRing: 'ring-amber-500/40 shadow-[0_4px_16px_rgba(217,119,6,0.25)]',
          centerBg: 'bg-amber-50'
        };
      case 'dark':
      default:
        return {
          text: 'text-amber-400',
          bgGlow: 'bg-amber-500/15',
          border: 'border-amber-500/30',
          dot: 'bg-amber-400',
          centerRing: 'ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          centerBg: 'bg-amber-950/80'
        };
    }
  };

  const colors = getThemeHighlight();

  // Reordered navigation items: Home positioned in the exact CENTER (position 3 of 5)
  const navItems: Array<{
    hub: MainNavHub;
    label: string;
    targetTab: 'overview' | 'challenges' | 'map' | 'library' | 'leaderboard';
    icon: React.ReactNode;
    isCenter?: boolean;
  }> = [
    {
      hub: 'arena',
      label: 'Arena',
      targetTab: 'challenges',
      icon: <Swords className="w-5 h-5" />
    },
    {
      hub: 'map',
      label: 'Radar Map',
      targetTab: 'map',
      icon: <Compass className="w-5 h-5" />
    },
    {
      hub: 'home',
      label: 'Home',
      targetTab: 'overview',
      icon: <Home className="w-5 h-5" />,
      isCenter: true
    },
    {
      hub: 'knowledge',
      label: 'Knowledge',
      targetTab: 'library',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      hub: 'community',
      label: 'Community',
      targetTab: 'leaderboard',
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="fixed bottom-[max(0.65rem,env(safe-area-inset-bottom,0.65rem))] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-auto max-w-md sm:max-w-lg pointer-events-none">
      {/* Transparent Glassmorphism Floating Banner (Mobile-First Touch Ergonomics) */}
      <nav
        aria-label="Bottom App Navigation"
        className="pointer-events-auto w-full px-2 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex items-center justify-around sm:gap-2 transition-all duration-300"
      >
        {navItems.map(item => {
          const isActive = currentHub === item.hub;

          // Special Center Home Button Styling (Raised, Signature Core Hub)
          if (item.isCenter) {
            return (
              <button
                key={item.hub}
                onClick={() => {
                  haptics.tap();
                  if (activeTab === 'overview') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setActiveTab(item.targetTab);
                  }
                }}
                aria-label="Home Overview (Center Hub)"
                title="Home: Polymath Overview & Mastery"
                className={`relative flex flex-col items-center justify-center -my-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-2xl sm:rounded-full transition-all duration-200 cursor-pointer min-h-[48px] min-w-[48px] group ${
                  isActive
                    ? `${colors.text} scale-105 sm:scale-110`
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {/* Elevated Center Hero Capsule / Ring */}
                <div className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-200 shadow-md ${
                  isActive
                    ? `${colors.centerBg} ring-2 ${colors.centerRing} border border-white/20`
                    : 'bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/70 dark:border-zinc-800/70 group-hover:border-zinc-400'
                }`}>
                  <Home className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? colors.text : ''}`} />
                  
                  {/* Active pulsing micro core */}
                  {isActive && (
                    <span className={`absolute -bottom-0.5 w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                  )}
                </div>

                {/* Micro Label */}
                <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight mt-0.5 transition-colors ${
                  isActive ? colors.text : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          // Flanking Side Navigation Buttons (Arena & Map on Left; Knowledge & Community on Right)
          return (
            <button
              key={item.hub}
              onClick={() => {
                haptics.tap();
                setActiveTab(item.targetTab);
              }}
              aria-label={item.label}
              title={item.label}
              className={`relative flex flex-col items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-full transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] group ${
                isActive
                  ? `${colors.text} scale-105`
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {/* Active Animated Glass Glow Pill behind icon */}
              {isActive && (
                <span className={`absolute inset-0 ${colors.bgGlow} rounded-xl sm:rounded-full border ${colors.border} animate-in fade-in duration-200 pointer-events-none`} />
              )}

              {/* Icon */}
              <div className="relative">
                {item.icon}

                {/* Sub-dot for map radar beacon */}
                {item.hub === 'map' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-xs animate-ping" />
                )}
              </div>

              {/* Micro Label */}
              <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight mt-0.5 transition-colors ${
                isActive ? colors.text : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
              }`}>
                {item.label}
              </span>

              {/* Active micro dot indicator on mobile */}
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-0.5 sm:hidden`} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
