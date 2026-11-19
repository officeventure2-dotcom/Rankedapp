import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { haptics } from '../utils/haptics';

export interface HubItem {
  id: string;
  label: string;
  blurb: string;
  icon: React.ReactNode;
  /** Tailwind text colour for the icon, e.g. 'text-amber-500' */
  tone: string;
}

/** Big icon tiles: the player sees every section first, then picks one. */
export const HubTiles: React.FC<{ title: string; items: HubItem[]; onPick: (id: string) => void }> = ({ title, items, onPick }) => (
  <div className="space-y-4 animate-in fade-in duration-300">
    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => { haptics.tap(); onPick(item.id); }}
          className="flex flex-col items-start gap-3 p-4 min-h-[150px] text-left rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
        >
          <span className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-100 dark:bg-white/10 ${item.tone} [&>svg]:w-8 [&>svg]:h-8`}>{item.icon}</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{item.label}</span>
          <span className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{item.blurb}</span>
        </button>
      ))}
    </div>
  </div>
);

export const BackBar: React.FC<{ label: string; onBack: () => void }> = ({ label, onBack }) => (
  <button
    onClick={() => { haptics.tap(); onBack(); }}
    className="mb-4 inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
  >
    <ArrowLeft className="w-4 h-4" /> {label}
  </button>
);
