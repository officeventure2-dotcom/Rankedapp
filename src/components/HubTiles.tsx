import React, { useState } from 'react';
import { ArrowLeft, Shuffle, Play } from 'lucide-react';
import { haptics } from '../utils/haptics';

export interface HubItem {
  id: string;
  label: string;
  blurb: string;
  icon: React.ReactNode;
  /** Tailwind text colour for the icon, e.g. 'text-amber-500' */
  tone: string;
}

const readCounts = (key: string): Record<string, number> => {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
};
const recordPlay = (key: string, id: string) => {
  try {
    const c = readCounts(key);
    c[id] = (c[id] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(c));
  } catch { /* storage blocked: suggestions just stay random */ }
};
/** Weighted pick: what the player opens most is likelier; every item keeps a chance so it never gets stale. */
const suggest = (items: HubItem[], counts: Record<string, number>, skip?: string): HubItem => {
  const pool = items.length > 1 ? items.filter(i => i.id !== skip) : items;
  const weights = pool.map(i => 1 + 3 * (counts[i.id] || 0));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let k = 0; k < pool.length; k++) { r -= weights[k]; if (r <= 0) return pool[k]; }
  return pool[pool.length - 1];
};

/** Big icon tiles: the player sees every section first, then picks one. `storageKey` turns on "Pick for me". */
export const HubTiles: React.FC<{ title: string; items: HubItem[]; onPick: (id: string) => void; storageKey?: string; pickTitle?: string }> = ({ title, items, onPick, storageKey, pickTitle = 'Pick for me' }) => {
  const [pick, setPick] = useState<HubItem | null>(() => (storageKey ? suggest(items, readCounts(storageKey)) : null));
  const open = (id: string) => { if (storageKey) recordPlay(storageKey, id); onPick(id); };
  const played = !!(pick && storageKey && readCounts(storageKey)[pick.id]);
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
      {pick && (
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-white/70 dark:bg-white/10 ${pick.tone} [&>svg]:w-6 [&>svg]:h-6`}>{pick.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{pickTitle}: {pick.label}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{played ? 'Based on what you open most' : 'Something different to try'}</p>
          </div>
          <button
            aria-label="Suggest another"
            onClick={() => { haptics.tap(); setPick(suggest(items, readCounts(storageKey!), pick.id)); }}
            className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 cursor-pointer"
          ><Shuffle className="w-4 h-4" /></button>
          <button
            onClick={() => { haptics.tap(); open(pick.id); }}
            className="h-11 px-4 shrink-0 rounded-xl inline-flex items-center gap-1.5 text-sm font-bold bg-amber-500 text-zinc-950 cursor-pointer"
          ><Play className="w-4 h-4" /> Play</button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => { haptics.tap(); open(item.id); }}
            className="flex flex-col items-start gap-3 p-4 min-h-[150px] text-left rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-100 dark:bg-white/10 ${item.tone} [&>svg]:w-8 [&>svg]:h-8`}>{item.icon}</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{item.label}</span>
            <span className="text-xs leading-snug text-zinc-500 dark:text-zinc-400">{item.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const BackBar: React.FC<{ label: string; onBack: () => void }> = ({ label, onBack }) => (
  <button
    onClick={() => { haptics.tap(); onBack(); }}
    className="mb-4 inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
  >
    <ArrowLeft className="w-4 h-4" /> {label}
  </button>
);
