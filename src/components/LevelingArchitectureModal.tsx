import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { MAX_LEVEL, MAX_XP, getXpForLevel, getTierForLevel, getTierColor } from '../utils/levelMath';
import {
  Trophy,
  X,
  Sparkles,
  Flame,
  Calendar,
  Hourglass,
  Lock,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldAlert,
  Zap,
  Target
} from 'lucide-react';

interface LevelingArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIER_GATES = [
  {
    tier: 'Novice',
    levels: 'Lv. 1 – 99',
    xpRange: '0 – 189,758 XP',
    timeEst: 'First 3 – 6 Months',
    lore: 'Foundational habit initiation. Early curiosity across sciences, literature, and fitness.',
    prerequisites: ['Initiate 3 pillars', 'Solve first 50 trivia challenges', 'Read 2 books']
  },
  {
    tier: 'Adept',
    levels: 'Lv. 100 – 249',
    xpRange: '189,758 – 1,134,268 XP',
    timeEst: 'Year 1 to Year 2.5',
    lore: 'Demonstrated consistency. Regular study schedule, intermediate language grammar, and 10k athletic proof.',
    prerequisites: ['50,000+ words read', '150+ km logged in fitness telemetry', 'A2 Language Fluency']
  },
  {
    tier: 'Expert',
    levels: 'Lv. 250 – 449',
    xpRange: '1,134,268 – 4,069,153 XP',
    timeEst: 'Year 3 to Year 5',
    lore: 'Formidable intellectual agility. High-speed arithmetic duel wins, B1 polyglot progress, and verified reviews.',
    prerequisites: ['150+ verified books', 'B1 Language Fluency', '1750+ 1v1 Arena Elo rating']
  },
  {
    tier: 'Master',
    levels: 'Lv. 450 – 649',
    xpRange: '4,069,153 – 9,316,179 XP',
    timeEst: 'Year 6 to Year 8',
    lore: 'Elite multi-domain intellect. Academic degrees, half-marathon or triathlon biometrics, and complex matrix reasoning.',
    prerequisites: ['Bachelor/Master degree or published synthesis', 'Sub-25 min 5k or marathon proof', 'B2 Language Fluency']
  },
  {
    tier: 'Grandmaster',
    levels: 'Lv. 650 – 849',
    xpRange: '9,316,179 – 17,198,971 XP',
    timeEst: 'Year 9 to Year 12',
    lore: 'Near-apex polymath stature. Mensa calibers, trilingual C1 fluency, and profound cross-disciplinary mastery.',
    prerequisites: ['C1 Polyglot verified', 'Mensa 130+ cognitive score', '1950+ Chess Elo rating']
  },
  {
    tier: 'Apex',
    levels: 'Lv. 850 – 949',
    xpRange: '17,198,971 – 22,500,000 XP',
    timeEst: 'Year 12 to Year 15',
    lore: 'Living polymath vanguard. Over a decade of relentless unbroken daily excellence across all 7 pillars.',
    prerequisites: ['All 7 pillars at 85%+ mastery', '500+ verified books read', 'Original doctoral or scientific thesis']
  },
  {
    tier: 'Mythic',
    levels: 'Lv. 950 – 1,000',
    xpRange: '22,500,000 – 25,000,000 XP',
    timeEst: '15+ Years (The Lifetime Pinnacle)',
    lore: 'The Sovereign Apex. Only achievable through a full lifetime of deliberate multi-disciplinary greatness.',
    prerequisites: ['Full 100% mastery across all 7 pillars', 'Decennial streak proof', 'Grandmaster across all mind arenas']
  }
];

export const LevelingArchitectureModal: React.FC<LevelingArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useRanked();
  const [dailyPace, setDailyPace] = useState<number>(3000);

  if (!isOpen) return null;

  // Calculate time to max at chosen daily XP pace
  const daysToMax = Math.ceil(MAX_XP / dailyPace);
  const yearsToMax = (daysToMax / 365.25).toFixed(1);

  // Time to next tier
  const remainingXp = Math.max(0, MAX_XP - user.xp);
  const userDaysToMax = Math.ceil(remainingXp / dailyPace);
  const userYearsToMax = (userDaysToMax / 365.25).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 max-h-[90vh] overflow-y-auto pb-safe">
        
        {/* Mobile Pull Affordance */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Hardcore Polymath Progression Specification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50">
              Rank-Up Architecture & Leveling Curve
            </h2>
            <p className="text-xs text-zinc-500">
              Designed so maxing Level 1,000 requires authentic, long-term multi-year dedication.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Max Level Target
            </span>
            <span className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
              Level {MAX_LEVEL}
            </span>
            <span className="text-[11px] text-zinc-500 block">The 1,000 Apex</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider block font-semibold">
              Total XP to Max
            </span>
            <span className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">
              {MAX_XP.toLocaleString()} XP
            </span>
            <span className="text-[11px] text-zinc-500 block">25 Million Points</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block font-semibold">
              Curve Power Exponent
            </span>
            <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
              x^2.35 + 850L
            </span>
            <span className="text-[11px] text-zinc-500 block">Steep Scaling Formula</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-wider block font-semibold">
              Est. Time to Max
            </span>
            <span className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">
              ~11 – 22 Years
            </span>
            <span className="text-[11px] text-zinc-500 block">Unbroken Daily Habit</span>
          </div>
        </div>

        {/* Time-To-Max Interactive Estimator */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-amber-500" />
                <span>Pacing & Years-to-Max Simulation</span>
              </h4>
              <p className="text-xs text-zinc-500">
                Adjust daily effort to see realistic real-world calendar duration required:
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              {[2000, 3500, 5000, 7500].map(p => (
                <button
                  key={p}
                  onClick={() => setDailyPace(p)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    dailyPace === p
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {p.toLocaleString()} XP/day
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500">
                At <strong className="text-zinc-900 dark:text-zinc-100">{dailyPace.toLocaleString()} XP/day</strong> (doing daily trivia, 3 book chapters, 2 duels & 5km run):
              </span>
              <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {yearsToMax} Years <span className="text-sm font-normal text-zinc-500">({daysToMax.toLocaleString()} consecutive days)</span>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-3 sm:pt-0 sm:pl-4 text-xs space-y-0.5">
              <span className="text-zinc-500 block">Your Personal Remaining Time:</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-base">
                {userYearsToMax} more years
              </span>
              <span className="text-[11px] text-zinc-400 block font-mono">
                {remainingXp.toLocaleString()} XP remaining
              </span>
            </div>
          </div>
        </div>

        {/* The 7 Prestige Rank Gates Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>Multi-Pillar Gates & Milestone Prerequisites</span>
            </h4>
            <span className="text-xs text-zinc-500">You cannot rank up by grinding a single pillar</span>
          </div>

          <div className="space-y-2.5">
            {TIER_GATES.map((g, idx) => (
              <div
                key={g.tier}
                className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-zinc-900 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                      {g.tier} ({g.levels})
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      {g.xpRange}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ⏱️ {g.timeEst}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {g.lore}
                </p>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Gates:
                  </span>
                  {g.prerequisites.map((req, rIdx) => (
                    <span
                      key={rIdx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{req}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Farming & Diminishing Returns Policy */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
          <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Anti-Farming & Daily Fatigue Discipline</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The ranking system enforces authentic longitudinal mastery over single-day spamming. Activities beyond 20 exercises per day experience cognitive diminishing returns (20% XP rate). The true path to Mythic Level 1,000 is measured in unbroken daily streaks over calendar years.
          </p>
        </div>

      </div>
    </div>
  );
};
