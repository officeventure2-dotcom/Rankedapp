import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { OnlineBook } from '../types';
import {
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  Search,
  ShieldCheck,
  RefreshCw,
  Layers,
  BookMarked
} from 'lucide-react';
import { BOOK_CATALOG, BookCatalogItem, searchBookSuggestions } from '../data/bookCatalogData';
import { BookVerificationQuizModal } from './BookVerificationQuizModal';
import { BookCover } from './BookCover';

export const OnlineLibraryView: React.FC = () => {
  const {
    onlineBooks,
    openReader,
    user,
    addVerifiedBook,
    syncReadingApps,
    isSyncingReading,
    setWearablesModalOpen
  } = useRanked();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quizBook, setQuizBook] = useState<BookCatalogItem | null>(null);

  const filteredOnlineBooks = onlineBooks.filter(b =>
    !searchQuery ||
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestions = searchBookSuggestions(searchQuery);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Digital Classical Library & Reading Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-zinc-900 dark:text-zinc-50">
            Read Foundational Works & Verify Books
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Read complete philosophy, physics, and strategy masterpieces directly inside Ranked, search the literature catalog with instant suggestions, and pass quick verification tests to certify your reading.
          </p>
        </div>

        {/* User Reading Progress KPI & Sync Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <div>
              <span className="text-[11px] text-zinc-500 block">Books Pillar</span>
              <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                {user.pillarMastery.books}% <span className="text-xs font-normal text-zinc-500">Mastery</span>
              </p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700" />
            <div>
              <span className="text-[11px] text-zinc-500 block">Books Completed</span>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {user.stats.booksRead}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Filters only the books you can read here; logging and quizzes live in My Books */}
      <label className="flex items-center gap-2 px-3 min-h-touch rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true" />
        <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search books you can read here…" aria-label="Search readable books"
          className="bare-input flex-1 min-w-0 bg-transparent text-base py-2 outline-none text-zinc-900 dark:text-zinc-100" />
      </label>

      {/* Online Books Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOnlineBooks.map(book => {
          const catalogMatch = BOOK_CATALOG.find(c => c.title.toLowerCase() === book.title.toLowerCase());
          return (
            <div
              key={book.id}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <BookCover title={book.title} author={book.author} color={book.coverColor} className="w-16 sm:w-20 shrink-0" />
                    <div className="min-w-0">
                    <span className="text-xs font-mono text-zinc-400 block mb-1">
                      {book.genre} · {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                    </span>
                    <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      by {book.author}
                    </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                      +{book.totalXp.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                {/* Chapter Previews */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Available Online Chapters:
                  </span>
                  {book.chapters.map((ch) => (
                    <div
                      key={ch.id}
                      className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="truncate">Ch. {ch.chapterNumber}: {ch.title}</span>
                      <span className="font-mono text-[10px] text-zinc-400 shrink-0 ml-2">
                        {ch.estimatedMinutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs text-zinc-400 font-mono">
                  {book.pages} pages · {book.chapters.length} chapters
                </span>

                <div className="flex items-center gap-2">
                  {catalogMatch && (
                    <button
                      onClick={() => setQuizBook(catalogMatch)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                      title="Take quick test to accept into your reading list"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Take Test</span>
                    </button>
                  )}

                  <button
                    onClick={() => openReader(book, 0)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Online</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading Verification Modal */}
      <BookVerificationQuizModal
        book={quizBook}
        onClose={() => setQuizBook(null)}
        onSuccess={(bk) => {
          addVerifiedBook(bk.title, bk.author, bk.pages, bk.genre, 5, '100% Score');
          setQuizBook(null);
        }}
      />

    </div>
  );
};
