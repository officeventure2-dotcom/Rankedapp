import React, { useState, useEffect, useMemo } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  Flame,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Calculator,
  Lightbulb,
  Timer,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface Puzzle24 {
  id: string;
  numbers: number[];
  solution: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Grandmaster';
  hint: string;
}

const PUZZLES_24: Puzzle24[] = [
  // Easy
  { id: 'p24_1', numbers: [6, 4, 2, 1], solution: '(6 * 4) * (2 - 1) = 24', difficulty: 'Easy', hint: 'Multiply 6 and 4 to reach 24 immediately.' },
  { id: 'p24_2', numbers: [8, 3, 2, 2], solution: '8 * 3 + (2 - 2) = 24', difficulty: 'Easy', hint: '8 times 3 is 24, cancel out the 2s.' },
  { id: 'p24_3', numbers: [6, 6, 6, 6], solution: '6 + 6 + 6 + 6 = 24', difficulty: 'Easy', hint: 'Add all four identical numbers together.' },
  { id: 'p24_4', numbers: [9, 5, 2, 8], solution: '(9 - 5) * (8 - 2) = 24', difficulty: 'Easy', hint: 'Make 4 and 6, then multiply them.' },
  { id: 'p24_5', numbers: [7, 5, 4, 2], solution: '(7 - 5 + 4) * 4 ... (7 + 5) * (4 - 2) = 24', difficulty: 'Easy', hint: '(7 + 5) gives 12, then multiply by (4 - 2).' },

  // Medium
  { id: 'p24_6', numbers: [3, 3, 8, 8], solution: '8 / (3 - 8 / 3) = 24', difficulty: 'Medium', hint: 'Use fractions! 8 divided by (3 - 8/3).' },
  { id: 'p24_7', numbers: [4, 4, 10, 10], solution: '(10 * 10 - 4) / 4 = 24', difficulty: 'Medium', hint: 'Multiply the 10s to get 100, subtract 4, divide by 4.' },
  { id: 'p24_8', numbers: [1, 5, 5, 5], solution: '(5 - 1 / 5) * 5 = 24', difficulty: 'Medium', hint: '5 minus one-fifth equals 4.8. 4.8 * 5 = 24.' },
  { id: 'p24_9', numbers: [3, 7, 3, 7], solution: '(3 + 3 / 7) * 7 = 24', difficulty: 'Medium', hint: 'Fraction technique: (3 + 3/7) * 7 = 24.' },
  { id: 'p24_10', numbers: [2, 7, 7, 10], solution: '(2 + 10 / 7) * 7 = 24', difficulty: 'Medium', hint: 'Add 2 and 10/7, then multiply the whole thing by 7.' },

  // Hard
  { id: 'p24_11', numbers: [1, 4, 5, 6], solution: '6 / (5/4 - 1) = 24', difficulty: 'Hard', hint: 'Division by fractions: 4 / (1 - 5/6) = 24.' },
  { id: 'p24_12', numbers: [2, 3, 5, 12], solution: '(5 - 3) * 12 + (2 - 2) = 24', difficulty: 'Hard', hint: '(12 / (5 - 3)) * ... or (5 - 3) * 12.' },
  { id: 'p24_13', numbers: [8, 8, 3, 3], solution: '8 / (3 - 8 / 3) = 24', difficulty: 'Hard', hint: 'Think of 3 - 8/3 = 1/3, then 8 / (1/3) = 24.' },
  { id: 'p24_14', numbers: [2, 4, 10, 10], solution: '(10 * 10 - 4) / 4 ... or (10 + 2) * (10 / 5)', difficulty: 'Hard', hint: 'Manipulate powers of 10 and factor out 24.' },

  // Grandmaster
  { id: 'p24_15', numbers: [3, 3, 7, 7], solution: '(3 + 3/7) * 7 = 24', difficulty: 'Grandmaster', hint: '3 + 3/7 is 24/7. Multiplying by 7 cancels the denominator!' },
  { id: 'p24_16', numbers: [1, 3, 4, 6], solution: '6 / (1 - 3 / 4) = 24', difficulty: 'Grandmaster', hint: '1 - 3/4 is 1/4. 6 divided by 1/4 is 24!' }
];

