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

          <div className="flex sm:flex-col gap-2">
            <button
              disabled={isSyncingReading}
              onClick={() => syncReadingApps('kindle')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors disabled:opacity-50"
              title="Sync completed books from Kindle and Goodreads"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingReading ? 'animate-spin' : ''}`} />
              <span>{isSyncingReading ? 'Syncing...' : 'Sync Reading Apps'}</span>
            </button>

            <button
              onClick={() => setWearablesModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Sync Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Book Search & Autocomplete Suggestions Panel */}
      <div className="relative p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Search Book Name for Suggestions & Comprehension Tests
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {BOOK_CATALOG.length} Curated Masterpieces Available
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search book title or author (e.g., '1984', 'Meditations', 'Thinking Fast and Slow', 'Dune')..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                <span>Book Suggestions & Verification Tests:</span>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="hover:text-zinc-600 dark:hover:text-zinc-200 font-semibold"
                >
                  Close ✕
                </button>
              </div>

              {suggestions.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <BookCover title={item.title} author={item.author} className="w-8 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          {item.pages} pgs
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300/40">
                          +{Math.round(item.pages * 12 + 500).toLocaleString()} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        by {item.author} · {item.genre}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setShowSuggestions(false);
                        setQuizBook(item);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Take Quick Test</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-medium text-zinc-400 mr-1">Suggestions:</span>
          {BOOK_CATALOG.slice(0, 6).map(b => (
            <button
              key={b.id}
              onClick={() => {
                setSearchQuery(b.title);
                setQuizBook(b);
              }}
              className="px-2.5 py-1 text-[11px] rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/50 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-600 dark:text-zinc-300 transition-colors"
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

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
