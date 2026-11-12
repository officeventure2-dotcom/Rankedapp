import { StreakMilestone } from '../types';

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    day: 7,
    title: 'First Week Initiate',
    bonusXp: 1500,
    description: '7 consecutive days of multidisciplinary practice.'
  },
  {
    day: 14,
    title: 'Fortnight Fortitude',
    bonusXp: 3000,
    description: '14 consecutive days of mental and physical training.'
  },
  {
    day: 30,
    title: 'Monthly Habit Master',
    bonusXp: 7500,
    description: 'A full month of unbroken cognitive consistency.'
  },
  {
    day: 50,
    title: 'Golden Half-Century',
    bonusXp: 15000,
    description: '50 consecutive days of polymath dedication.'
  },
  {
    day: 100,
    title: 'Centurion of Discipline',
    bonusXp: 35000,
    description: '100 days of relentless, unyielding growth.'
  },
  {
    day: 200,
    title: 'Bicentennial Polymath',
    bonusXp: 75000,
    description: '200 days unbroken habit formation across all pillars.'
  },
  {
    day: 365,
    title: 'Annual Apex Sovereign',
    bonusXp: 150000,
    description: 'A full solar year of dedicated life optimization.'
  },
  {
    day: 500,
    title: 'Half-Millennium Vanguard',
    bonusXp: 250000,
    description: '500 consecutive days of cross-domain mastery.'
  },
  {
    day: 1000,
    title: 'The Decennial Mythic',
    bonusXp: 1000000,
    description: '1,000 consecutive days—the absolute pinnacle of human discipline.'
  }
];

export interface DailyStreakRewardCalculation {
  dayNumber: number;
  baseReward: number;
  streakMultiplierXp: number;
  milestoneBonus: number;
  totalDailyXp: number;
  milestone: StreakMilestone | null;
}

/**
 * Calculates daily login reward scaling with the hardcore mathematical curve
 * Base: 500 XP
 * Streak bonus: 50 XP per streak day (up to 100 days = 5,000 XP extra)
 * Plus any specific milestone bonus unlocked on that day
 */
export function calculateDailyStreakXp(dayNumber: number): DailyStreakRewardCalculation {
  const baseReward = 500;
  const clampedStreak = Math.max(1, dayNumber);
  const streakMultiplierXp = Math.min(clampedStreak, 100) * 50;

  const milestone = STREAK_MILESTONES.find(m => m.day === clampedStreak) || null;
  const milestoneBonus = milestone ? milestone.bonusXp : 0;
  const totalDailyXp = baseReward + streakMultiplierXp + milestoneBonus;

  return {
    dayNumber: clampedStreak,
    baseReward,
    streakMultiplierXp,
    milestoneBonus,
    totalDailyXp,
    milestone
  };
}

export function getUpcomingMilestone(currentStreak: number): StreakMilestone {
  const next = STREAK_MILESTONES.find(m => m.day > currentStreak);
  return next || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
}

export interface StreakTrackDay {
  dayNumber: number;
  dayLabel: string;
  status: 'completed' | 'current' | 'upcoming';
  xpReward: number;
  isMilestone: boolean;
  milestoneTitle?: string;
}

/**
 * Generates a revolving 7-day attendance track around current streak
 * e.g., if current is 48: displays days 46 to 52 (with Day 48 as Current, Day 50 as Milestone)
 */
export function getRevolvingStreakTrack(currentStreak: number, isClaimedToday: boolean): StreakTrackDay[] {
  // Show 7 days window: 2 past days, current day, and 4 upcoming days
  const startDay = Math.max(1, currentStreak - 2);
  const track: StreakTrackDay[] = [];

  for (let i = 0; i < 7; i++) {
    const day = startDay + i;
    const calc = calculateDailyStreakXp(day);
    const isPast = day < currentStreak || (day === currentStreak && isClaimedToday);
    const isCurrent = day === currentStreak && !isClaimedToday;

    track.push({
      dayNumber: day,
      dayLabel: `Day ${day}`,
      status: isPast ? 'completed' : isCurrent ? 'current' : 'upcoming',
      xpReward: calc.totalDailyXp,
      isMilestone: !!calc.milestone,
      milestoneTitle: calc.milestone?.title
    });
  }

  return track;
}
