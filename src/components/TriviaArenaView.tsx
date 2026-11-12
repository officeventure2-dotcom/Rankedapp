import React, { useState, useEffect, useMemo } from 'react';
import { useRanked } from '../context/RankedContext';
import { TRIVIA_BANK } from '../data/mockData';
import { TriviaQuestion, TriviaDifficulty, TriviaAttempt, TriviaStats } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  RotateCcw,
  History,
  BarChart3,
  Target,
  Youtube,
  ArrowRight,
  Clock,
  Filter,
  Trash2,
  Check,
  X,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface TriviaArenaViewProps {
  setActiveTab?: (tab: 'overview' | 'challenges' | 'badges' | 'leaderboard' | 'social' | 'chat' | 'academy' | 'science' | 'library') => void;
}

const STATS_STORAGE_KEY = 'ranked_trivia_stats_v1';
const HISTORY_STORAGE_KEY = 'ranked_trivia_history_v1';

const DEFAULT_STATS: TriviaStats = {
  totalAnswered: 3,
  correctAnswers: 2,
  wrongAnswers: 1,
  currentStreak: 1,
  bestStreak: 2,
  totalXpEarned: 950,
  byDifficulty: {
    Easy: { total: 1, correct: 1, wrong: 0 },
    Medium: { total: 1, correct: 1, wrong: 0 },
    Hard: { total: 1, correct: 0, wrong: 1 },
    Grandmaster: { total: 0, correct: 0, wrong: 0 }
  }
};

