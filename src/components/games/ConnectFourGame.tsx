import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Trophy,
  Users,
  Bot,
  RotateCcw,
  Sparkles,
  Award,
  Flame,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

const ROWS = 6;
const COLS = 7;

type Player = 1 | 2; // 1 = Red, 2 = Amber/Yellow
type BoardState = (Player | null)[][];

export const ConnectFourGame: React.FC = () => {
  const { gainXp, showToast } = useRanked();

  const [mode, setMode] = useState<'2p' | 'bot'>('bot');
  const [board, setBoard] = useState<BoardState>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Check 4 in a row
  const checkWin = (b: BoardState): { winner: Player | 'draw' | null; cells: [number, number][] } => {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const p = b[r][c];
        if (p && p === b[r][c + 1] && p === b[r][c + 2] && p === b[r][c + 3]) {
          return { winner: p, cells: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
        }
      }
    }

    // Vertical
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r <= ROWS - 4; r++) {
        const p = b[r][c];
        if (p && p === b[r + 1][c] && p === b[r + 2][c] && p === b[r + 3][c]) {
          return { winner: p, cells: [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]] };
        }
      }
    }

    // Diagonal down-right (\)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const p = b[r][c];
        if (p && p === b[r + 1][c + 1] && p === b[r + 2][c + 2] && p === b[r + 3][c + 3]) {
          return { winner: p, cells: [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]] };
        }
      }
    }

    // Diagonal up-right (/)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const p = b[r][c];
        if (p && p === b[r - 1][c + 1] && p === b[r - 2][c + 2] && p === b[r - 3][c + 3]) {
          return { winner: p, cells: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]] };
        }
      }
    }

    // Check draw
    const isFull = b[0].every(cell => cell !== null);
    if (isFull) {
      return { winner: 'draw', cells: [] };
    }

    return { winner: null, cells: [] };
  };

  // Drop token into column
  const dropToken = (col: number) => {
    if (winner || isBotThinking) return;

    // Find lowest open row
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) return; // Column full

    sounds.playClick();

    const newBoard = board.map(row => [...row]);
    newBoard[targetRow][col] = currentPlayer;
    setBoard(newBoard);

    const result = checkWin(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningCells(result.cells);
      if (result.winner === 1) {
        sounds.playSuccess();
        sounds.playBadgeUnlock();
        setP1Wins(prev => prev + 1);
        gainXp(450, 'iq', 'Connect 4 Tactical Victory');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        showToast('Player 1 (Crimson) achieved Connect 4 Victory! +450 XP');
      } else if (result.winner === 2) {
        sounds.playSuccess();
        setP2Wins(prev => prev + 1);
        if (mode === '2p') {
          showToast('Player 2 (Amber) achieved Connect 4 Victory!');
        } else {
          showToast('AI Bot connected 4 discs!');
        }
      } else {
        showToast('Draw Game! The board is full.');
      }
      return;
    }

    // Switch turns
    const nextPlayer: Player = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);

    // Trigger AI move if bot mode and it's player 2's turn
    if (mode === 'bot' && nextPlayer === 2) {
      setIsBotThinking(true);
      setTimeout(() => {
        makeBotMove(newBoard);
      }, 500);
    }
  };

  // AI Logic
  const makeBotMove = (currentBoard: BoardState) => {
    // 1. Check if bot can win in 1 move
    for (let c = 0; c < COLS; c++) {
      let r = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (currentBoard[row][c] === null) { r = row; break; }
      }
      if (r !== -1) {
        const testBoard = currentBoard.map(row => [...row]);
        testBoard[r][c] = 2;
        if (checkWin(testBoard).winner === 2) {
          executeMove(c, 2, currentBoard);
          return;
        }
      }
    }

    // 2. Block player 1 from winning
    for (let c = 0; c < COLS; c++) {
      let r = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (currentBoard[row][c] === null) { r = row; break; }
      }
      if (r !== -1) {
        const testBoard = currentBoard.map(row => [...row]);
        testBoard[r][c] = 1;
        if (checkWin(testBoard).winner === 1) {
          executeMove(c, 2, currentBoard);
          return;
        }
      }
    }

    // 3. Prefer center column (col 3), then adjacent (cols 2, 4)
    const columnOrder = [3, 2, 4, 1, 5, 0, 6];
    for (const c of columnOrder) {
      if (currentBoard[0][c] === null) {
        executeMove(c, 2, currentBoard);
        return;
      }
    }

    setIsBotThinking(false);
  };

  const executeMove = (col: number, player: Player, currentBoard: BoardState) => {
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (currentBoard[r][col] === null) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) {
      setIsBotThinking(false);
      return;
    }

    sounds.playClick();
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[targetRow][col] = player;
    setBoard(newBoard);
    setIsBotThinking(false);

    const result = checkWin(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningCells(result.cells);
      if (result.winner === 2) {
        sounds.playError();
        setP2Wins(prev => prev + 1);
        showToast('AI Bot won this round!');
      } else if (result.winner === 'draw') {
        showToast('Draw Game!');
      }
    } else {
      setCurrentPlayer(1);
    }
  };

  const resetGame = () => {
    sounds.playClick();
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setIsBotThinking(false);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Gravity Strategy 1v1 Arena</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            Connect 4 Tactical Grid
          </h2>
          <p className="text-xs text-zinc-500">
            Connect four of your discs in a row vertically, horizontally, or diagonally while blocking opponent traps.
          </p>
        </div>

        {/* Mode Toggle & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
            <button
              onClick={() => { setMode('bot'); resetGame(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                mode === 'bot'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-rose-500" />
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
              <span>Pass & Play</span>
            </button>
          </div>

          <button
            onClick={resetGame}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            title="Reset Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Players Status & Score Strip */}
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 (Red) */}
        <div className={`p-4 rounded-xl border transition-all ${
          currentPlayer === 1 && !winner
            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500 shadow-sm inline-block" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Player 1 (Crimson)
              </span>
            </div>
            <span className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">
              {p1Wins} W
            </span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{currentPlayer === 1 && !winner ? '👉 Your Turn' : 'Waiting...'}</span>
            <span className="font-mono text-zinc-400">+450 XP per win</span>
          </div>
        </div>

        {/* Player 2 (Amber / Bot) */}
        <div className={`p-4 rounded-xl border transition-all ${
          currentPlayer === 2 && !winner
            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-500 shadow-sm inline-block" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {mode === 'bot' ? 'DeepConnect AI Bot' : 'Player 2 (Amber)'}
              </span>
            </div>
            <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">
              {p2Wins} W
            </span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>
              {isBotThinking
                ? '🤖 AI is calculating...'
                : currentPlayer === 2 && !winner
                ? '👉 Turn in progress'
                : 'Waiting...'}
            </span>
            <span className="font-mono text-zinc-400">{mode === 'bot' ? 'Level: Tactical' : 'Local 2P'}</span>
          </div>
        </div>
      </div>

      {/* The 7x6 Board */}
      <div className="flex flex-col items-center">
        
        {/* Column Drop Indicator Arrow */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 w-full max-w-md pb-2 px-3">
          {Array.from({ length: COLS }).map((_, col) => {
            const isFull = board[0][col] !== null;
            const isHover = hoveredCol === col;
            return (
              <button
                key={col}
                disabled={isFull || !!winner || isBotThinking}
                onClick={() => dropToken(col)}
                onMouseEnter={() => setHoveredCol(col)}
                onMouseLeave={() => setHoveredCol(null)}
                className={`h-8 rounded-lg flex items-center justify-center transition-all ${
                  isHover && !isFull && !winner
                    ? currentPlayer === 1
                      ? 'bg-rose-500/20 text-rose-500'
                      : 'bg-amber-500/20 text-amber-500'
                    : 'text-transparent hover:text-zinc-400'
                }`}
              >
                ▼
              </button>
            );
          })}
        </div>

        {/* Board Frame */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950 dark:bg-zinc-950 border-4 border-indigo-900 dark:border-zinc-800 shadow-2xl w-full max-w-md">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {board.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isWinningCell = winningCells.some(([wr, wc]) => wr === rIdx && wc === cIdx);

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    disabled={!!winner || isBotThinking}
                    onClick={() => dropToken(cIdx)}
                    onMouseEnter={() => setHoveredCol(cIdx)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className="aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer relative bg-indigo-900/60 dark:bg-zinc-900 p-1"
                  >
                    {cell === 1 && (
                      <div
                        className={`w-full h-full rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 shadow-inner transition-all transform animate-in zoom-in-50 duration-200 ${
                          isWinningCell ? 'ring-4 ring-white animate-pulse' : ''
                        }`}
                      />
                    )}

                    {cell === 2 && (
                      <div
                        className={`w-full h-full rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-inner transition-all transform animate-in zoom-in-50 duration-200 ${
                          isWinningCell ? 'ring-4 ring-white animate-pulse' : ''
                        }`}
                      />
                    )}

                    {cell === null && hoveredCol === cIdx && !winner && (
                      <div
                        className={`w-full h-full rounded-full opacity-20 transition-all ${
                          currentPlayer === 1 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Game Over Banner */}
      {winner && (
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {winner === 1
                  ? '🎉 Player 1 (Crimson) Connected 4!'
                  : winner === 2
                  ? mode === 'bot'
                    ? '🤖 DeepConnect AI Bot Won!'
                    : '🎉 Player 2 (Amber) Connected 4!'
                  : '🤝 Match Drawn!'}
              </h4>
              <p className="text-xs text-zinc-500">
                {winner === 1 ? '+450 XP awarded to your polymath rank' : 'Great tactical battle'}
              </p>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm self-start sm:self-auto"
          >
            Play Rematch
          </button>
        </div>
      )}

    </div>
  );
};
