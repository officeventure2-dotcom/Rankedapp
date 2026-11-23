import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, ExternalLink, Loader2, Search, ShoppingCart } from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { toChapters } from '../utils/bookText';

interface BookCard { id: string; title: string; author: string; cover: string; gutenbergId?: number; price?: string; buyUrl?: string; previewUrl?: string }
type Source = 'free' | 'store';

const COLORS = ['#b45309', '#0f766e', '#7c3aed', '#be123c', '#1d4ed8', '#4d7c0f'];
const colorOf = (s: string) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const btn = 'min-h-touch px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 disabled:opacity-50';

const Cover: React.FC<{ book: BookCard }> = ({ book }) => {
  const [broken, setBroken] = useState(false);
  return book.cover && !broken
    ? <img src={book.cover} alt="" loading="lazy" onError={() => setBroken(true)} className="w-full aspect-[2/3] object-cover rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    : <div className="w-full aspect-[2/3] rounded-xl flex items-center justify-center p-3 text-center text-white font-serif text-sm" style={{ background: colorOf(book.title) }}>{book.title}</div>;
};

/** Free classics read inside the app; paid books are bought at the seller and previewed there. */
export const BookStoreView: React.FC = () => {
  const { openReader, showToast } = useRanked();
  const [source, setSource] = useState<Source>('free');
  const [q, setQ] = useState('');
  const [books, setBooks] = useState<BookCard[] | null>(null);
  const [err, setErr] = useState('');
  const [opening, setOpening] = useState('');

  const search = useCallback(async (src: Source, query: string) => {
    setBooks(null); setErr('');
    try {
      const res = await fetch(`/api/books/search?source=${src}&q=${encodeURIComponent(query)}`);
      const data = await res.json() as { books?: BookCard[]; error?: string };
      if (res.ok) setBooks(data.books ?? []); else { setBooks([]); setErr(data.error ?? 'Could not load books.'); }
    } catch { setBooks([]); setErr("Can't reach the server."); }
  }, []);
  useEffect(() => { void search(source, ''); setQ(''); }, [source, search]);

  const read = async (b: BookCard) => {
    setOpening(b.id);
    try {
      const res = await fetch(`/api/books/text?id=${b.gutenbergId}`);
      const data = await res.json() as { text?: string; error?: string };
      const chapters = res.ok && data.text ? toChapters(data.text) : [];
      if (!chapters.length) { showToast(data.error ?? 'That book has no readable text.'); return; }
      openReader({ id: b.id, title: b.title, author: b.author, year: 0, genre: 'Free classic', coverColor: colorOf(b.title), pages: Math.round(chapters.length * 12), description: '', chapters, totalXp: 0 });
    } catch { showToast("Can't reach the server."); } finally { setOpening(''); }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Book store sections">
        {([['free', 'Free classics'], ['store', 'Store']] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={source === id} onClick={() => setSource(id)}
            className={`min-h-touch rounded-xl text-sm font-semibold cursor-pointer border ${source === id ? 'mem-on bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent' : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'}`}>{label}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); void search(source, q); }}>
        <label className="flex items-center gap-2 px-3 min-h-touch rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true" />
          <input type="search" enterKeyHint="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={source === 'free' ? 'Search free classics…' : 'Search books to buy…'} aria-label="Search books"
            className="bare-input flex-1 min-w-0 bg-transparent text-base py-2 outline-none text-zinc-900 dark:text-zinc-100" />
        </label>
      </form>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {source === 'free' ? 'Public-domain books from Project Gutenberg. Tap Read to read them here.' : "Paid ebooks from Google Play Books. You buy and read them there; a preview opens when the publisher allows one."}
      </p>
      {books === null && <Loader2 className="w-6 h-6 animate-spin text-zinc-400" aria-label="Loading" />}
      {err && <p role="alert" className="text-sm text-rose-500">{err}</p>}
      {books?.length === 0 && !err && <p className="text-sm text-zinc-500">No books found. Try another search.</p>}
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {books?.map((b) => (
          <li key={b.id} className="flex flex-col gap-2 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90">
            <Cover book={b} />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-50 line-clamp-2">{b.title}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{b.author}</p>
            </div>
            {b.gutenbergId !== undefined ? (
              <button className={`${btn} mt-auto`} disabled={opening === b.id} onClick={() => void read(b)}>
                {opening === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />} Read free
              </button>
            ) : (
              <div className="mt-auto flex flex-col gap-1.5">
                <a className={`${btn} bg-amber-500 text-zinc-950 border-transparent`} href={b.buyUrl} target="_blank" rel="noopener noreferrer sponsored"><ShoppingCart className="w-4 h-4" /> Buy {b.price}</a>
                {b.previewUrl && <a className={btn} href={b.previewUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /> Preview</a>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
