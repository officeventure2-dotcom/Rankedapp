import React, { useRef, useState } from 'react';
import { Loader2, Plus, Search, Sparkles } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { MAX_QUESTION_CHARS, askAi } from '../utils/askAi';
import { MAX_CONTENT_CHARS, detectKind, parseDigits, wordsOf, type MemoryItem } from '../utils/memoryTools';

const card =
  'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const primaryBtn =
  'min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const softBtn =
  'min-h-touch px-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-40';

const EXAMPLES = ['The planets in order', 'The Greek alphabet', 'Ozymandias by Shelley'];
const SCRIPTURE = /\b(qur'?an|koran|quran|surah|sura|ayah|ayat|verse of the quran)\b|القرآن|سورة|آية/i;

/**
 * Search with AI inside Memory Mode: ask for something to memorize, check or edit
 * what comes back, then add it to the memory list.
 */
export const MemoryAiSearch: React.FC<{
  onSave: (item: MemoryItem) => void;
  onOpenQuran: () => void;
}> = ({ onSave, onOpenQuran }) => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [found, setFound] = useState(false);
  const run = useRef(0);

  const search = async (raw: string) => {
    const q = raw.trim();
    if (q.length < 2 || busy) return;
    haptics.tap();
    setError('');
    setFound(false);
    if (SCRIPTURE.test(q)) {
      setHint(true);
      return;
    }
    setHint(false);
    const id = ++run.current;
    setBusy(true);
    try {
      const r = await askAi('memory', q);
      if (id !== run.current) return;
      setTitle(r.title);
      setText(r.text);
      setFound(true);
    } catch (e) {
      if (id === run.current) setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      if (id === run.current) setBusy(false);
    }
  };

  const add = () => {
    const content = text.replace(/\r\n?/g, '\n').trim();
    const name = title.trim() || 'From AI search';
    if (content.length > MAX_CONTENT_CHARS) return setError(`Too long: the limit is ${MAX_CONTENT_CHARS.toLocaleString()} characters.`);
    let item: MemoryItem;
    if (detectKind(content) === 'digits') {
      const { prefix, content: digits } = parseDigits(content);
      if (digits.length < 6) return setError('Add at least 6 digits.');
      item = { id: `ai_${Date.now()}`, title: name, kind: 'digits', prefix, content: digits, createdAt: Date.now() };
    } else {
      if (wordsOf(content).length < 5) return setError('Add at least 5 words.');
      item = {
        id: `ai_${Date.now()}`,
        title: name,
        kind: 'text',
        content,
        note: 'Found with AI search. AI can misquote, so check it against a trusted source before you memorize it.',
        createdAt: Date.now()
      };
    }
    haptics.tap();
    onSave(item);
  };

  return (
    <section aria-label="Search with AI" className={`${card} p-3.5 space-y-3`}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-fuchsia-500" aria-hidden="true" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Search with AI</h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void search(query);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={MAX_QUESTION_CHARS}
          enterKeyHint="search"
          placeholder="What do you want to memorize?"
          aria-label="Search with AI for something to memorize"
          className="flex-1 min-w-0 min-h-touch px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm placeholder:text-zinc-400"
        />
        <button
          type="submit"
          disabled={busy || query.trim().length < 2}
          aria-label="Search"
          className={`${primaryBtn} min-w-touch inline-flex items-center justify-center`}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Search className="w-4 h-4" aria-hidden="true" />}
        </button>
      </form>

      {!found && !busy && !hint && (
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                void search(s);
              }}
              className="min-h-[36px] px-3 rounded-full border border-zinc-200 dark:border-white/10 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite" className="space-y-3">
        {busy && <p className="text-sm text-zinc-500 dark:text-zinc-400">Searching…</p>}
        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
        {hint && (
          <div className="rounded-xl p-3 bg-emerald-500/10 text-sm text-emerald-800 dark:text-emerald-300 space-y-2">
            <p>The Quran is loaded straight from its source so no word is changed. Use the Quran option instead.</p>
            <button onClick={onOpenQuran} className={softBtn}>
              Open Quran
            </button>
          </div>
        )}
        {found && (
          <div className="space-y-2.5">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full min-h-touch px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Text to memorize (you can edit it)</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm leading-relaxed"
              />
            </label>
            <p className="text-[11px] text-zinc-400">AI can misquote. Check it against a trusted source first.</p>
            <div className="flex gap-2">
              <button onClick={() => void search(query)} className={softBtn}>
                Try again
              </button>
              <button onClick={add} className={`${primaryBtn} flex-1 inline-flex items-center justify-center gap-2`}>
                <Plus className="w-4 h-4" aria-hidden="true" /> Add to my memory
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
