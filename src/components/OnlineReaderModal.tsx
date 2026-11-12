import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import {
  X,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bookmark,
  Sparkles,
  Type
} from 'lucide-react';

export const OnlineReaderModal: React.FC = () => {
  const {
    activeBookForReading,
    activeChapterIndex,
    closeReader,
    completeChapter
  } = useRanked();

  const [currentChapter, setCurrentChapter] = useState(activeChapterIndex || 0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [hasFinishedCurrent, setHasFinishedCurrent] = useState(false);

  if (!activeBookForReading) return null;

  const chapters = activeBookForReading.chapters;
  const chapter = chapters[currentChapter] || chapters[0];

  const handleNext = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
      setHasFinishedCurrent(false);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      setHasFinishedCurrent(false);
    }
  };

  const handleFinishChapter = () => {
    completeChapter(activeBookForReading.id, currentChapter);
    setHasFinishedCurrent(true);
  };

  const themeStyles = {
    dark: 'bg-zinc-950 text-zinc-200 border-zinc-800',
    sepia: 'bg-[#fbf0d9] text-[#3e2e1c] border-[#e4d2b5]',
    light: 'bg-white text-zinc-800 border-zinc-200'
  };

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose'
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`w-full max-w-4xl h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-200 ${themeStyles[readerTheme]}`}>
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b flex items-center justify-between gap-4 border-inherit">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold font-['Outfit'] truncate">
                {activeBookForReading.title}
              </h2>
              <p className="text-xs opacity-75 truncate">
                {activeBookForReading.author} · {activeBookForReading.genre}
              </p>
            </div>
          </div>

          {/* Reader Preferences & Exit */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-inherit text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded font-mono ${fontSize === 'sm' ? 'bg-amber-500 text-zinc-950 font-bold' : 'opacity-70'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded font-mono ${fontSize === 'base' ? 'bg-amber-500 text-zinc-950 font-bold' : 'opacity-70'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded font-mono ${fontSize === 'lg' ? 'bg-amber-500 text-zinc-950 font-bold' : 'opacity-70'}`}
              >
                A+
              </button>
            </div>

            {/* Reading Palette */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-inherit text-xs">
              <button
                onClick={() => setReaderTheme('dark')}
                title="Obsidian Dark"
                className={`w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 ${readerTheme === 'dark' ? 'ring-2 ring-amber-500' : ''}`}
              />
              <button
                onClick={() => setReaderTheme('sepia')}
                title="Sepia Paper"
                className={`w-5 h-5 rounded-full bg-[#f4e4ba] border border-amber-300 ${readerTheme === 'sepia' ? 'ring-2 ring-amber-500' : ''}`}
              />
              <button
                onClick={() => setReaderTheme('light')}
                title="Day Light"
                className={`w-5 h-5 rounded-full bg-white border border-zinc-300 ${readerTheme === 'light' ? 'ring-2 ring-amber-500' : ''}`}
              />
            </div>

            <button
              onClick={closeReader}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chapter Selection Strip */}
        <div className="px-6 py-2.5 border-b border-inherit flex items-center justify-between text-xs overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-2">
            <span className="opacity-60 shrink-0">Chapter:</span>
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentChapter(idx);
                  setHasFinishedCurrent(false);
                }}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                  currentChapter === idx
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                }`}
              >
                Ch. {ch.chapterNumber}
              </button>
            ))}
          </div>

          <span className="font-mono opacity-60 shrink-0">
            ~{chapter.estimatedMinutes} min read · +{Math.round(activeBookForReading.totalXp / chapters.length)} XP
          </span>
        </div>

        {/* Book Content Prose Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="text-center space-y-2 pb-6 border-b border-inherit">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
                Chapter {chapter.chapterNumber} of {chapters.length}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
                {chapter.title}
              </h1>
            </div>

            <div className={`space-y-6 ${fontSizeClass} font-serif tracking-normal`}>
              {chapter.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="indent-4 leading-relaxed opacity-95">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* End of Chapter Action */}
            <div className="pt-10 pb-6 border-t border-inherit text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <button
                  disabled={currentChapter === 0}
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl border border-inherit disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Chapter</span>
                </button>

                {!hasFinishedCurrent ? (
                  <button
                    onClick={handleFinishChapter}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Chapter & Claim XP</span>
                  </button>
                ) : (
                  <div className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Chapter Completed! (+{Math.round(activeBookForReading.totalXp / chapters.length)} XP Claimed)</span>
                  </div>
                )}

                <button
                  disabled={currentChapter === chapters.length - 1}
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl border border-inherit disabled:opacity-30"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
