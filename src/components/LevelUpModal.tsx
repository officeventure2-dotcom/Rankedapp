import React from 'react';
import { useRanked } from '../context/RankedContext';
import { HERO_CREST_PATH } from '../data/mockData';
import { Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { getTierColor } from '../utils/levelMath';
import { TierType } from '../types';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, dismissLevelUp } = useRanked();

  if (!levelUpModal) return null;

  const tierStyle = getTierColor(levelUpModal.tier as TierType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border-2 border-amber-500/80 bg-zinc-950 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-zinc-900 mb-2">
            <img
              src={HERO_CREST_PATH}
              alt="Ranked Insignia"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
            LEVEL UP UNLOCKED
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 font-mono font-extrabold text-3xl text-white">
            <span className="text-zinc-500">Lvl {levelUpModal.oldLevel}</span>
            <ChevronRight className="w-6 h-6 text-amber-400" />
            <span className="text-amber-300">Lvl {levelUpModal.newLevel}</span>
          </div>
          <p className="text-sm font-semibold text-zinc-300">
            Tier Achieved: <span className={`${tierStyle.badgeText}`}>{levelUpModal.tier.toUpperCase()}</span>
          </p>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Your multidisciplinary dedication just advanced your global standing. Keep advancing towards Level 1,000!
          </p>
        </div>

        <button
          onClick={dismissLevelUp}
          className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all"
        >
          Claim Honor & Continue
        </button>

      </div>
    </div>
  );
};
