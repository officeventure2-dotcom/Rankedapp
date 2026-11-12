import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import {
  TRIVIA_BANK,
  IQ_QUESTIONS_BANK,
  WEARABLE_PREVIEW_PATH
} from '../data/mockData';
import {
  Sparkles,
  Globe,
  BookOpen,
  Film,
  Activity,
  GraduationCap,
  Brain,
  CheckCircle2,
  XCircle,
  Plus,
  Watch,
  Award,
  Star,
  Clock,
  RotateCcw,
  Youtube,
  Swords,
  Gamepad2,
  Search,
  ShieldCheck,
  Check,
  RefreshCw,
  Layers
} from 'lucide-react';
import { CategoryType, AcademicMilestone, FitnessActivity } from '../types';
import { CompetitiveArenaView } from './games/CompetitiveArenaView';
import { LanguageLabView } from './LanguageLabView';
import { BOOK_CATALOG, BookCatalogItem, searchBookSuggestions } from '../data/bookCatalogData';
import { BookVerificationQuizModal } from './BookVerificationQuizModal';
import { TriviaArenaView } from './TriviaArenaView';
import { BookCover } from './BookCover';

export type ChallengeSubTab = CategoryType | 'competitive';

export const ChallengesView: React.FC = () => {
  const {
    user,
    gainXp,
    books,
    addBook,
    addVerifiedBook,
    movies,
    addMovie,
    academics,
    addAcademicMilestone,
    fitnessActivities,
    addFitnessActivity,
    syncWearables,
    isSyncingWearable,
    syncReadingApps,
    syncMovieApps,
    isSyncingReading,
    isSyncingMovies,
    setWearablesModalOpen,
    setActiveTab
  } = useRanked();

  // Active sub-pillar
  const [activePillar, setActivePillar] = useState<ChallengeSubTab>('competitive');

  // Trivia state
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaSelected, setTriviaSelected] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState(false);

  // IQ state
  const [iqIndex, setIqIndex] = useState(0);
  const [iqSelected, setIqSelected] = useState<number | null>(null);
  const [iqSubmitted, setIqSubmitted] = useState(false);

  // Book modal / form state
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPages, setBookPages] = useState('350');
  const [bookGenre, setBookGenre] = useState('Philosophy');
  const [bookRating, setBookRating] = useState(5);
  const [showBookForm, setShowBookForm] = useState(false);

  // Book search & suggestion state
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCatalogBook, setSelectedCatalogBook] = useState<BookCatalogItem | null>(null);
  const [activeQuizModalBook, setActiveQuizModalBook] = useState<BookCatalogItem | null>(null);

  // Movie modal / form state
  const [movieTitle, setMovieTitle] = useState('');
  const [movieDirector, setMovieDirector] = useState('');
  const [movieYear, setMovieYear] = useState('2024');
  const [movieGenre, setMovieGenre] = useState('Cinema Classic');
  const [movieRating, setMovieRating] = useState(5);
  const [showMovieForm, setShowMovieForm] = useState(false);

  // Academic modal / form state
  const [academicTitle, setAcademicTitle] = useState('');
  const [academicInst, setAcademicInst] = useState('');
  const [academicField, setAcademicField] = useState('');
  const [academicType, setAcademicType] = useState<AcademicMilestone['type']>('Bachelor');
  const [academicYear, setAcademicYear] = useState(2023);
  const [showAcademicForm, setShowAcademicForm] = useState(false);

  // Fitness form state
  const [fitType, setFitType] = useState<FitnessActivity['type']>('Run');
  const [fitTitle, setFitTitle] = useState('');
  const [fitKm, setFitKm] = useState('10.0');
  const [fitMins, setFitMins] = useState('48');
  const [fitCals, setFitCals] = useState('650');
  const [showFitForm, setShowFitForm] = useState(false);

  // Handlers for Trivia
  const currentTrivia = TRIVIA_BANK[triviaIndex % TRIVIA_BANK.length];
  const handleTriviaAnswer = (index: number) => {
    if (triviaSubmitted) return;
    setTriviaSelected(index);
    setTriviaSubmitted(true);
    if (index === currentTrivia.correctIndex) {
      gainXp(currentTrivia.xp, 'trivia', `Trivia: ${currentTrivia.category}`);
    }
  };

  const handleNextTrivia = () => {
    setTriviaIndex(prev => prev + 1);
    setTriviaSelected(null);
    setTriviaSubmitted(false);
  };

  // Handlers for IQ
  const currentIq = IQ_QUESTIONS_BANK[iqIndex % IQ_QUESTIONS_BANK.length];
  const handleIqAnswer = (index: number) => {
    if (iqSubmitted) return;
    setIqSelected(index);
    setIqSubmitted(true);
    if (index === currentIq.correctIndex) {
      gainXp(currentIq.xp, 'iq', `IQ Reasoning Matrix`);
    }
  };

  const handleNextIq = () => {
    setIqIndex(prev => prev + 1);
    setIqSelected(null);
    setIqSubmitted(false);
  };

  const pillarsList: Array<{ id: ChallengeSubTab; label: string; icon: React.ReactNode }> = [
    { id: 'competitive', label: '1v1 & Solo Mind Games', icon: <Swords className="w-4 h-4 text-amber-500" /> },
    { id: 'trivia', label: 'Trivia Arena', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'iq', label: 'IQ & Logic', icon: <Brain className="w-4 h-4" /> },
    { id: 'language', label: 'Language Lab', icon: <Globe className="w-4 h-4" /> },
    { id: 'books', label: 'Books Read', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'movies', label: 'Movies Watched', icon: <Film className="w-4 h-4" /> },
    { id: 'fitness', label: 'Fitness & Strava', icon: <Activity className="w-4 h-4" /> },
    { id: 'degree', label: 'Degrees & Honors', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Pillar Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {pillarsList.map(item => {
          const isActive = activePillar === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePillar(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 0. 1V1 MIND GAMES & CHESS ARENA */}
      {activePillar === 'competitive' && (
        <CompetitiveArenaView />
      )}

      {/* 1. TRIVIA ARENA */}
      {activePillar === 'trivia' && (
        <TriviaArenaView setActiveTab={setActiveTab} />
      )}

      {/* 2. IQ & COGNITIVE MATRICES */}
      {activePillar === 'iq' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <span>Raven Cognitive Assessment</span>
                <span>·</span>
                <span>Current Verified IQ: {user.stats.iqScore}</span>
              </div>
              <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Cognitive Matrix Reasoning
              </h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                +{currentIq.xp.toLocaleString()} XP · +{currentIq.iqWeight} IQ Points
              </span>
            </div>
          </div>

          <p className="text-base font-medium text-zinc-800 dark:text-zinc-200">
            {currentIq.prompt}
          </p>

          {currentIq.visualMatrix && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center gap-4 flex-wrap">
              {currentIq.visualMatrix.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 font-mono text-base font-bold text-amber-400"
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentIq.options.map((opt, idx) => {
              const isSelected = iqSelected === idx;
              const isCorrect = idx === currentIq.correctIndex;

              let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300';
              if (iqSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={iqSubmitted}
                  onClick={() => handleIqAnswer(idx)}
                  className={`p-4 rounded-xl border text-center font-mono text-base font-bold transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {iqSubmitted && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100">Analytical Deduction: </strong>
                {currentIq.logicExplanation}
              </p>
              <button
                onClick={handleNextIq}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
              >
                Next Cognitive Matrix
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. ENHANCED LANGUAGE LAB */}
      {activePillar === 'language' && (
        <LanguageLabView />
      )}

      {/* 4. BOOKS READ TRACKER */}
      {activePillar === 'books' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                  Literature & Books Archive
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-800/40">
                  Verified Proof
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {user.stats.booksRead} books logged · 12 XP per page + 500 bonus XP for verified reading tests.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Sync Reading Apps Button */}
              <button
                disabled={isSyncingReading}
                onClick={() => syncReadingApps('kindle')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
                title="Sync recent finished books from Kindle, Goodreads, Apple Books, and StoryGraph"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingReading ? 'animate-spin' : ''}`} />
                <span>{isSyncingReading ? 'Syncing...' : 'Sync Reading Apps'}</span>
              </button>

              {/* Connected Apps Settings Modal shortcut */}
              <button
                onClick={() => setWearablesModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                title="Manage connected reading and movie accounts in Settings"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>App Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Online</span>
              </button>

              <button
                onClick={() => setShowBookForm(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Custom Book</span>
              </button>
            </div>
          </div>

          {/* Search with Instant Suggestions Bar */}
          <div className="relative p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
                  Search Book Catalog & Verification Tests
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">
                Instant autocomplete suggestions with comprehension quiz
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={bookSearchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={e => {
                  setBookSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Type a book name or author (e.g., 'Meditations', '1984', 'Sapiens', 'Dune', 'Atomic Habits')..."
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl p-2 max-h-80 overflow-y-auto space-y-1">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                    <span>Suggested Books with Comprehension Tests:</span>
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="hover:text-zinc-600 dark:hover:text-zinc-200 font-semibold"
                    >
                      Close ✕
                    </button>
                  </div>

                  {searchBookSuggestions(bookSearchQuery).map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer"
                      onClick={() => {
                        setBookTitle(item.title);
                        setBookAuthor(item.author);
                        setBookPages(String(item.pages));
                        setBookGenre(item.genre);
                        setSelectedCatalogBook(item);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <BookCover title={item.title} author={item.author} className="w-9 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                              {item.pages} pgs
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40">
                              +{Math.round(item.pages * 12 + 500).toLocaleString()} XP
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            by {item.author} ({item.year > 0 ? item.year : `${Math.abs(item.year)} BC`}) · {item.genre}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSuggestions(false);
                            setActiveQuizModalBook(item);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Take Quick Test to Accept</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {searchBookSuggestions(bookSearchQuery).length === 0 && (
                    <div className="p-4 text-center text-xs text-zinc-500">
                      No exact catalog match found for "{bookSearchQuery}". You can log it manually below!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-medium text-zinc-400 mr-1">Quick Select:</span>
              {BOOK_CATALOG.slice(0, 6).map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBookTitle(b.title);
                    setBookAuthor(b.author);
                    setBookPages(String(b.pages));
                    setBookGenre(b.genre);
                    setSelectedCatalogBook(b);
                    setActiveQuizModalBook(b);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/50 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  {b.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form to Log Book / Custom */}
          {showBookForm && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!bookTitle || !bookAuthor) return;
                
                // If this book matches a catalog item, we can offer verification
                const matched = BOOK_CATALOG.find(b => b.title.toLowerCase() === bookTitle.toLowerCase());
                if (matched) {
                  setActiveQuizModalBook(matched);
                  setShowBookForm(false);
                  return;
                }

                addBook(bookTitle, bookAuthor, parseInt(bookPages) || 300, bookGenre, bookRating, 'Manual', false);
                setBookTitle('');
                setBookAuthor('');
                setSelectedCatalogBook(null);
                setShowBookForm(false);
              }}
              className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Log Completed Book</h3>
                {selectedCatalogBook && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Catalog Match: Verification Test Available</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Book Title</label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={e => {
                      setBookTitle(e.target.value);
                      const m = BOOK_CATALOG.find(b => b.title.toLowerCase() === e.target.value.toLowerCase());
                      setSelectedCatalogBook(m || null);
                    }}
                    placeholder="e.g. Sapiens: A Brief History of Humankind"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={bookAuthor}
                    onChange={e => setBookAuthor(e.target.value)}
                    placeholder="e.g. Yuval Noah Harari"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Page Count</label>
                  <input
                    type="number"
                    required
                    value={bookPages}
                    onChange={e => setBookPages(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Genre</label>
                  <input
                    type="text"
                    value={bookGenre}
                    onChange={e => setBookGenre(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-200/40 dark:border-amber-900/40">
                <button
                  type="button"
                  onClick={() => setShowBookForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Cancel
                </button>

                {selectedCatalogBook && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuizModalBook(selectedCatalogBook);
                      setShowBookForm(false);
                    }}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Take Verification Test & Accept (+500 XP)</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Claim Reading XP (Standard)
                </button>
              </div>
            </form>
          )}

          {/* Books List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map(b => {
              const matchedCatalog = BOOK_CATALOG.find(c => c.title.toLowerCase() === b.title.toLowerCase());
              return (
                <div
                  key={b.id}
                  className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-medium text-zinc-500">{b.genre}</span>
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-800/40">
                        +{b.xpAwarded.toLocaleString()} XP
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{b.author}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>{b.pages} pages</span>
                      <span>Completed: {b.completedDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {b.verified ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300/40">
                          <ShieldCheck className="w-3 h-3" />
                          <span>VERIFIED READ ✓</span>
                        </span>
                      ) : matchedCatalog ? (
                        <button
                          onClick={() => setActiveQuizModalBook(matchedCatalog)}
                          className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Take Test to Verify</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-400">Self-Reported</span>
                      )}

                      {b.source && (
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {b.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MOVIES WATCHED */}
      {activePillar === 'movies' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                  Cinema Canon & Film Diary
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 border border-pink-300/50 dark:border-pink-800/40">
                  Auteur Archive
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {user.stats.moviesWatched} films watched · +2,200 XP for cinema analysis & watchlist logs.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Sync Movie Apps Button */}
              <button
                disabled={isSyncingMovies}
                onClick={() => syncMovieApps('letterboxd')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-pink-300 dark:border-pink-800/60 bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors disabled:opacity-50"
                title="Sync watched films and diary from Letterboxd, IMDb, and Trakt.tv"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMovies ? 'animate-spin' : ''}`} />
                <span>{isSyncingMovies ? 'Syncing...' : 'Sync Movie Apps'}</span>
              </button>

              {/* Connected Apps Settings Modal shortcut */}
              <button
                onClick={() => setWearablesModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                title="Manage connected movie and reading accounts in Settings"
              >
                <Layers className="w-3.5 h-3.5 text-pink-500" />
                <span>App Settings</span>
              </button>

              <button
                onClick={() => setShowMovieForm(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Movie Watched</span>
              </button>
            </div>
          </div>

          {showMovieForm && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!movieTitle || !movieDirector) return;
                addMovie(movieTitle, movieDirector, parseInt(movieYear) || 2024, movieGenre, movieRating, 'Manual');
                setMovieTitle('');
                setMovieDirector('');
                setShowMovieForm(false);
              }}
              className="p-6 rounded-2xl border border-pink-200 dark:border-pink-900/50 bg-pink-50/20 dark:bg-pink-950/20 space-y-4"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Log Movie / Documentary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Movie Title</label>
                  <input
                    type="text"
                    required
                    value={movieTitle}
                    onChange={e => setMovieTitle(e.target.value)}
                    placeholder="e.g. Parasite"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Director</label>
                  <input
                    type="text"
                    required
                    value={movieDirector}
                    onChange={e => setMovieDirector(e.target.value)}
                    placeholder="e.g. Bong Joon-ho"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMovieForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-500 text-white"
                >
                  Claim Cinema XP
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map(m => (
              <div
                key={m.id}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] text-zinc-500">{m.genre} · {m.year}</span>
                    <span className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400 tabular-nums">
                      +{m.xpAwarded.toLocaleString()} XP
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">{m.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Dir. {m.director}</p>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center text-amber-500">
                      {'★'.repeat(m.rating)}
                    </span>
                    {m.source && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                        {m.source}
                      </span>
                    )}
                  </div>
                  <span>{m.completedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. FITNESS & STRAVA */}
      {activePillar === 'fitness' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Fitness & Biometrics
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {user.stats.kmLogged.toLocaleString()} km logged · Strava & Apple Watch synced workouts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={isSyncingWearable}
                onClick={() => syncWearables('strava')}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                {isSyncingWearable ? 'Syncing Strava...' : 'Sync Strava Now'}
              </button>
              <button
                onClick={() => setShowFitForm(prev => !prev)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                Manual Log
              </button>
            </div>
          </div>

          {showFitForm && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!fitTitle) return;
                addFitnessActivity(fitType, fitTitle, parseFloat(fitKm) || 0, parseInt(fitMins) || 30, parseInt(fitCals) || 300, 'Manual');
                setFitTitle('');
                setShowFitForm(false);
              }}
              className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Log Workout</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Activity Title</label>
                  <input
                    type="text"
                    required
                    value={fitTitle}
                    onChange={e => setFitTitle(e.target.value)}
                    placeholder="e.g. 10k Interval Track Workout"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fitKm}
                    onChange={e => setFitKm(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={fitMins}
                    onChange={e => setFitMins(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFitForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Save Workout & Claim XP
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {fitnessActivities.map(act => (
              <div
                key={act.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{act.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {act.source} · {act.distanceKm ? `${act.distanceKm} km · ` : ''}{act.durationMinutes} min · {act.caloriesBurned} kcal
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{act.xpAwarded.toLocaleString()} XP
                  </span>
                  <p className="text-[11px] text-zinc-400">{act.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. DEGREES & ACADEMIC ACHIEVEMENTS */}
      {activePillar === 'degree' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Degrees & High Intellectual Credentials
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Accredited academic degrees, research papers & professional board licenses.
              </p>
            </div>
            <button
              onClick={() => setShowAcademicForm(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Verify Degree / Paper</span>
            </button>
          </div>

          {showAcademicForm && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!academicTitle || !academicInst) return;
                addAcademicMilestone(academicTitle, academicInst, academicField, academicType, academicYear);
                setAcademicTitle('');
                setAcademicInst('');
                setShowAcademicForm(false);
              }}
              className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20 space-y-4"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Submit Academic Credential</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Credential / Degree Title</label>
                  <input
                    type="text"
                    required
                    value={academicTitle}
                    onChange={e => setAcademicTitle(e.target.value)}
                    placeholder="e.g. Master of Science in Data Science"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">University / Organization</label>
                  <input
                    type="text"
                    required
                    value={academicInst}
                    onChange={e => setAcademicInst(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Category Type</label>
                  <select
                    value={academicType}
                    onChange={e => setAcademicType(e.target.value as AcademicMilestone['type'])}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Bachelor">Bachelor Degree (+60,000 XP)</option>
                    <option value="Master">Master Degree (+90,000 XP)</option>
                    <option value="Doctorate (PhD)">Doctorate / PhD (+150,000 XP)</option>
                    <option value="Research Paper">Peer-Reviewed Paper (+25,000 XP)</option>
                    <option value="Professional Certification">Board / Cert (+20,000 XP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Year Completed</label>
                  <input
                    type="number"
                    value={academicYear}
                    onChange={e => setAcademicYear(parseInt(e.target.value) || 2024)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAcademicForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Verify Milestone & Award XP
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academics.map(ac => (
              <div
                key={ac.id}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] text-zinc-500">{ac.type} · {ac.yearCompleted}</span>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                    +{ac.xpAwarded.toLocaleString()} XP
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{ac.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{ac.institution}</p>
                <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  Specialization: {ac.field}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reading Verification Comprehension Quiz Modal */}
      <BookVerificationQuizModal
        book={activeQuizModalBook}
        onClose={() => setActiveQuizModalBook(null)}
        onSuccess={(bk) => {
          addVerifiedBook(bk.title, bk.author, bk.pages, bk.genre, 5, '100% Score');
          setActiveQuizModalBook(null);
        }}
      />

    </div>
  );
};