export const Game24: React.FC = () => {
  const { gainXp, showToast } = useRanked();

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [tokensUsed, setTokensUsed] = useState<number[]>([]); // indexes of numbers used
  const [expression, setExpression] = useState<string[]>([]); // list of tokens: numbers or operators
  const [evaluationResult, setEvaluationResult] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);

  const currentPuzzle = PUZZLES_24[puzzleIndex % PUZZLES_24.length];

  // Reset current puzzle attempt
  const resetAttempt = () => {
    sounds.playClick();
    setTokensUsed([]);
    setExpression([]);
    setEvaluationResult(null);
    setErrorMsg(null);
    setIsSuccess(false);
    setShowHint(false);
  };

  // Switch to next puzzle
  const nextPuzzle = () => {
    sounds.playClick();
    setPuzzleIndex(prev => prev + 1);
    resetAttempt();
  };

  // Add number to expression
  const addNumber = (num: number, idx: number) => {
    if (tokensUsed.includes(idx) || isSuccess) return;
    sounds.playClick();
    setTokensUsed(prev => [...prev, idx]);
    setExpression(prev => [...prev, num.toString()]);
    setErrorMsg(null);
  };

  // Add operator
  const addOperator = (op: string) => {
    if (isSuccess) return;
    sounds.playClick();
    setExpression(prev => [...prev, op]);
    setErrorMsg(null);
  };

  // Backspace last token
  const backspace = () => {
    if (expression.length === 0 || isSuccess) return;
    sounds.playClick();
    const lastToken = expression[expression.length - 1];
    setExpression(prev => prev.slice(0, -1));

    // If last token was a number, return it to the available tokens
    const num = parseInt(lastToken, 10);
    if (!isNaN(num)) {
      // Find the last index in tokensUsed matching this number
      for (let i = tokensUsed.length - 1; i >= 0; i--) {
        const originalIndex = tokensUsed[i];
        if (currentPuzzle.numbers[originalIndex] === num) {
          setTokensUsed(prev => prev.filter((_, idx) => idx !== i));
          break;
        }
      }
    }
    setErrorMsg(null);
  };

  // Safe arithmetic evaluator for tokens
  const safeEvaluate = (tokens: string[]): number | null => {
    try {
      const sanitized = tokens
        .join('')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Only allow digits, parentheses, +, -, *, /
      if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
        return null;
      }

      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${sanitized});`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 1000) / 1000;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Submit and check 24
  const checkAnswer = () => {
    if (tokensUsed.length < 4) {
      setErrorMsg('You must use all 4 numbers in your mathematical expression!');
      sounds.playError();
      return;
    }

    const result = safeEvaluate(expression);
    if (result === null) {
      setErrorMsg('Invalid mathematical syntax or division by zero.');
      sounds.playError();
      return;
    }

    setEvaluationResult(result);

    // Allow small floating point tolerance for fraction solutions (e.g. 23.999 -> 24)
    if (Math.abs(result - 24) < 0.001) {
      setIsSuccess(true);
      sounds.playSuccess();
      sounds.playBadgeUnlock();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      const xpEarned = currentPuzzle.difficulty === 'Grandmaster' ? 600 : currentPuzzle.difficulty === 'Hard' ? 450 : 300;
      gainXp(xpEarned, 'iq', `The 24 Challenge [${currentPuzzle.difficulty}]`);
      setStreak(prev => prev + 1);
      setSolvedCount(prev => prev + 1);
      showToast(`Exact 24 formed! +${xpEarned} XP awarded!`);
    } else {
      setErrorMsg(`Equals ${result}, not 24. Try another combination!`);
      sounds.playError();
    }
  };

  const getDifficultyBadge = (d: string) => {
    switch (d) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'Grandmaster':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/40 shadow-sm';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30';
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Arithmetical Logic & Combinatorial Reasoning</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>The 24 Challenge</span>
            <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getDifficultyBadge(currentPuzzle.difficulty)}`}>
              {currentPuzzle.difficulty}
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Use all four numbers exactly once with arithmetic operations to equal 24.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Streak: {streak}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
            <Trophy className="w-3.5 h-3.5 text-indigo-500" />
            <span>Solved: {solvedCount}</span>
          </div>

          <button
            onClick={nextPuzzle}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            Skip Puzzle
          </button>
        </div>
      </div>

      {/* The 4 Number Cards */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
          <span>Available Hand ({4 - tokensUsed.length} remaining):</span>
          <span className="text-zinc-400 font-mono text-[11px]">Puzzle #{puzzleIndex + 1} of {PUZZLES_24.length}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
          {currentPuzzle.numbers.map((num, idx) => {
            const isUsed = tokensUsed.includes(idx);
            return (
              <button
                key={idx}
                disabled={isUsed || isSuccess}
                onClick={() => addNumber(num, idx)}
                className={`aspect-square sm:aspect-[4/3] rounded-2xl border-2 flex flex-col items-center justify-center font-mono text-2xl sm:text-3xl font-extrabold transition-all cursor-pointer ${
                  isUsed
                    ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 cursor-not-allowed scale-95 opacity-50'
                    : 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 hover:border-amber-500 hover:scale-105 shadow-md'
                }`}
              >
                <span>{num}</span>
                <span className="text-[10px] font-sans font-medium text-zinc-400">
                  {isUsed ? 'Used' : 'Tap to use'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equation Construction Workbench */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Formed Expression:</span>
          {expression.length > 0 && (
            <button
              onClick={resetAttempt}
              className="text-xs text-rose-500 hover:text-rose-600 underline font-semibold"
            >
              Clear Expression
            </button>
          )}
        </div>

        {/* Display Box */}
        <div className="min-h-14 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between gap-3 overflow-x-auto font-mono text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {expression.length === 0 ? (
              <span className="text-zinc-400 text-sm font-normal font-sans">
                Tap number cards and operator keys below to construct formula...
              </span>
            ) : (
              expression.map((token, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-lg ${
                    /^[0-9]+$/.test(token)
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {token}
                </span>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-zinc-400 font-bold">=</span>
            <span className={`text-xl font-mono font-extrabold ${
              isSuccess ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              24
            </span>
          </div>
        </div>

        {/* Error / Evaluation message */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Brilliant! Expression successfully evaluates to 24!</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{currentPuzzle.difficulty === 'Grandmaster' ? 600 : 350} XP
              </span>
            </div>
            <p className="text-xs opacity-80">
              Formula: <span className="font-mono font-bold">{expression.join(' ')} = 24</span>
            </p>
            <button
              onClick={nextPuzzle}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Next 24 Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Operators & Controls Strip */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {['+', '−', '×', '÷', '(', ')'].map(op => (
            <button
              key={op}
              disabled={isSuccess}
              onClick={() => addOperator(op)}
              className="py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-lg font-bold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
            >
              {op}
            </button>
          ))}

          <button
            disabled={expression.length === 0 || isSuccess}
            onClick={backspace}
            className="py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-all"
          >
            ⌫ Del
          </button>
        </div>

        {/* Submit & Hint Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowHint(prev => !prev)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>

          <button
            disabled={isSuccess}
            onClick={checkAnswer}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Evaluate Equation</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
            <strong className="font-semibold block mb-0.5">Clue:</strong>
            {currentPuzzle.hint}
          </div>
        )}

      </div>

    </div>
  );
};
