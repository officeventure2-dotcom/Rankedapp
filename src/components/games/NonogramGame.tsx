import React, { useState, useEffect } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Grid,
  Paintbrush,
  X,
  ArrowRight,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface NonogramPuzzle {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  size: number;
  // 1 = filled, 0 = empty
  solution: number[][];
  rowClues: number[][];
  colClues: number[][];
  xp: number;
}

const PUZZLES: NonogramPuzzle[] = [
  {
    id: 'nono_heart',
    name: 'Polymath Heart',
    difficulty: 'Easy',
    size: 5,
    solution: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ],
    rowClues: [[1, 1], [5], [5], [3], [1]],
    colClues: [[2], [4], [4], [4], [2]],
    xp: 250
  },
  {
    id: 'nono_sword',
    name: 'Duelist Sword',
    difficulty: 'Easy',
    size: 5,
    solution: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ],
    rowClues: [[1], [1], [5], [1], [3]],
    colClues: [[1], [2], [5], [2], [1]],
    xp: 300
  },
  {
    id: 'nono_key',
    name: 'Cipher Key',
    difficulty: 'Medium',
    size: 6,
    solution: [
      [0, 1, 1, 0, 0, 0],
      [1, 0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1],
      [0, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 0]
    ],
    rowClues: [[2], [1, 1], [2], [4], [1, 1], [1]],
    colClues: [[1], [1, 1], [5], [1], [2], [1]],
    xp: 450
  }
];

export const NonogramGame: React.FC = () => {
  const { gainXp, showToast } = useRanked();

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const currentPuzzle = PUZZLES[puzzleIdx % PUZZLES.length];

  // 0 = empty, 1 = filled, -1 = marked X
  const [grid, setGrid] = useState<number[][]>(() =>
    Array.from({ length: currentPuzzle.size }, () => Array(currentPuzzle.size).fill(0))
  );
  const [tool, setTool] = useState<'fill' | 'x'>('fill');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setGrid(Array.from({ length: currentPuzzle.size }, () => Array(currentPuzzle.size).fill(0)));
    setIsCompleted(false);
  }, [puzzleIdx]);

  // Handle cell click
  const handleCellClick = (r: number, c: number) => {
    if (isCompleted) return;
    sounds.playClick();

    const newGrid = grid.map(row => [...row]);
    const currentVal = newGrid[r][c];

    if (tool === 'fill') {
      newGrid[r][c] = currentVal === 1 ? 0 : 1;
    } else {
      newGrid[r][c] = currentVal === -1 ? 0 : -1;
    }

    setGrid(newGrid);

    // Check if solution matches
    let matches = true;
    for (let row = 0; row < currentPuzzle.size; row++) {
      for (let col = 0; col < currentPuzzle.size; col++) {
        const expected = currentPuzzle.solution[row][col];
        const actual = newGrid[row][col] === 1 ? 1 : 0;
        if (expected !== actual) {
          matches = false;
          break;
        }
      }
      if (!matches) break;
    }

    if (matches) {
      setIsCompleted(true);
      sounds.playSuccess();
      sounds.playBadgeUnlock();
      gainXp(currentPuzzle.xp, 'iq', `Nonogram Decoded: ${currentPuzzle.name}`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      showToast(`Puzzle Decoded! ${currentPuzzle.name} completed! +${currentPuzzle.xp} XP`);
    }
  };

  const resetGrid = () => {
    sounds.playClick();
    setGrid(Array.from({ length: currentPuzzle.size }, () => Array(currentPuzzle.size).fill(0)));
    setIsCompleted(false);
  };

  const nextPuzzle = () => {
    sounds.playClick();
    setPuzzleIdx(prev => prev + 1);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Grid className="w-3.5 h-3.5" />
            <span>Spatial Deduction & Picross Matrix</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Nonogram: {currentPuzzle.name}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {currentPuzzle.difficulty} ({currentPuzzle.size}×{currentPuzzle.size})
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Deduce which cells to shade or mark based on the sequence numbers along the rows and columns.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Tool switch */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
            <button
              onClick={() => { sounds.playClick(); setTool('fill'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                tool === 'fill'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Fill Cell</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setTool('x'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                tool === 'x'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>Cross (X)</span>
            </button>
          </div>

          <button
            onClick={resetGrid}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            title="Reset Grid"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={nextPuzzle}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Next Puzzle
          </button>
        </div>
      </div>

      {/* The Nonogram Grid Container */}
      <div className="flex flex-col items-center justify-center p-4">
        <div className="inline-block bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
          
          {/* Column Clues Header */}
          <div className="flex justify-end mb-2">
            <div className="w-16 sm:w-20" /> {/* Spacer for row clues */}
            <div className="flex gap-1.5 sm:gap-2">
              {currentPuzzle.colClues.map((clues, cIdx) => (
                <div
                  key={cIdx}
                  className="w-10 sm:w-12 flex flex-col items-center justify-end text-[11px] font-mono font-bold text-indigo-400 pb-1"
                >
                  {clues.map((n, i) => (
                    <span key={i}>{n}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Grid Rows */}
          <div className="space-y-1.5 sm:space-y-2">
            {grid.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1.5 sm:gap-2">
                
                {/* Row Clue */}
                <div className="w-16 sm:w-20 text-right pr-2 text-[11px] font-mono font-bold text-amber-400 flex items-center justify-end gap-1.5">
                  {currentPuzzle.rowClues[rIdx].map((n, i) => (
                    <span key={i}>{n}</span>
                  ))}
                </div>

                {/* Cells */}
                {row.map((cellVal, cIdx) => (
                  <button
                    key={cIdx}
                    disabled={isCompleted}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg border flex items-center justify-center transition-all cursor-pointer font-bold ${
                      cellVal === 1
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : cellVal === -1
                        ? 'bg-zinc-900 border-zinc-700 text-rose-500'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-transparent'
                    }`}
                  >
                    {cellVal === -1 ? <X className="w-5 h-5" /> : null}
                  </button>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Pattern Recognized! {currentPuzzle.name} Solved!
              </h4>
              <p className="text-xs text-zinc-500">
                +{currentPuzzle.xp} XP awarded to your Cognitive Mastery rank.
              </p>
            </div>
          </div>

          <button
            onClick={nextPuzzle}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
          >
            <span>Next Nonogram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
