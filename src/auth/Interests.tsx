import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const KEY = 'ranked.interests.v1';

const TOPICS = ['Trivia', 'Languages', 'Books', 'Movies', 'Fitness', 'Degrees', 'IQ & Logic', 'Memory', 'Psychology', 'Quran'];
const SUBJECTS = ['History', 'Science', 'Math', 'Geography', 'Philosophy', 'Literature', 'Technology', 'Business', 'Health', 'Art', 'Music', 'Sports', 'Religion', 'Politics'];

const STEPS = [
  { title: 'What are your favourite topics?', hint: 'Pick the parts of Ranked you care about most.', options: TOPICS },
  { title: 'Which subjects do you love?', hint: 'Choose any subjects you enjoy learning about.', options: SUBJECTS }
];

/** True once the visitor has answered (or skipped) the questions on this device. */
export const hasInterests = (): boolean => {
  try { return localStorage.getItem(KEY) !== null; } catch { return false; }
};

/** Two short questions shown once after sign up or guest entry. Answers are kept on this device. */
export const Interests: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[][]>([[], []]);
  const cur = STEPS[step];
  const last = step === STEPS.length - 1;

  const toggle = (o: string) =>
    setPicked(picked.map((p, i) => (i === step ? (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]) : p)));

  const finish = (answers: string[][]) => {
    try { localStorage.setItem(KEY, JSON.stringify({ topics: answers[0], subjects: answers[1] })); } catch { /* private mode: asked again next visit */ }
    onDone();
  };

  return (
    <main className="auth-solid min-h-dvh flex justify-center px-6 py-8 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm flex flex-col">
        <div className="min-h-touch flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} aria-label="Back" className="min-h-touch min-w-touch -ml-2 flex items-center justify-center text-zinc-900 dark:text-zinc-100 cursor-pointer"><ArrowLeft className="w-6 h-6" /></button>
          ) : <span />}
          <button onClick={() => finish(picked)} className="min-h-touch px-2 text-sm font-semibold text-zinc-400 cursor-pointer">Skip</button>
        </div>

        <header className="mt-6 space-y-2">
          <p className="text-xs font-mono font-bold text-zinc-400">STEP {step + 1} OF {STEPS.length}</p>
          <h1 className="text-[2rem] leading-tight font-extrabold font-['Outfit'] text-zinc-900 dark:text-zinc-50">{cur.title}</h1>
          <p className="text-sm text-zinc-400">{cur.hint}</p>
        </header>

        <div className="mt-6 flex flex-wrap gap-2.5" role="group" aria-label={cur.title}>
          {cur.options.map((o) => {
            const on = picked[step].includes(o);
            return (
              <button
                key={o}
                aria-pressed={on}
                onClick={() => toggle(o)}
                className={`min-h-touch px-3.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-2 cursor-pointer ${on ? 'mem-on bg-amber-500 border-amber-500 text-zinc-950' : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'}`}
              >
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${on ? 'bg-zinc-950 border-zinc-950 text-amber-400' : 'border-zinc-400'}`}>
                  {on && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
                {o}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => (last ? finish(picked) : setStep(step + 1))}
          className="mt-8 w-full min-h-[3.25rem] rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white font-semibold px-5 flex items-center justify-between cursor-pointer"
        >
          {last ? 'Finish' : 'Continue'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
};
