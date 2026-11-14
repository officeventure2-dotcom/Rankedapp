import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  ChessBoard,
  ChessPiece,
  ChessMove,
  createInitialBoard,
  getLegalMoves,
  formatMoveNotation,
  isKingInCheck,
  getBestBotMove,
  PieceColor,
  toAlgebraic
} from '../../utils/chessEngine';
import {
  Trophy,
  RotateCcw,
  Users,
  Bot,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Avatar } from '../Avatar';

const PIECE_SYMBOLS: Record<string, string> = {
  'w_k': '♔',
  'w_q': '♕',
  'w_r': '♖',
  'w_b': '♗',
  'w_n': '♘',
  'w_p': '♙',
  'b_k': '♚',
  'b_q': '♛',
  'b_r': '♜',
  'b_b': '♝',
  'b_n': '♞',
  'b_p': '♟'
};

export interface ChessGameProps {
  onExit?: () => void;
}

export const ChessGame: React.FC<ChessGameProps> = () => {
  const { user, gainXp, showToast } = useRanked();

  // Mode selection: 2 Players Pass & Play vs Ranked Bot Duel
  const [gameMode, setGameMode] = useState<'2p' | 'bot_marcus' | 'bot_elena'>('bot_marcus');
  const [board, setBoard] = useState<ChessBoard>(createInitialBoard);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [legalMoves, setLegalMoves] = useState<Array<{ row: number; col: number }>>([]);
  const [moveHistory, setMoveHistory] = useState<ChessMove[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<ChessPiece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<ChessPiece[]>([]);

  // Timers (5:00 blitz)
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<PieceColor | 'draw' | null>(null);
  const [isInCheck, setIsInCheck] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const timerRef = useRef<number | null>(null);

  const opponentInfo = {
    '2p': { name: 'Player 2 (Friend / Local)', level: 350, avatar: '👤' },
    'bot_marcus': { name: 'Dr. Marcus Vance (Grandmaster)', level: 989, avatar: '♟️' },
    'bot_elena': { name: 'Elena Rostova (Apex Competitor)', level: 742, avatar: '🏔️' }
  }[gameMode];

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    timerRef.current = window.setInterval(() => {
      if (turn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            handleGameOver('b', 'Black won on time!');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            handleGameOver('w', 'White won on time!');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [turn, isGameOver]);

  // Check state monitoring
  useEffect(() => {
    const check = isKingInCheck(board, turn);
    setIsInCheck(check);
  }, [board, turn]);

  // Bot Turn Trigger
  useEffect(() => {
    if (isGameOver || turn === 'w' || gameMode === '2p') return;

    setIsBotThinking(true);
    const thinkDelay = setTimeout(() => {
      const bestMove = getBestBotMove(board, 'b', gameMode === 'bot_marcus' ? 'grandmaster' : 'normal');
      if (bestMove) {
        executeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
      } else {
        handleGameOver('w', 'Checkmate! Black has no legal moves left.');
      }
      setIsBotThinking(false);
    }, 600);

    return () => clearTimeout(thinkDelay);
  }, [turn, isGameOver, gameMode]);

  const handleSquareClick = (row: number, col: number) => {
    if (isGameOver || isBotThinking) return;

    // In bot mode, human only controls White
    if (gameMode !== '2p' && turn === 'b') return;

    // If already selected, check if clicked square is a legal destination
    if (selectedSquare) {
      const isTarget = legalMoves.some(m => m.row === row && m.col === col);
      if (isTarget) {
        executeMove(selectedSquare.row, selectedSquare.col, row, col);
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    // Otherwise select piece of current turn's color
    const piece = board[row][col];
    if (piece && piece.color === turn) {
      setSelectedSquare({ row, col });
      const valid = getLegalMoves(board, row, col);
      setLegalMoves(valid);
      sounds.playClick();
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const movingPiece = board[fromRow][fromCol];
    if (!movingPiece) return;

    const targetSquare = board[toRow][toCol];
    const isCapture = !!targetSquare;

    // Track captured pieces
    if (targetSquare) {
      if (movingPiece.color === 'w') {
        setCapturedByWhite(prev => [...prev, targetSquare]);
      } else {
        setCapturedByBlack(prev => [...prev, targetSquare]);
      }
      sounds.playSuccess();
    } else {
      sounds.playClick();
    }

    // Pawn promotion (auto-promote to Queen for simplicity)
    let finalPiece = movingPiece;
    if (movingPiece.type === 'p') {
      if ((movingPiece.color === 'w' && toRow === 0) || (movingPiece.color === 'b' && toRow === 7)) {
        finalPiece = { type: 'q', color: movingPiece.color };
      }
    }

    // Update board
    const newBoard = board.map(r => [...r]);
    newBoard[fromRow][fromCol] = null;
    newBoard[toRow][toCol] = finalPiece;
    setBoard(newBoard);

    // Record move notation
    const notation = formatMoveNotation(movingPiece, fromRow, fromCol, toRow, toCol, isCapture);
    const newMove: ChessMove = {
      fromRow,
      fromCol,
      toRow,
      toCol,
      piece: movingPiece,
      captured: targetSquare,
      notation
    };
    setMoveHistory(prev => [...prev, newMove]);

    // Check for King capture / checkmate
    if (targetSquare?.type === 'k') {
      handleGameOver(movingPiece.color, `${movingPiece.color === 'w' ? 'White' : 'Black'} captured the King!`);
      return;
    }

    // Toggle turn
    setTurn(prev => (prev === 'w' ? 'b' : 'w'));
  };

  const handleGameOver = (winningColor: PieceColor | 'draw', reason: string) => {
    setIsGameOver(true);
    setWinner(winningColor);

    if (winningColor === 'w') {
      const xp = gameMode === 'bot_marcus' ? 5000 : 3500;
      sounds.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      gainXp(xp, 'iq', `Chess Victory against ${opponentInfo.name}`);
      showToast(`Chess Victory! +${xp.toLocaleString()} XP in Cognitive & IQ Mastery`);
    } else if (winningColor === 'b') {
      showToast(`${reason}`);
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setTurn('w');
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setWhiteTime(300);
    setBlackTime(300);
    setIsGameOver(false);
    setWinner(null);
    setIsInCheck(false);
    setIsBotThinking(false);
    sounds.playClick();
  };

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Mode Selector & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              Grandmaster Chess Duel
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Play 1v1 local two-player pass & play or challenge ranked grandmaster bots.
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => { setGameMode('bot_marcus'); resetGame(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              gameMode === 'bot_marcus'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            vs Marcus (Lvl 989)
          </button>
          <button
            onClick={() => { setGameMode('bot_elena'); resetGame(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              gameMode === 'bot_elena'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            vs Elena (Lvl 742)
          </button>
          <button
            onClick={() => { setGameMode('2p'); resetGame(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              gameMode === '2p'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            2 Players (Pass & Play)
          </button>
        </div>
      </div>

      {/* Main Board Arena Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 8x8 Chess Board (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Black Player Banner */}
          <div className="w-full max-w-[540px] px-4 py-2.5 rounded-t-2xl border border-b-0 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar src={opponentInfo.avatar} name={opponentInfo.name} className="w-8 h-8 rounded-md object-cover border border-zinc-300 dark:border-zinc-700" />
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {opponentInfo.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <span>Level {opponentInfo.level}</span>
                  <span>·</span>
                  <span>Black Pieces (♚)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Captured piece tray */}
              <div className="flex items-center text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                {capturedByBlack.map((p, i) => (
                  <span key={i}>{PIECE_SYMBOLS[`${p.color}_${p.type}`]}</span>
                ))}
              </div>
              <div className={`flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-md ${
                turn === 'b' ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/40' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{formatClock(blackTime)}</span>
              </div>
            </div>
          </div>

          {/* 8x8 Board Container */}
          <div className="relative border-4 border-zinc-800 dark:border-zinc-700 rounded-none shadow-2xl bg-zinc-900 select-none">
            {board.map((rowArr, r) => (
              <div key={r} className="flex">
                {rowArr.map((cell, c) => {
                  const isLight = (r + c) % 2 === 0;
                  const isSelected = selectedSquare?.row === r && selectedSquare?.col === c;
                  const isLegalTarget = legalMoves.some(m => m.row === r && m.col === c);

                  return (
                    <button
                      key={c}
                      onClick={() => handleSquareClick(r, c)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center relative font-serif text-3xl sm:text-4xl transition-colors focus:outline-none ${
                        isLight
                          ? 'bg-[#e8ebef] dark:bg-[#d1d5db] text-zinc-900'
                          : 'bg-[#6b7280] dark:bg-[#4b5563] text-zinc-950'
                      } ${isSelected ? 'ring-4 ring-amber-400 z-10' : ''}`}
                    >
                      {/* Board coordinate rank & file labels */}
                      {c === 0 && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-mono font-bold opacity-40">
                          {8 - r}
                        </span>
                      )}
                      {r === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold opacity-40">
                          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][c]}
                        </span>
                      )}

                      {/* Piece Icon */}
                      {cell && (
                        <span className={`drop-shadow-sm transform hover:scale-110 transition-transform ${
                          cell.color === 'w' ? 'text-zinc-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-zinc-950'
                        }`}>
                          {PIECE_SYMBOLS[`${cell.color}_${cell.type}`]}
                        </span>
                      )}

                      {/* Legal move highlight dot or capture ring */}
                      {isLegalTarget && (
                        <span className={`absolute rounded-full pointer-events-none ${
                          cell
                            ? 'w-12 h-12 border-4 border-amber-400/80 animate-pulse'
                            : 'w-4 h-4 bg-amber-400/70 shadow-sm'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* White Player Banner */}
          <div className="w-full max-w-[540px] px-4 py-2.5 rounded-b-2xl border border-t-0 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar src={user.avatar} name={user.name} className="w-7 h-7 rounded-md object-cover border border-amber-500" />
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {gameMode === '2p' ? 'Player 1 (White)' : `${user.name} (You)`}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <span>Level {user.level}</span>
                  <span>·</span>
                  <span>White Pieces (♔)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Captured piece tray */}
              <div className="flex items-center text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                {capturedByWhite.map((p, i) => (
                  <span key={i}>{PIECE_SYMBOLS[`${p.color}_${p.type}`]}</span>
                ))}
              </div>
              <div className={`flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-md ${
                turn === 'w' ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/40' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{formatClock(whiteTime)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Match Status, Live Move Log & Game Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Status Alert Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isInCheck
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200'
          }`}>
            <div className="flex items-center gap-2">
              {isInCheck ? <ShieldAlert className="w-5 h-5 text-rose-500" /> : <Crown className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-xs font-bold">
                  {isGameOver
                    ? 'Match Concluded'
                    : isInCheck
                    ? `Check! ${turn === 'w' ? 'White' : 'Black'} King Under Attack!`
                    : isBotThinking
                    ? `${opponentInfo.name} is calculating...`
                    : `Active Turn: ${turn === 'w' ? 'White' : 'Black'}`}
                </p>
                <p className="text-[11px] opacity-75">
                  {isGameOver ? 'Game finished' : `5:00 Blitz clock standard`}
                </p>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              title="Reset Board"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Move History Transcript */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h4 className="text-xs font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Algebraic Move Log ({moveHistory.length} moves)
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">Standard FIDE</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-xs pr-2 scrollbar-none">
              {moveHistory.length === 0 ? (
                <p className="text-xs text-zinc-400 italic text-center py-4">
                  Match ready. White to move (e.g. e4).
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {moveHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800/40"
                    >
                      <span className="text-zinc-400 text-[10px]">
                        {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                      </span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {m.notation}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Game Over Dialog */}
          {isGameOver && (
            <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-50/20 dark:bg-amber-950/30 text-center space-y-3 shadow-xl animate-in zoom-in-95">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                {winner === 'w' ? 'Victory for White!' : winner === 'b' ? 'Victory for Black!' : 'Game Drawn!'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                {winner === 'w'
                  ? `Spectacular tactical play! +${gameMode === 'bot_marcus' ? '5,000' : '3,500'} XP awarded to your Cognitive Pillar.`
                  : 'Well fought! Analyze your move log or challenge again.'}
              </p>
              <button
                onClick={resetGame}
                className="w-full py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                Play Rematch
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
