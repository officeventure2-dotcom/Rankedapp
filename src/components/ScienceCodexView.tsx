import React, { useState, useMemo } from 'react';
import { useRanked } from '../context/RankedContext';
import { SCIENCE_CARDS_DATABASE } from '../data/scienceData';
import { ScienceCard, ScienceField } from '../types';
import {
  Atom,
  Sparkles,
  Volume2,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  HelpCircle,
  XCircle,
  Lightbulb,
  Award,
  Globe2,
  Dna,
  Brain,
  Compass,
  Trophy,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export const ScienceCodexView: React.FC = () => {
  const { gainXp, showToast, masteredScienceCardIds, toggleMasterScienceCard } = useRanked();

  const [selectedField, setSelectedField] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuizCardId, setActiveQuizCardId] = useState<string | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const fieldsList = [
    'All',
    'Quantum Physics',
    'Molecular Biology',
    'Astrophysics',
    'Neuroscience',
    'Biochemistry',
    'Cosmology',
    'Evolution'
  ];

  const filteredCards = useMemo(() => {
    return SCIENCE_CARDS_DATABASE.filter(card => {
      const matchesField = selectedField === 'All' || card.field === selectedField;
      const matchesSearch =
        card.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.breakthroughFact.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesField && matchesSearch;
    });
  }, [selectedField, searchQuery]);

  // Audio pronunciation via SpeechSynthesis
  const speakTerm = (term: string) => {
    sounds.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.rate = 0.85;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      showToast(`Audio: "${term}"`);
    }
  };

  const handleQuizAnswer = (card: ScienceCard, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(optionIndex);
    setQuizSubmitted(true);

    if (optionIndex === card.quiz.correctIndex) {
      sounds.playSuccess();
      gainXp(card.xpReward, 'degree', `Mastered Science Concept: ${card.term}`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      if (!masteredScienceCardIds.includes(card.id)) {
        toggleMasterScienceCard(card.id);
      }
      showToast(`✨ Quiz Passed! +${card.xpReward} XP awarded`);
    } else {
      sounds.playClick();
    }
  };

  const getFieldColor = (field: ScienceField) => {
    switch (field) {
      case 'Quantum Physics':
        return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30';
      case 'Molecular Biology':
      case 'Evolution':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'Astrophysics':
      case 'Cosmology':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Neuroscience':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Biochemistry':
      case 'Chemistry':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold tracking-wide border border-cyan-500/30">
              <Atom className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Science & Empirical Discovery Deck</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
              Science Codex: Words, Breakthroughs & Facts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Explore foundational scientific vocabulary, etymological origins, mind-bending empirical facts, and verifiable breakthroughs across Physics, Molecular Biology, Neuroscience, and Cosmology.
            </p>
          </div>

          {/* Quick Mastery KPIs */}
          <div className="flex items-center gap-4 bg-zinc-800/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700/60 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Codex Mastery</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {masteredScienceCardIds.length} <span className="text-xs font-normal text-zinc-400 font-sans">/ {SCIENCE_CARDS_DATABASE.length} Cards</span>
              </div>
              <div className="text-[10px] text-cyan-400 mt-0.5 font-mono">
                {Math.round((masteredScienceCardIds.length / SCIENCE_CARDS_DATABASE.length) * 100)}% Mastered
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Field Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {fieldsList.map(field => {
              const isActive = selectedField === field;
              return (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60'
                  }`}
                >
                  {field}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search science words & facts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-zinc-950/80 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

        </div>

      </div>

      {/* 2. Science Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCards.map(card => {
          const isMastered = masteredScienceCardIds.includes(card.id);
          const isQuizOpen = activeQuizCardId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all p-6 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4 flex flex-col justify-between ${
                isMastered
                  ? 'border-cyan-500/50 ring-1 ring-cyan-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Field tag, Pronounce, and Bookmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getFieldColor(card.field)}`}>
                      {card.field}
                    </span>
                    {card.discoveryYear && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {card.discoveryYear} {card.discoverer ? `· ${card.discoverer}` : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => speakTerm(card.term)}
                      title="Listen to pronunciation"
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleMasterScienceCard(card.id)}
                      title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isMastered
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isMastered ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Term & Pronunciation */}
                <div>
                  <h3 className="text-xl font-extrabold font-['Outfit'] text-zinc-900 dark:text-zinc-50">
                    {card.term}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400 font-mono">
                    <span>{card.pronunciation}</span>
                    <span>·</span>
                    <span className="italic text-zinc-500">{card.etymology}</span>
                  </div>
                </div>

                {/* Conceptual Definition */}
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {card.definition}
                </p>

                {/* Breakthrough Empirical Fact Card */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Breakthrough Empirical Fact</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                    {card.breakthroughFact}
                  </p>
                </div>

                {/* Real-World Impact */}
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5 pt-1">
                  <strong className="text-zinc-700 dark:text-zinc-300 shrink-0">Real-World Impact:</strong>
                  <span>{card.realWorldImpact}</span>
                </div>

              </div>

              {/* Bottom Actions: Quiz toggle & XP badge */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    +{card.xpReward} Science XP
                  </span>

                  <button
                    onClick={() => {
                      if (activeQuizCardId === card.id) {
                        setActiveQuizCardId(null);
                      } else {
                        setActiveQuizCardId(card.id);
                        setQuizSelectedOption(null);
                        setQuizSubmitted(false);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                      isQuizOpen
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                        : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{isQuizOpen ? 'Close Quiz' : 'Test Understanding'}</span>
                  </button>
                </div>

                {/* Comprehension Quiz Drawer */}
                {isQuizOpen && (
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-3 animate-in fade-in-50 duration-200">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {card.quiz.question}
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {card.quiz.options.map((opt, idx) => {
                        const isSelected = quizSelectedOption === idx;
                        const isCorrect = idx === card.quiz.correctIndex;

                        let btnStyle = 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-cyan-400';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizAnswer(card, idx)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 leading-relaxed">
                        <strong className="text-zinc-900 dark:text-zinc-100">Explanation: </strong>
                        {card.quiz.explanation}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
