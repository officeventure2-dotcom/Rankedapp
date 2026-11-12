import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Brain,
  Trophy,
  Zap,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Users,
  Bot,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface ClashRound {
  title: string;
  type: 'sequence' | 'math' | 'pattern';
  prompt: string;
  options: string[];
  correctIndex: number;
}

const CLASH_ROUNDS: ClashRound[] = [
  {
    title: 'Round 1: Rapid Sequence Pattern',
    type: 'sequence',
    prompt: 'Complete: 7 → 15 → 31 → 63 → ?',
    options: ['125', '127', '129', '131'],
    correctIndex: 1
  },
  {
    title: 'Round 2: Mental Arithmetic Speed',
    type: 'math',
    prompt: 'Evaluate: (18 × 4) - (37 + 14) = ?',
    options: ['19', '21', '23', '25'],
    correctIndex: 1
  },
  {
    title: 'Round 3: Spatial Matrix Complement',
    type: 'pattern',
    prompt: 'Which polygon has 9 sides?',
    options: ['Heptagon', 'Nonagon', 'Decagon', 'Hendecagon'],
    correctIndex: 1
  },
  {
    title: 'Round 4: Fibonacci Recurrence',
    type: 'sequence',
    prompt: 'Next integer: 13, 21, 34, 55, ?',
    options: ['84', '89', '91', '94'],
    correctIndex: 1
  },
  {
    title: 'Round 5: Grand Finale Deduction',
    type: 'math',
    prompt: 'Prime count between 20 and 40:',
    options: ['3', '4', '5', '6'],
    correctIndex: 1 // 23, 29, 31, 37 = 4 primes
  }
];

