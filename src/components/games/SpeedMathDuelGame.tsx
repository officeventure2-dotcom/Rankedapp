import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Trophy,
  Users,
  Bot,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Swords
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface MathProblem {
  text: string;
  answer: number;
  options: number[];
}

const generateProblem = (): MathProblem => {
  const types = ['add', 'sub', 'mul', 'div', 'sq'];
  const type = types[Math.floor(Math.random() * types.length)];
  let text = '';
  let answer = 0;

  if (type === 'add') {
    const a = Math.floor(Math.random() * 45) + 12;
    const b = Math.floor(Math.random() * 45) + 12;
    text = `${a} + ${b}`;
    answer = a + b;
  } else if (type === 'sub') {
    const a = Math.floor(Math.random() * 60) + 30;
    const b = Math.floor(Math.random() * 30) + 5;
    text = `${a} − ${b}`;
    answer = a - b;
  } else if (type === 'mul') {
    const a = Math.floor(Math.random() * 12) + 3;
    const b = Math.floor(Math.random() * 12) + 4;
    text = `${a} × ${b}`;
    answer = a * b;
  } else if (type === 'div') {
    const b = Math.floor(Math.random() * 9) + 3;
    const res = Math.floor(Math.random() * 12) + 2;
    const a = b * res;
    text = `${a} ÷ ${b}`;
    answer = res;
  } else {
    const a = Math.floor(Math.random() * 8) + 6; // 6 to 13
    text = `${a}²`;
    answer = a * a;
  }

  // Generate 3 clever distractors
  const distractors = new Set<number>();
  distractors.add(answer + 1);
  distractors.add(answer - 1);
  distractors.add(answer + (Math.random() > 0.5 ? 10 : -10));

  while (distractors.size < 3) {
    const d = answer + Math.floor(Math.random() * 10) - 5;
    if (d !== answer) distractors.add(d);
  }

  const options = Array.from(distractors).slice(0, 3);
  options.push(answer);
  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  return { text, answer, options };
};

