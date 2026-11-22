import React, { useRef, useState } from 'react';
import { Loader2, Search, Sparkles, X } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { MAX_QUESTION_CHARS, askAi } from '../utils/askAi';

const SUGGESTIONS = ['Why do we dream?', 'How do I memorize faster?', 'How does compound interest work?'];

/** "Ask Ranked": a one-line question box on Home that answers with the Workers AI assistant. */
export const AiAskBar: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asked, setAsked] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const run = useRef(0);

  const ask = async (text: string) => {
    const q = text.trim();
    if (q.length < 2 || busy) return;
    haptics.tap();
    const id = ++run.current;
    setBusy(true);
    setError('');
    setAnswer('');
    setAsked(q);
    try {
      const r = await askAi('home', q);
      if (id === run.current) setAnswer(r.answer);
    } catch (e) {
      if (id === run.current) setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      if (id === run.current) setBusy(false);
    }
  };

  const clear = () => {
    run.current++;
    setBusy(false);
    setAnswer('');
    setError('');
    setAsked('');
  };

  return (
    <section
      aria-label="Ask Ranked"
      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm p-3.5 space-y-3"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
        className="flex items-center gap-2"
      >
        <label className="flex-1 min-w-0 flex items-center gap-2 min-h-touch px-3 rounded-xl border border-zinc-200 dark:border-white/10">
          <Sparkles className="w-4 h-4 shrink-0 text-fuchsia-500" aria-hidden="true" />
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={MAX_QUESTION_CHARS}
            enterKeyHint="search"
            placeholder="Ask anything: science, history, habits…"
            aria-label="Ask Ranked a question"
            style={{ background: 'transparent', boxShadow: 'none', border: 0 }}
            className="flex-1 min-w-0 bg-transparent text-sm py-2 outline-none placeholder:text-zinc-400"
          />
        </label>
        <button
          type="submit"
          disabled={busy || question.trim().length < 2}
          aria-label="Ask"
          className="min-h-touch min-w-touch px-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Search className="w-4 h-4" aria-hidden="true" />}
          <span className="hidden min-[380px]:inline">Ask</span>
        </button>
      </form>

      {!asked && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuestion(s);
                void ask(s);
              }}
              className="min-h-touch px-3.5 rounded-full border border-zinc-200 dark:border-white/10 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite">
        {busy && <p className="text-sm text-zinc-500 dark:text-zinc-400">Thinking…</p>}
        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
        {answer && (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 min-w-0 break-words">{asked}</p>
              <button
                onClick={clear}
                aria-label="Clear answer"
                className="min-h-touch min-w-touch -my-2 -mr-2 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-800 dark:text-zinc-100">{answer}</p>
            <p className="text-[11px] text-zinc-400">AI can make mistakes. Check anything important.</p>
          </div>
        )}
      </div>
    </section>
  );
};