const DEFAULT_HISTORY: TriviaAttempt[] = [
  {
    id: 'att_init_1',
    questionId: 'triv_easy_1',
    question: 'Which planet in our solar system is known as the "Red Planet" due to iron oxide on its surface?',
    category: 'Astronomy',
    difficulty: 'Easy',
    selectedOption: 'Mars',
    correctOption: 'Mars',
    isCorrect: true,
    xpEarned: 200,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'att_init_2',
    questionId: 'triv_med_1',
    question: 'What is the theoretical boundary around a black hole beyond which nothing, not even light, can escape?',
    category: 'Astrophysics',
    difficulty: 'Medium',
    selectedOption: 'Event Horizon',
    correctOption: 'Event Horizon',
    isCorrect: true,
    xpEarned: 350,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'att_init_3',
    questionId: 'triv_hard_1',
    question: 'In what year was the Library of Alexandria reportedly damaged during Julius Caesar’s siege of Alexandria?',
    category: 'World History',
    difficulty: 'Hard',
    selectedOption: '323 BC',
    correctOption: '48 BC',
    isCorrect: false,
    xpEarned: 0,
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

export const TriviaArenaView: React.FC<TriviaArenaViewProps> = ({ setActiveTab }) => {
  const { gainXp } = useRanked();

  // Difficulty filter
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | TriviaDifficulty>('All');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // View mode tab: 'play' or 'stats-history'
  const [activeSubTab, setActiveSubTab] = useState<'play' | 'history'>('play');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'correct' | 'wrong' | TriviaDifficulty>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Statistics and History State
  const [stats, setStats] = useState<TriviaStats>(() => {
    try {
      const stored = localStorage.getItem(STATS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_STATS;
  });

  const [history, setHistory] = useState<TriviaAttempt[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_HISTORY;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Questions filtered by difficulty
  const filteredQuestions = useMemo(() => {
    if (selectedDifficulty === 'All') {
      return TRIVIA_BANK;
    }
    return TRIVIA_BANK.filter(q => q.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  // Safely index current question
  const currentQuestion: TriviaQuestion = useMemo(() => {
    if (filteredQuestions.length === 0) return TRIVIA_BANK[0];
    return filteredQuestions[questionIndex % filteredQuestions.length];
  }, [filteredQuestions, questionIndex]);

  // Handle difficulty selection
  const handleSelectDifficulty = (diff: 'All' | TriviaDifficulty) => {
    sounds.playClick();
    setSelectedDifficulty(diff);
    setQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
  };

  // Submit answer
  const handleAnswerOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(index);
    setIsSubmitted(true);

    const isCorrect = index === currentQuestion.correctIndex;
    const chosenOptionText = currentQuestion.options[index];
    const correctOptionText = currentQuestion.options[currentQuestion.correctIndex];
    const earnedXp = isCorrect ? currentQuestion.xp : 0;

    if (isCorrect) {
      sounds.playSuccess();
      gainXp(currentQuestion.xp, 'trivia', `Trivia [${currentQuestion.difficulty}]: ${currentQuestion.category}`);

      // Special audio & confetti for Grandmaster or streak milestones
      if (currentQuestion.difficulty === 'Grandmaster' || stats.currentStreak + 1 >= 3) {
        sounds.playBadgeUnlock();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      }
    } else {
      sounds.playError();
    }

    // Update attempt history
    const newAttempt: TriviaAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty,
      selectedOption: chosenOptionText,
      correctOption: correctOptionText,
      isCorrect,
      xpEarned: earnedXp,
      timestamp: new Date().toISOString()
    };

    setHistory(prev => [newAttempt, ...prev]);

    // Update comprehensive statistics
    setStats(prev => {
      const nextStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, nextStreak);
      const diffKey = currentQuestion.difficulty;
      const prevDiff = prev.byDifficulty[diffKey] || { total: 0, correct: 0, wrong: 0 };

      return {
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
        currentStreak: nextStreak,
        bestStreak,
        totalXpEarned: prev.totalXpEarned + earnedXp,
        byDifficulty: {
          ...prev.byDifficulty,
          [diffKey]: {
            total: prevDiff.total + 1,
            correct: prevDiff.correct + (isCorrect ? 1 : 0),
            wrong: prevDiff.wrong + (isCorrect ? 0 : 1)
          }
        }
      };
    });
  };

  // Next question
  const handleNextQuestion = () => {
    sounds.playClick();
    setQuestionIndex(prev => prev + 1);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
  };

  // Clear stats
  const handleResetStats = () => {
    setStats({
      totalAnswered: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalXpEarned: 0,
      byDifficulty: {
        Easy: { total: 0, correct: 0, wrong: 0 },
        Medium: { total: 0, correct: 0, wrong: 0 },
        Hard: { total: 0, correct: 0, wrong: 0 },
        Grandmaster: { total: 0, correct: 0, wrong: 0 }
      }
    });
    setHistory([]);
    setShowClearConfirm(false);
  };

  // Filtered history list
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      if (historyFilter === 'all') return true;
      if (historyFilter === 'correct') return item.isCorrect;
      if (historyFilter === 'wrong') return !item.isCorrect;
      return item.difficulty === historyFilter;
    });
  }, [history, historyFilter]);

  // Overall accuracy calculation
  const accuracyPercentage = stats.totalAnswered > 0
    ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100)
    : 0;

  // Formatting relative time
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Difficulty badge styling helper
  const getDifficultyBadge = (diff: TriviaDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'Grandmaster':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/40 shadow-sm';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Ranked Polymath Cognitive Arena</span>
            </div>
            <h2 className="text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              Trivia Arena & Knowledge Matrix
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Select difficulty tiers, test cross-disciplinary mastery, and track complete answer history and statistics.
            </p>
          </div>

          {/* Quick Sub-Tab Switcher: Play vs History & Stats */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 self-start md:self-center">
            <button
              onClick={() => { sounds.playClick(); setActiveSubTab('play'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'play'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-amber-500" />
              <span>Challenge Arena</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveSubTab('history'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'history'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Stats & History ({stats.totalAnswered})</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
          
          {/* Total Answered */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs mb-1">
              <span>Total Questions</span>
              <Target className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.totalAnswered}
            </div>
          </div>

          {/* Correct Answers */}
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs mb-1">
              <span>Right Answers</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.correctAnswers}
            </div>
          </div>

          {/* Wrong Answers */}
          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs mb-1">
              <span>Wrong Answers</span>
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {stats.wrongAnswers}
            </div>
          </div>

          {/* Accuracy % */}
          <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 text-xs mb-1">
              <span>Accuracy</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {accuracyPercentage}%
            </div>
          </div>

          {/* Current Streak */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs mb-1">
              <span>Current Streak</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span>{stats.currentStreak}</span>
              <span className="text-[10px] font-normal text-zinc-500">best: {stats.bestStreak}</span>
            </div>
          </div>

          {/* Trivia XP Won */}
          <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-xs mb-1">
              <span>Trivia XP</span>
              <Trophy className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
              +{stats.totalXpEarned.toLocaleString()}
            </div>
          </div>
        </div>

      </div>

      {/* DIFFICULTY SELECTOR BAR */}
      <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Select Trivia Difficulty Tier:</span>
          </div>
          <span className="text-xs text-zinc-500">
            Showing {filteredQuestions.length} questions in this pool
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* ALL DIFFICULTIES */}
          <button
            onClick={() => handleSelectDifficulty('All')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedDifficulty === 'All'
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>All Tiers</span>
              <span className="text-[10px] font-mono opacity-80">{TRIVIA_BANK.length}</span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">Mixed challenge</p>
          </button>

          {/* EASY */}
          <button
            onClick={() => handleSelectDifficulty('Easy')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedDifficulty === 'Easy'
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 hover:border-emerald-500/60'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Easy</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                +200 XP
              </span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">Foundational recall</p>
          </button>

          {/* MEDIUM */}
          <button
            onClick={() => handleSelectDifficulty('Medium')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedDifficulty === 'Medium'
                ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                : 'border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 hover:border-amber-500/60'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Medium</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200">
                +360 XP
              </span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">Analytical recall</p>
          </button>

          {/* HARD */}
          <button
            onClick={() => handleSelectDifficulty('Hard')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedDifficulty === 'Hard'
                ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                : 'border-orange-500/30 bg-orange-500/5 text-orange-800 dark:text-orange-300 hover:border-orange-500/60'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Hard</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-800 dark:text-orange-200">
                +600 XP
              </span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">Deep polymath knowledge</p>
          </button>

          {/* GRANDMASTER */}
          <button
            onClick={() => handleSelectDifficulty('Grandmaster')}
            className={`p-3 rounded-xl border text-left transition-all col-span-2 sm:col-span-1 ${
              selectedDifficulty === 'Grandmaster'
                ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                : 'border-purple-500/40 bg-purple-500/10 text-purple-800 dark:text-purple-300 hover:border-purple-500/70'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Grandmaster</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-800 dark:text-purple-200">
                +1,000+ XP
              </span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">Research & Mensa tier</p>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE CHALLENGE ARENA */}
      {activeSubTab === 'play' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
          
          {/* Question Metadata Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                  {currentQuestion.category}
                </span>
                <span className="text-zinc-400">·</span>
                <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getDifficultyBadge(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 text-xs">
                  Question {(questionIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Active Trivia Challenge
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {setActiveTab && (
                <button
                  onClick={() => setActiveTab('academy')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors shadow-sm"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Educational Videos</span>
                </button>
              )}
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  +{currentQuestion.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
            <p className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {currentQuestion.options.map((optionText, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let style = 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200';
              if (isSubmitted) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/50';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100 font-semibold ring-1 ring-rose-500/50';
                } else {
                  style = 'opacity-40 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 text-zinc-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleAnswerOption(idx)}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{optionText}</span>
                  </div>

                  {isSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result & Explanation Card */}
          {isSubmitted && (
            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedOptionIndex === currentQuestion.correctIndex ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Correct Answer! (+{currentQuestion.xp} XP)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                      <XCircle className="w-5 h-5" />
                      <span>Incorrect Answer (+0 XP)</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedOptionIndex === currentQuestion.correctIndex
                    ? (<span className="inline-flex items-center gap-1">Current streak: {stats.currentStreak} <Flame className="w-3.5 h-3.5 text-orange-500" /></span>)
                    : `Streak reset to 0`}
                </div>
              </div>

              <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-zinc-700/60 pt-3">
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold block mb-1">
                  Academic Explanation:
                </strong>
                {currentQuestion.explanation}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm"
                >
                  <span>Next Challenge Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { sounds.playClick(); setActiveSubTab('history'); }}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  View stats & answer log →
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: DETAILED PREVIOUS DATA & STATS BREAKDOWN */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          
          {/* Detailed Performance Breakdown by Difficulty */}
          <div className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <span>Performance Stats by Difficulty</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Breakdown of right, wrong, and total answers across all academic difficulty tiers
                </p>
              </div>

              {history.length > 0 && (
                <div>
                  {!showClearConfirm ? (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset Stats</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-500 font-semibold">Confirm Reset?</span>
                      <button
                        onClick={handleResetStats}
                        className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-500"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2.5 py-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4 Difficulty Tier Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['Easy', 'Medium', 'Hard', 'Grandmaster'] as TriviaDifficulty[]).map(diff => {
                const diffData = stats.byDifficulty[diff] || { total: 0, correct: 0, wrong: 0 };
                const pct = diffData.total > 0 ? Math.round((diffData.correct / diffData.total) * 100) : 0;
                
                return (
                  <div
                    key={diff}
                    className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border text-xs font-bold ${getDifficultyBadge(diff)}`}>
                          {diff}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {diffData.total} {diffData.total === 1 ? 'attempt' : 'attempts'}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {pct}% accuracy
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex">
                      <div
                        style={{ width: `${pct}%` }}
                        className="bg-emerald-500 h-full transition-all duration-300"
                      />
                      <div
                        style={{ width: `${100 - pct}%` }}
                        className="bg-rose-500/60 h-full transition-all duration-300"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <strong>{diffData.correct}</strong> Right
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        <strong>{diffData.wrong}</strong> Wrong
                      </span>
                      <span className="text-zinc-500">
                        Total: <strong>{diffData.total}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Previous Answers History Log */}
          <div className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-500" />
                  <span>Previous Trivia Answers & History Log</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Review past questions, chosen responses, and correct answers
                </p>
              </div>

              {/* Filter Strip */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'correct', 'wrong', 'Easy', 'Medium', 'Hard', 'Grandmaster'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { sounds.playClick(); setHistoryFilter(f); }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors capitalize ${
                      historyFilter === f
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* History List */}
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Target className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  No trivia attempts recorded for this filter
                </p>
                <p className="text-xs text-zinc-500">
                  Play trivia questions in the arena to populate your answer archive.
                </p>
                <button
                  onClick={() => { sounds.playClick(); setActiveSubTab('play'); }}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
                >
                  Go to Arena
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.isCorrect
                        ? 'border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-950/10'
                        : 'border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-950/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Right
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <X className="w-3 h-3" /> Wrong
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getDifficultyBadge(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          +{item.xpEarned} XP
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2.5">
                      {item.question}
                    </p>

                    {/* Choices recap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-2.5 rounded-lg border ${
                        item.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/30 text-rose-900 dark:text-rose-200'
                      }`}>
                        <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                          Your Answer:
                        </span>
                        <span className="font-medium">{item.selectedOption}</span>
                      </div>

                      {!item.isCorrect && (
                        <div className="p-2.5 rounded-lg border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
                          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                            Correct Answer:
                          </span>
                          <span className="font-medium">{item.correctOption}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
