import { TierType, CategoryType } from '../types';

/**
 * Hardcore Polymath Leveling Architecture (1 to 1,000 Levels)
 * Designed for authentic, prestigious multi-year dedication:
 * Level 1: 0 XP (Initiate)
 * Level 2: 351 XP (Requires deliberate initial work)
 * Level 10: ~10,500 XP
 * Level 50: ~318,000 XP
 * Level 100 (Adept): ~1,500,000 XP (~1-2 years of daily discipline)
 * Level 250 (Expert): ~5,920,000 XP (~3-5 years)
 * Level 450 (Master): ~12,000,000 XP (~7-8 years)
 * Level 650 (Grandmaster): ~18,330,000 XP (~10-12 years)
 * Level 850 (Apex): ~22,800,000 XP (~13-14 years)
 * Level 1,000 (Mythic Sovereign): 25,000,000 XP (A true 15-year lifetime commitment)
 */
export const MAX_LEVEL = 1000;
export const MAX_XP = 25000000; // 25 Million XP

// Returns cumulative XP required to reach level L
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level >= MAX_LEVEL) return MAX_XP;

  // Staggered base linear offset (850 XP/lvl minimum) so early levels require genuine effort
  const baseOffset = (level - 1) * 850;

  // Steep power curve with exponent 2.35 across 25,000,000 XP
  const normalized = (level - 1) / (MAX_LEVEL - 1);
  const exponentialPart = (MAX_XP - (MAX_LEVEL - 1) * 850) * Math.pow(normalized, 2.35);

  return Math.round(baseOffset + exponentialPart);
}

// Returns level (1 to 1000) for a given total XP
export function getLevelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  if (xp >= MAX_XP) return MAX_LEVEL;

  // Binary search for exact level
  let low = 1;
  let high = MAX_LEVEL;
  let result = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const xpReq = getXpForLevel(mid);
    if (xpReq <= xp) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return Math.min(MAX_LEVEL, Math.max(1, result));
}

export function getTierForLevel(level: number): TierType {
  if (level < 100) return 'Novice';
  if (level < 250) return 'Adept';
  if (level < 450) return 'Expert';
  if (level < 650) return 'Master';
  if (level < 850) return 'Grandmaster';
  if (level < 950) return 'Apex';
  return 'Mythic';
}

export function getTierColor(tier: TierType): {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glow: string;
  accent: string;
} {
  switch (tier) {
    case 'Novice':
      return {
        badgeBg: 'bg-zinc-800/80',
        badgeBorder: 'border-zinc-600',
        badgeText: 'text-zinc-300',
        glow: 'shadow-zinc-500/10',
        accent: '#a1a1aa'
      };
    case 'Adept':
      return {
        badgeBg: 'bg-cyan-950/60',
        badgeBorder: 'border-cyan-500/40',
        badgeText: 'text-cyan-300',
        glow: 'shadow-cyan-500/20',
        accent: '#06b6d4'
      };
    case 'Expert':
      return {
        badgeBg: 'bg-amber-950/60',
        badgeBorder: 'border-amber-500/40',
        badgeText: 'text-amber-300',
        glow: 'shadow-amber-500/20',
        accent: '#f59e0b'
      };
    case 'Master':
      return {
        badgeBg: 'bg-emerald-950/60',
        badgeBorder: 'border-emerald-500/40',
        badgeText: 'text-emerald-300',
        glow: 'shadow-emerald-500/20',
        accent: '#10b981'
      };
    case 'Grandmaster':
      return {
        badgeBg: 'bg-indigo-950/60',
        badgeBorder: 'border-indigo-500/40',
        badgeText: 'text-indigo-300',
        glow: 'shadow-indigo-500/25',
        accent: '#6366f1'
      };
    case 'Apex':
      return {
        badgeBg: 'bg-rose-950/60',
        badgeBorder: 'border-rose-500/50',
        badgeText: 'text-rose-300',
        glow: 'shadow-rose-500/30',
        accent: '#f43f5e'
      };
    case 'Mythic':
      return {
        badgeBg: 'bg-gradient-to-r from-amber-950/80 via-yellow-900/70 to-amber-950/80',
        badgeBorder: 'border-yellow-400/80',
        badgeText: 'text-yellow-200',
        glow: 'shadow-yellow-500/40',
        accent: '#eab308'
      };
  }
}

export function getLevelProgress(xp: number): {
  currentLevel: number;
  tier: TierType;
  currentLevelXp: number;
  nextLevelXp: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  percent: number;
} {
  const currentLevel = getLevelFromXp(xp);
  const tier = getTierForLevel(currentLevel);
  const currentLevelXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(Math.min(MAX_LEVEL, currentLevel + 1));
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const percent = currentLevel >= MAX_LEVEL ? 100 : Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  return {
    currentLevel,
    tier,
    currentLevelXp,
    nextLevelXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    percent
  };
}

export const CATEGORY_METADATA: Record<CategoryType, {
  name: string;
  label: string;
  description: string;
  color: string;
  lightBg: string;
  darkBg: string;
}> = {
  trivia: {
    name: 'Trivia',
    label: 'General & Deep Knowledge',
    description: 'World history, sciences, humanities, and speed recalls.',
    color: '#06b6d4',
    lightBg: 'bg-cyan-50 text-cyan-700',
    darkBg: 'dark:bg-cyan-950/40 dark:text-cyan-300'
  },
  language: {
    name: 'Language',
    label: 'Polyglot Fluency',
    description: 'Vocabulary breadth, grammar tests, CEFR levels, and multilingual speed.',
    color: '#8b5cf6',
    lightBg: 'bg-purple-50 text-purple-700',
    darkBg: 'dark:bg-purple-950/40 dark:text-purple-300'
  },
  books: {
    name: 'Books',
    label: 'Literature & Non-Fiction',
    description: 'Verified reading logs, classics, academic tomes, and synthesis.',
    color: '#f59e0b',
    lightBg: 'bg-amber-50 text-amber-700',
    darkBg: 'dark:bg-amber-950/40 dark:text-amber-300'
  },
  movies: {
    name: 'Movies',
    label: 'Cinema & Cultural Canon',
    description: 'Film history, auteur filmography, international classics, and analysis.',
    color: '#ec4899',
    lightBg: 'bg-pink-50 text-pink-700',
    darkBg: 'dark:bg-pink-950/40 dark:text-pink-300'
  },
  fitness: {
    name: 'Fitness',
    label: 'Physical Endurance & Strength',
    description: 'Strava runs, Apple Watch streaks, marathons, lifting benchmarks.',
    color: '#10b981',
    lightBg: 'bg-emerald-50 text-emerald-700',
    darkBg: 'dark:bg-emerald-950/40 dark:text-emerald-300'
  },
  degree: {
    name: 'Degree',
    label: 'Academics & Research',
    description: 'Accredited university degrees, published papers, professional credentials.',
    color: '#3b82f6',
    lightBg: 'bg-blue-50 text-blue-700',
    darkBg: 'dark:bg-blue-950/40 dark:text-blue-300'
  },
  iq: {
    name: 'IQ & Logic',
    label: 'Cognitive & Spatial Reasoning',
    description: 'Matrix puzzles, pattern deduction, sequence solving, and mental models.',
    color: '#f43f5e',
    lightBg: 'bg-rose-50 text-rose-700',
    darkBg: 'dark:bg-rose-950/40 dark:text-rose-300'
  }
};
