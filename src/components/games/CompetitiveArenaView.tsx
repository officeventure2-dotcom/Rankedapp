import React, { useState } from 'react';
import { useRanked } from '../../context/RankedContext';
import { ChessGame } from './ChessGame';
import { ConnectFourGame } from './ConnectFourGame';
import { SpeedMathDuelGame } from './SpeedMathDuelGame';
import { TriviaDuelGame } from './TriviaDuelGame';
import { SudokuGame } from './SudokuGame';
import { Game24 } from './Game24';
import { NonogramGame } from './NonogramGame';
import { MindMatrixGame } from './MindMatrixGame';
import { GuessWordGame } from './GuessWordGame';
import {
  Swords,
  Brain,
  Zap,
  Users,
  Bot,
  Trophy,
  Copy,
  Check,
  Share2,
  Sparkles,
  Flame,
  Shield,
  Play,
  Grid,
  Calculator,
  Target,
  Crown,
  CircleDot,
  Languages,
  Hash,
  Type
} from 'lucide-react';

export const CompetitiveArenaView: React.FC = () => {
  const { user, showToast, friends } = useRanked();

  // Primary mode separation: 1v1 Multiplayer vs Solo Mind Games
  const [arenaCategory, setArenaCategory] = useState<'multiplayer' | 'solo'>('multiplayer');

  // Active game states
  const [multiplayerGame, setMultiplayerGame] = useState<'chess' | 'connect4' | 'speed_math' | 'trivia_duel' | 'word_duel'>('chess');
  const [soloGame, setSoloGame] = useState<'game24' | 'sudoku' | 'nonogram' | 'mind_matrix' | 'guess_word'>('game24');

  // Lobby state
  const [roomCode, setRoomCode] = useState('RANKED-9421');
  const [copiedCode, setCopiedCode] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopiedCode(true);
    showToast('Multiplayer room code copied: ' + roomCode);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-500/30">
              <Swords className="w-3.5 h-3.5" />
              <span>Cognitive Arena & Intellect Duels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
              Mind Games & Intellectual Arenas
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Choose between competitive **1v1 Multiplayer Duels** (against friends or smart AI opponents) and dedicated **Solo Mind Puzzles** (arithmetic logic, Sudoku, Picross Nonograms, and cognitive matrices).
            </p>
          </div>

          {/* Elo Profile Indicator */}
          <div className="flex items-center gap-4 bg-zinc-800/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700/60 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Cognitive Arena Elo</div>
              <div className="text-xl font-extrabold font-mono text-white">
                1,885 <span className="text-xs font-normal text-amber-400 font-sans">GM Candidate</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-2 font-mono">
                <span className="text-emerald-400 font-bold">34W</span>
                <span>-</span>
                <span className="text-rose-400 font-bold">8L</span>
                <span>·</span>
                <span className="text-amber-300 font-bold flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-current" /> 5 Streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Multiplayer Lobby Room Quick Bar */}
        {arenaCategory === 'multiplayer' && (
          <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-medium">Multiplayer Room Code:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs font-bold text-amber-400">
                <span>{roomCode}</span>
                <button
                  onClick={copyRoomCode}
                  className="hover:text-white transition-colors"
                  title="Copy Room Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => {
                  const newCode = 'RANKED-' + Math.floor(1000 + Math.random() * 9000);
                  setRoomCode(newCode);
                  showToast('New room generated: ' + newCode);
                }}
                className="text-xs text-zinc-400 hover:text-white underline underline-offset-2"
              >
                Generate New
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(`Invited ${friends[0]?.name || 'Elena'} to room ${roomCode}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Invite Friend from Chat</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRIMARY CATEGORY SELECTION: MULTIPLAYER VS SOLO */}
      <div className="p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 flex items-center gap-2">
        <button
          onClick={() => setArenaCategory('multiplayer')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
            arenaCategory === 'multiplayer'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-md border border-zinc-200/60 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Swords className="w-4 h-4 text-amber-500" />
          <span>1v1 & Multiplayer Arena (5 Games)</span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Pass & Play · vs AI Bot
          </span>
        </button>

        <button
          onClick={() => setArenaCategory('solo')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
            arenaCategory === 'solo'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-md border border-zinc-200/60 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Brain className="w-4 h-4 text-indigo-500" />
          <span>Solo Mind & Puzzle Lab (5 Games)</span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Cognitive Logic · Daily Streaks
          </span>
        </button>
      </div>

      {/* SECTION 1: 1V1 MULTIPLAYER GAMES SELECTOR */}
      {arenaCategory === 'multiplayer' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Select 1v1 Multiplayer Game:
            </span>
            <span>Choose a challenge to start a local duel or match against AI</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* 1. Chess Blitz */}
            <button
              onClick={() => setMultiplayerGame('chess')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                multiplayerGame === 'chess'
                  ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400"><Crown className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    Pass & Play
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Chess Blitz 1v1
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  5:00 blitz chess clocks, captures, move history & GM Bot duels.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Play Chess</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 2. Connect 4 (NEW) */}
            <button
              onClick={() => setMultiplayerGame('connect4')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                multiplayerGame === 'connect4'
                  ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 ring-2 ring-rose-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400"><CircleDot className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                    NEW 1v1
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Connect 4 Tactics
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  7x6 gravity grid drop duel. Connect 4 discs vertically, horizontally or diagonally.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span>Play Connect 4</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 3. Speed Math Duel (NEW) */}
            <button
              onClick={() => setMultiplayerGame('speed_math')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                multiplayerGame === 'speed_math'
                  ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400"><Zap className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                    NEW 1v1
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Speed Math Duel
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Fast arithmetic tug-of-war. Answer faster to push the dominance meter and win!
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Play Math Duel</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 4. Trivia Duel */}
            <button
              onClick={() => setMultiplayerGame('trivia_duel')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                multiplayerGame === 'trivia_duel'
                  ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20 ring-2 ring-red-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"><Target className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    Live Buzzer
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Trivia Duel
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Fast buzzer lockout knowledge race with steals and cross-pillar categories.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <span>Play Trivia Duel</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 5. Guess The Word Duel */}
            <button
              onClick={() => setMultiplayerGame('word_duel')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                multiplayerGame === 'word_duel'
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400"><Languages className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    Wordle Duel
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Guess The Word Duel
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Turn-based scientific 5-letter word deduction with colored tiles.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Play Word Duel</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

          </div>

          {/* Active 1v1 Multiplayer Game Component */}
          <div className="pt-2">
            {multiplayerGame === 'chess' && <ChessGame />}
            {multiplayerGame === 'connect4' && <ConnectFourGame />}
            {multiplayerGame === 'speed_math' && <SpeedMathDuelGame />}
            {multiplayerGame === 'trivia_duel' && <TriviaDuelGame />}
            {multiplayerGame === 'word_duel' && <GuessWordGame />}
          </div>
        </div>
      )}

      {/* SECTION 2: SOLO MIND & PUZZLE LAB */}
      {arenaCategory === 'solo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Select Solo Mind Puzzle & Cognitive Challenge:
            </span>
            <span>Focus exercises for mathematical agility, spatial reasoning & deduction</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* 1. The 24 Challenge (NEW) */}
            <button
              onClick={() => setSoloGame('game24')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                soloGame === 'game24'
                  ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"><Calculator className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                    NEW SOLO
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  The 24 Challenge
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Use 4 numbers and arithmetic operators (+, −, ×, ÷) to equal exactly 24.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Play 24 Challenge</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 2. Sudoku Master */}
            <button
              onClick={() => setSoloGame('sudoku')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                soloGame === 'sudoku'
                  ? 'border-cyan-500 bg-cyan-50/20 dark:bg-cyan-950/20 ring-2 ring-cyan-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400"><Hash className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    Solo / 9x9
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Sudoku Master
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  9x9 logic grid with pencil notes, strike counters, and timer challenges.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>Play Sudoku</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 3. Nonogram Picross (NEW) */}
            <button
              onClick={() => setSoloGame('nonogram')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                soloGame === 'nonogram'
                  ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400"><Grid className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold">
                    NEW SOLO
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Nonogram Picross
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Deductive picture logic grid. Reveal patterns using numerical clues along rows & columns.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Play Nonogram</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 4. Mind Matrix */}
            <button
              onClick={() => setSoloGame('mind_matrix')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                soloGame === 'mind_matrix'
                  ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-purple-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"><Brain className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    Matrices
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Mind Matrix
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Arithmetic sequences, geometric progressions, and spatial matrix reasoning.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span>Play Matrix</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

            {/* 5. Guess The Word (Solo) */}
            <button
              onClick={() => setSoloGame('guess_word')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                soloGame === 'guess_word'
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/30 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400"><Type className="w-6 h-6" /></span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    Solo Wordle
                  </span>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                  Wordle Deduction
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  Solve daily scientific and polymath 5-letter vocabulary words in 6 guesses.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Play Wordle</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </button>

          </div>

          {/* Active Solo Mind Game Component */}
          <div className="pt-2">
            {soloGame === 'game24' && <Game24 />}
            {soloGame === 'sudoku' && <SudokuGame />}
            {soloGame === 'nonogram' && <NonogramGame />}
            {soloGame === 'mind_matrix' && <MindMatrixGame />}
            {soloGame === 'guess_word' && <GuessWordGame />}
          </div>
        </div>
      )}

    </div>
  );
};
