import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const KEY = 'ranked.interests.v1';

export interface Interests { areas: string[]; subjects: string[] }

export function loadInterests(): Interests | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return v && Array.isArray(v.areas) && Array.isArray(v.subjects) ? v : null;
  } catch {
    return null;
  }
}

function saveInterests(v: Interests) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode: asked again next visit */ }
}

const STEPS = [
  {
    title: 'What do you want to level up?',
    hint: 'Pick the areas of Ranked you care about most.',
    options: ['Trivia', 'Languages', 'Books', 'Movies', 'Fitness', 'Study & Degree', 'IQ & Logic', 'Memory', 'Psychology', 'Quran']
  },
  {
    title: 'Which subjects do you love?',
    hint: 'Choose your favourite topics. You can pick as many as you like.',
    options: ['Science', 'History', 'Math', 'Philosophy', 'Technology', 'Business', 'Art & Design', 'Music', 'Health', 'Nature', 'Space', 'Literature', 'Sports', 'Cooking', 'Travel', 'Politics']
  }
];

/** Two quick questions shown once after the first sign in (or guest start). Both can be skipped. */
export const InterestsScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<[string[], string[]]>([[], []]);
  const s = STEPS[step];

  const toggle = (o: string) =>
    setPicked((p) => {
      const next: [string[], string[]] = [p[0], p[1]];
      next[step] = p[step].includes(o) ? p[step].filter((x) => x !== o) : [...p[step], o];
      return next;
    });

  const finish = (skip: boolean) => {
    saveInterests(skip ? { areas: [], subjects: [] } : { areas: picked[0], subjects: picked[1] });
    onDone();
  };

  return (
    <main className="min-h-dvh flex justify-center px-6 pt-6 pb-8 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between h-11">
          {step > 0 ? (
            <button onClick={() => setStep(0)} aria-label="Back" className="min-h-touch min-w-touch -ml-3 flex items-center justify-center text-zinc-900 dark:text-zinc-100 cursor-pointer">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : <span />}
          <button onClick={() => finish(true)} className="min-h-touch px-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 cursor-pointer">Skip</button>
        </div>

        <h1 className="mt-6 text-3xl font-bold leading-tight font-['Outfit'] text-zinc-950 dark:text-zinc-50">{s.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{s.hint}</p>

        <div className="mt-6 flex flex-wrap gap-2.5" role="group" aria-label={s.title}>
          {s.options.map((o) => {
            const on = picked[step].includes(o);
            return (
              <button
                key={o}
                onClick={() => toggle(o)}
                aria-pressed={on}
                className={`min-h-touch pl-2.5 pr-4 inline-flex items-center gap-2 rounded-xl border text-sm font-semibold cursor-pointer ${on ? 'pick-on bg-amber-400 border-amber-400 text-zinc-950' : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'}`}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${on ? 'bg-zinc-950 border-zinc-950 text-white' : 'border-zinc-300 dark:border-zinc-600'}`}>
                  {on && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
                {o}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => (step === 0 ? setStep(1) : finish(false))}
          className="mt-8 w-full min-h-[56px] px-6 rounded-2xl flex items-center justify-between bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold cursor-pointer"
        >
          {step === 0 ? 'Continue' : 'Finish'} <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </main>
  );
};