export const MindMatrixGame: React.FC = () => {
  const { user, gainXp, showToast } = useRanked();

  const [mode, setMode] = useState<'2p' | 'ai'>('ai');
  const [roundIndex, setRoundIndex] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Answered, setP1Answered] = useState<number | null>(null);
  const [p2Answered, setP2Answered] = useState<number | null>(null);
  const [roundResolved, setRoundResolved] = useState(false);
  const [roundTimer, setRoundTimer] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef<number | null>(null);
  const currentRound = CLASH_ROUNDS[roundIndex];

  // Round countdown
  useEffect(() => {
    if (isGameOver || roundResolved) return;

    timerRef.current = window.setInterval(() => {
      setRoundTimer(prev => {
        if (prev <= 1) {
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roundIndex, roundResolved, isGameOver]);

  // AI Opponent auto-play simulation
  useEffect(() => {
    if (mode !== 'ai' || roundResolved || isGameOver) return;

    // AI answers between 1.5s and 3.5s
    const aiSpeed = Math.floor(Math.random() * 2000) + 1600;
    const aiTimer = setTimeout(() => {
      if (roundResolved) return;
      // 85% accuracy for high-tier AI
      const willBeCorrect = Math.random() < 0.85;
      const chosen = willBeCorrect
        ? currentRound.correctIndex
        : (currentRound.correctIndex + 1) % currentRound.options.length;

      setP2Answered(chosen);
      if (chosen === currentRound.correctIndex) {
        setP2Score(prev => prev + 100);
      }
      setRoundResolved(true);
    }, aiSpeed);

    return () => clearTimeout(aiTimer);
  }, [roundIndex, mode, roundResolved, isGameOver]);

  const handleP1Answer = (idx: number) => {
    if (p1Answered !== null || roundResolved) return;
    setP1Answered(idx);

    if (idx === currentRound.correctIndex) {
      sounds.playSuccess();
      const speedBonus = roundTimer * 10;
      setP1Score(prev => prev + 100 + speedBonus);
    } else {
      sounds.playClick();
    }

    if (mode === 'ai' || p2Answered !== null) {
      setRoundResolved(true);
    }
  };

  const handleP2Answer = (idx: number) => {
    if (mode !== '2p' || p2Answered !== null || roundResolved) return;
    setP2Answered(idx);

    if (idx === currentRound.correctIndex) {
      sounds.playSuccess();
      const speedBonus = roundTimer * 10;
      setP2Score(prev => prev + 100 + speedBonus);
    } else {
      sounds.playClick();
    }

    if (p1Answered !== null) {
      setRoundResolved(true);
    }
  };

  const handleTimeExpired = () => {
    setRoundResolved(true);
    sounds.playClick();
  };

  const handleNextRound = () => {
    if (roundIndex < CLASH_ROUNDS.length - 1) {
      setRoundIndex(prev => prev + 1);
      setP1Answered(null);
      setP2Answered(null);
      setRoundResolved(false);
      setRoundTimer(10);
    } else {
      setIsGameOver(true);
      if (p1Score > p2Score) {
        sounds.playLevelUp();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
        gainXp(3000, 'iq', 'Mind Matrix Duel Champion');
        showToast(`Mind Matrix Champion! +3,000 XP in IQ & Cognitive Pillar`);
      } else {
        showToast('Match concluded! Great cognitive duel.');
      }
    }
  };

  const resetGame = () => {
    setRoundIndex(0);
    setP1Score(0);
    setP2Score(0);
    setP1Answered(null);
    setP2Answered(null);
    setRoundResolved(false);
    setRoundTimer(10);
    setIsGameOver(false);
    sounds.playClick();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              Mind Matrix Cognitive Clash (1v1)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Rapid numerical deduction, spatial pattern reasoning, and speed calculation duel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => { setMode('ai'); resetGame(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              mode === 'ai'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            vs Ranked AI Bot
          </button>
          <button
            onClick={() => { setMode('2p'); resetGame(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              mode === '2p'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Two Players (Split-Screen)
          </button>
        </div>
      </div>

      {/* Arena Stage */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
        
        {/* Match HUD & Scores */}
        <div className="grid grid-cols-3 items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
          {/* Player 1 */}
          <div className="text-left space-y-1">
            <span className="text-xs text-zinc-400 font-mono">PLAYER 1</span>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
              {p1Score} <span className="text-xs font-normal text-zinc-500">pts</span>
            </p>
          </div>

          {/* Central Timer & Round */}
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {currentRound.title}
            </span>
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-mono text-xl font-bold border-2 ${
              roundTimer <= 3
                ? 'border-rose-500 text-rose-500 animate-pulse bg-rose-50 dark:bg-rose-950/40'
                : 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30'
            }`}>
              {roundTimer}
            </div>
          </div>

          {/* Player 2 / Bot */}
          <div className="text-right space-y-1">
            <span className="text-xs text-zinc-400 font-mono">
              {mode === 'ai' ? 'OPPONENT BOT' : 'PLAYER 2'}
            </span>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {mode === 'ai' ? 'Dr. Marcus Vance (AI)' : 'Friend / Guest'}
            </p>
            <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {p2Score} <span className="text-xs font-normal text-zinc-500">pts</span>
            </p>
          </div>
        </div>

        {/* Central Puzzle Prompt */}
        {!isGameOver ? (
          <div className="space-y-6">
            <div className="text-center py-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Cognitive Challenge
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 mt-1">
                {currentRound.prompt}
              </h2>
            </div>

            {/* Split Answering Panes for Two Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Player 1 Console */}
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 space-y-3">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
                  {user.name}’s Input Console:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {currentRound.options.map((opt, idx) => {
                    const isSelected = p1Answered === idx;
                    const isCorrect = idx === currentRound.correctIndex;

                    let btnStyle = 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-purple-500';
                    if (roundResolved) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={p1Answered !== null || roundResolved}
                        onClick={() => handleP1Answer(idx)}
                        className={`p-3 rounded-lg border text-sm font-semibold transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Player 2 Console / Bot Status */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20 space-y-3">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                  {mode === 'ai' ? 'Opponent AI Status:' : 'Player 2 Input Console:'}
                </span>

                {mode === '2p' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {currentRound.options.map((opt, idx) => {
                      const isSelected = p2Answered === idx;
                      const isCorrect = idx === currentRound.correctIndex;

                      let btnStyle = 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-amber-500';
                      if (roundResolved) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-bold';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={p2Answered !== null || roundResolved}
                          onClick={() => handleP2Answer(idx)}
                          className={`p-3 rounded-lg border text-sm font-semibold transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <Bot className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {p2Answered !== null
                        ? `AI selected: ${currentRound.options[p2Answered]} (${p2Answered === currentRound.correctIndex ? 'Correct' : 'Incorrect'})`
                        : 'Grandmaster AI is calculating solution...'}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Next Round Action */}
            {roundResolved && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800"
                >
                  {roundIndex < CLASH_ROUNDS.length - 1 ? 'Next Round &rarr;' : 'Finish Duel & View Champion'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Final Match Victory Screen */
          <div className="p-8 rounded-2xl border-2 border-purple-500 bg-purple-50/30 dark:bg-purple-950/30 text-center space-y-4">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
            <h3 className="text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              {p1Score > p2Score
                ? `${user.name} Wins the Clash!`
                : p2Score > p1Score
                ? `${mode === 'ai' ? 'Dr. Marcus Vance' : 'Player 2'} Wins the Clash!`
                : 'Cognitive Deadlock: Tie Match!'}
            </h3>
            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-300">
              Final Score: {p1Score} pts vs {p2Score} pts
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {p1Score > p2Score
                ? '+3,000 XP in IQ & Cognitive Reasoning awarded to your profile!'
                : 'Excellent speed training. Rematch to claim the leaderboard bounty!'}
            </p>
            <div className="pt-2">
              <button
                onClick={resetGame}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Play Rematch
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
