import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Trophy,
  Users,
  Bot,
  RotateCcw,
  Sparkles,
  Award,
  Eraser,
  Pencil,
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

// Pre-generated balanced 9x9 Sudoku puzzle
const INITIAL_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const SOLUTION_PUZZLE = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

export const SudokuGame: React.FC = () => {
  const { user, gainXp, showToast } = useRanked();

  const [mode, setMode] = useState<'2p' | 'bot'>('2p');
  const [grid, setGrid] = useState<number[][]>(() => INITIAL_PUZZLE.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 2 });
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [p1Mistakes, setP1Mistakes] = useState<number>(0);
  const [p2Mistakes, setP2Mistakes] = useState<number>(0);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min blitz
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  // Blitz countdown
  useEffect(() => {
    if (isGameOver) return;
    timerRef.current = window.setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver]);

  // AI bot move simulation
  useEffect(() => {
    if (mode !== 'bot' || turn !== 'p2' || isGameOver) return;

    const timeout = window.setTimeout(() => {
      // Find empty cell
      const emptyCells: Array<{ r: number; c: number }> = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (grid[r][c] === 0) {
            emptyCells.push({ r, c });
          }
        }
      }

      if (emptyCells.length > 0) {
        // Pick one and fill correctly
        const chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const correctVal = SOLUTION_PUZZLE[chosen.r][chosen.c];

        setGrid(prev => {
          const next = prev.map(row => [...row]);
          next[chosen.r][chosen.c] = correctVal;
          return next;
        });

        sounds.playClick();
        setP2Score(prev => prev + 100);
        setTurn('p1');

        // Check if full
        checkGridCompletion();
      }
    }, 1600);

    return () => clearTimeout(timeout);
  }, [turn, mode, grid, isGameOver]);

  const handleTimeExpire = () => {
    setIsGameOver(true);
    if (p1Score >= p2Score) {
      setGameResult('Time expired! Player 1 wins by score!');
    } else {
      setGameResult('Time expired! Player 2 / Bot wins by score!');
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isGameOver) return;
    sounds.playClick();
    setSelectedCell({ row: r, col: c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isGameOver) return;
    const { row, col } = selectedCell;

    // Disallow overwriting initial clues
    if (INITIAL_PUZZLE[row][col] !== 0) {
      showToast('Cannot change original puzzle clue!');
      return;
    }

    const isCorrect = num === SOLUTION_PUZZLE[row][col];
    if (isCorrect) {
      sounds.playSuccess();
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = num;
        return next;
      });

      if (turn === 'p1') {
        setP1Score(prev => prev + 100);
        setTurn(mode === '2p' ? 'p2' : 'p2');
      } else {
        setP2Score(prev => prev + 100);
        setTurn('p1');
      }

      checkGridCompletion();
    } else {
      sounds.playClick();
      // Penalty for mistake
      if (turn === 'p1') {
        const nextMistakes = p1Mistakes + 1;
        setP1Mistakes(nextMistakes);
        if (nextMistakes >= 3) {
          setIsGameOver(true);
          setGameResult(`${user.name} incurred 3 mistakes! Player 2 Wins!`);
          return;
        }
        showToast(`Mistake! Strike ${nextMistakes}/3 (-50 pts)`);
        setP1Score(prev => Math.max(0, prev - 50));
        setTurn(mode === '2p' ? 'p2' : 'p2');
      } else {
        const nextMistakes = p2Mistakes + 1;
        setP2Mistakes(nextMistakes);
        if (nextMistakes >= 3) {
          setIsGameOver(true);
          setGameResult(`Opponent incurred 3 mistakes! ${user.name} Wins!`);
          return;
        }
        setP2Score(prev => Math.max(0, prev - 50));
        setTurn('p1');
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || isGameOver) return;
    const { row, col } = selectedCell;
    if (INITIAL_PUZZLE[row][col] !== 0) return;

    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = 0;
      return next;
    });
  };

  const checkGridCompletion = () => {
    let completed = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          completed = false;
          break;
        }
      }
    }

    if (completed) {
      setIsGameOver(true);
      sounds.playLevelUp();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      const winnerName = p1Score >= p2Score ? user.name : mode === 'bot' ? 'Marcus Vance' : 'Player 2';
      setGameResult(`Puzzle solved! ${winnerName} Wins the Sudoku Clash!`);
      gainXp(850, 'iq', '1v1 Sudoku Clash Victory');
    }
  };

  const resetGame = () => {
    setGrid(INITIAL_PUZZLE.map(row => [...row]));
    setSelectedCell({ row: 0, col: 2 });
    setTurn('p1');
    setP1Score(0);
    setP2Score(0);
    setP1Mistakes(0);
    setP2Mistakes(0);
    setTimerSeconds(300);
    setIsGameOver(false);
    setGameResult(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Competitive Logic & Deduction</span>
            <span>·</span>
            <span>Blitz Clock: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{formatTime(timerSeconds)}</strong></span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <span>1v1 Sudoku Clash</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => { setMode('2p'); resetGame(); }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === '2p'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2 Players (Pass & Play)</span>
            </button>
            <button
              onClick={() => { setMode('bot'); resetGame(); }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'bot'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>vs AI Master</span>
            </button>
          </div>
          <button
            onClick={resetGame}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score & Turn Banner */}
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          turn === 'p1' && !isGameOver
            ? 'border-amber-500 bg-amber-500/10 shadow-sm ring-2 ring-amber-500/30'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {user.name} (P1)
            </span>
            <span className="font-mono text-[11px] text-rose-500 font-bold">
              Strikes: {p1Mistakes}/3
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {p1Score}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">pts</span>
          </div>
          {turn === 'p1' && !isGameOver && (
            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1 uppercase tracking-wider animate-pulse">
              Your Turn to Place Number
            </div>
          )}
        </div>

        {/* Player 2 Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          turn === 'p2' && !isGameOver
            ? 'border-blue-500 bg-blue-500/10 shadow-sm ring-2 ring-blue-500/30'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {mode === '2p' ? 'Player 2 (Opponent)' : 'Dr. Marcus Vance (AI)'}
            </span>
            <span className="font-mono text-[11px] text-rose-500 font-bold">
              Strikes: {p2Mistakes}/3
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {p2Score}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">pts</span>
          </div>
          {turn === 'p2' && !isGameOver && (
            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider animate-pulse">
              {mode === '2p' ? 'Player 2 Turn' : 'Marcus Vance Evaluating...'}
            </div>
          )}
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* 9x9 Sudoku Board */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900 dark:bg-zinc-950 border-2 border-zinc-700 shadow-xl inline-block">
          <div className="grid grid-cols-9 gap-1 max-w-[360px] sm:max-w-[420px]">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                const isSameRowCol = selectedCell?.row === r || selectedCell?.col === c;
                const isClue = INITIAL_PUZZLE[r][c] !== 0;

                // Border logic for 3x3 box borders
                const borderR = (c + 1) % 3 === 0 && c !== 8 ? 'mr-1 sm:mr-1.5' : '';
                const borderB = (r + 1) % 3 === 0 && r !== 8 ? 'mb-1 sm:mb-1.5' : '';

                let cellColor = 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700';
                if (isClue) {
                  cellColor = 'bg-zinc-800/90 text-amber-400 font-bold';
                }
                if (isSameRowCol && !isSelected) {
                  cellColor = isClue ? 'bg-zinc-700/80 text-amber-300' : 'bg-zinc-750 text-white';
                }
                if (isSelected) {
                  cellColor = 'bg-amber-500 text-zinc-950 font-extrabold ring-2 ring-white scale-105 z-10';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-sm sm:text-base font-mono transition-all cursor-pointer ${cellColor} ${borderR} ${borderB}`}
                  >
                    {val !== 0 ? val : ''}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Controls & Numpad */}
        <div className="space-y-4 max-w-xs w-full">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Numpad Input</span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {selectedCell ? `Selected: R${selectedCell.row + 1} C${selectedCell.col + 1}` : 'Select a cell'}
              </span>
            </div>

            {/* 1 - 9 Numpad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  disabled={isGameOver || (mode === 'bot' && turn === 'p2')}
                  onClick={() => handleNumberInput(num)}
                  className="h-11 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-400 text-zinc-900 dark:text-zinc-100 font-mono text-base font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleErase}
                disabled={isGameOver}
                className="flex-1 py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Erase</span>
              </button>
              <button
                onClick={() => setPencilMode(prev => !prev)}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  pencilMode
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Pencil {pencilMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Quick tips */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Deduction Rules:</p>
            <p>Every row, column, and 3x3 subgrid must contain digits 1 through 9 exactly once.</p>
          </div>
        </div>

      </div>

      {/* Game Over Banner */}
      {isGameOver && (
        <div className="p-6 text-center rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            {gameResult}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Final Score: {p1Score} vs {p2Score} · Verified Cognitive ELO Points Awarded
          </p>
          <button
            onClick={resetGame}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Play Rematch
          </button>
        </div>
      )}

    </div>
  );
};