export const SpeedMathDuelGame: React.FC = () => {
  const { gainXp, showToast } = useRanked();

  const [mode, setMode] = useState<'bot' | '2p'>('bot');
  const [problem, setProblem] = useState<MathProblem>(() => generateProblem());
  const [tugPosition, setTugPosition] = useState<number>(50); // 0 (P1 wins) to 100 (P2 wins)
  const [activePlayerTurn, setActivePlayerTurn] = useState<1 | 2>(1);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [p1Streak, setP1Streak] = useState<number>(0);
  const [p2Streak, setP2Streak] = useState<number>(0);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (winner || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Determine winner by tug position
          if (tugPosition < 50) {
            handleGameOver(1);
          } else if (tugPosition > 50) {
            handleGameOver(2);
          } else {
            showToast('Time expired! Equal duel!');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [winner, timerSeconds, tugPosition]);

  // Handle game end
  const handleGameOver = (winP: 1 | 2) => {
    setWinner(winP);
    if (winP === 1) {
      sounds.playSuccess();
      sounds.playBadgeUnlock();
      gainXp(400, 'iq', 'Speed Math Duel Victory');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      showToast('Player 1 won the Speed Math Duel! +400 XP');
    } else {
      sounds.playError();
      showToast(mode === 'bot' ? 'DeepMath Bot won the duel!' : 'Player 2 won the duel!');
    }
  };

  // Bot response loop
  useEffect(() => {
    if (mode === 'bot' && activePlayerTurn === 2 && !winner) {
      setIsBotThinking(true);
      const delay = Math.floor(Math.random() * 1200) + 1200; // 1.2s to 2.4s
      const timer = setTimeout(() => {
        setIsBotThinking(false);
        // 80% accuracy for bot
        const isBotCorrect = Math.random() < 0.82;
        if (isBotCorrect) {
          sounds.playClick();
          setP2Score(s => s + 1);
          setP2Streak(st => st + 1);
          setTugPosition(prev => {
            const next = Math.min(100, prev + 12);
            if (next >= 100) handleGameOver(2);
            return next;
          });
        } else {
          setP2Streak(0);
          setTugPosition(prev => Math.max(0, prev - 6));
        }

        setProblem(generateProblem());
        setActivePlayerTurn(1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [activePlayerTurn, mode, winner]);

  // Answer selection
  const handleAnswer = (val: number, player: 1 | 2) => {
    if (winner || isBotThinking) return;

    if (val === problem.answer) {
      sounds.playSuccess();
      if (player === 1) {
        setP1Score(s => s + 1);
        setP1Streak(st => st + 1);
        setTugPosition(prev => {
          const next = Math.max(0, prev - 12);
          if (next <= 0) handleGameOver(1);
          return next;
        });
        if (mode === '2p') setActivePlayerTurn(2);
        else if (mode === 'bot') setActivePlayerTurn(2);
      } else {
        setP2Score(s => s + 1);
        setP2Streak(st => st + 1);
        setTugPosition(prev => {
          const next = Math.min(100, prev + 12);
          if (next >= 100) handleGameOver(2);
          return next;
        });
        setActivePlayerTurn(1);
      }
    } else {
      sounds.playError();
      if (player === 1) {
        setP1Streak(0);
        setTugPosition(prev => Math.min(100, prev + 8)); // Penalize
      } else {
        setP2Streak(0);
        setTugPosition(prev => Math.max(0, prev - 8));
      }
    }

    setProblem(generateProblem());
  };

  const resetGame = () => {
    sounds.playClick();
    setProblem(generateProblem());
    setTugPosition(50);
    setActivePlayerTurn(1);
    setP1Score(0);
    setP2Score(0);
    setP1Streak(0);
    setP2Streak(0);
    setWinner(null);
    setTimerSeconds(60);
    setIsBotThinking(false);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>High-Speed Arithmetic Duel</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            Speed Math Duel 1v1
          </h2>
          <p className="text-xs text-zinc-500">
            Race to answer equations correctly. Every right answer pushes the tug-of-war bar toward your opponent!
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{timerSeconds}s</span>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
            <button
              onClick={() => { setMode('bot'); resetGame(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                mode === 'bot'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-500" />
              <span>vs AI Bot</span>
            </button>
            <button
              onClick={() => { setMode('2p'); resetGame(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                mode === '2p'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>2P Duel</span>
            </button>
          </div>

          <button
            onClick={resetGame}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            title="Reset Duel"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tug of War Bar */}
      <div className="space-y-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs font-bold font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>Player 1 (Score: {p1Score})</span>
            {p1Streak > 1 && <span className="text-[10px] text-amber-500">🔥{p1Streak}</span>}
          </span>
          <span className="text-zinc-400 font-sans text-[11px] font-normal">Tug-of-War Dominance</span>
          <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
            {p2Streak > 1 && <span className="text-[10px] text-amber-500">🔥{p2Streak}</span>}
            <span>{mode === 'bot' ? 'DeepMath Bot' : 'Player 2'} ({p2Score})</span>
          </span>
        </div>

        <div className="relative w-full h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex">
          <div
            style={{ width: `${100 - tugPosition}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
          />
          <div
            style={{ width: `${tugPosition}%` }}
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300"
          />
        </div>
      </div>

      {/* Active Question Arena */}
      <div className="text-center p-6 sm:p-8 rounded-2xl bg-zinc-950 text-white border border-zinc-800 space-y-5">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>Current Equation</span>
          <span className="text-zinc-600">·</span>
          <span className="text-amber-400 font-mono">
            {activePlayerTurn === 1 ? 'Player 1 Turn' : mode === 'bot' ? 'Bot Calculating...' : 'Player 2 Turn'}
          </span>
        </div>

        <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-wider text-amber-400 py-2">
          {problem.text} = ?
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
          {problem.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={!!winner || (mode === 'bot' && activePlayerTurn === 2)}
              onClick={() => handleAnswer(opt, activePlayerTurn)}
              className="py-4 px-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-500 hover:bg-zinc-800 font-mono text-xl font-bold text-white transition-all transform active:scale-95 shadow-md cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Winner Modal Banner */}
      {winner && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {winner === 1 ? 'Player 1 Wins the Speed Math Duel!' : mode === 'bot' ? 'DeepMath Bot Won the Match!' : 'Player 2 Wins!'}
              </h4>
              <p className="text-xs text-zinc-500">
                {winner === 1 ? '+400 XP awarded to your polymath rank' : 'Great calculation speed'}
              </p>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            Play Rematch
          </button>
        </div>
      )}

    </div>
  );
};
