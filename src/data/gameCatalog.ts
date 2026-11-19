import {
  Brain,
  Calculator,
  CircleDot,
  Crown,
  Grid,
  Hash,
  Eye,
  Rows3,
  Languages,
  Target,
  Type,
  Zap,
  type LucideIcon
} from 'lucide-react';
import type { ArenaGameId } from '../types';

export interface ArenaGameInfo {
  id: ArenaGameId;
  title: string;
  /** Which side of the Arena the game lives on. */
  mode: 'multiplayer' | 'solo';
  icon: LucideIcon;
  /** Tinted icon-tile colours (static strings so Tailwind keeps them). */
  tile: string;
}

/**
 * Every Arena game with its icon. The icons and colours match the game tiles
 * inside the Arena, so a game looks the same on Home and in the Arena.
 */
export const ARENA_GAMES: ArenaGameInfo[] = [
  { id: 'chess', title: 'Chess Blitz', mode: 'multiplayer', icon: Crown, tile: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { id: 'connect4', title: 'Connect 4', mode: 'multiplayer', icon: CircleDot, tile: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
  { id: 'speed_math', title: 'Speed Math Duel', mode: 'multiplayer', icon: Zap, tile: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { id: 'trivia_duel', title: 'Trivia Duel', mode: 'multiplayer', icon: Target, tile: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  { id: 'word_duel', title: 'Word Duel', mode: 'multiplayer', icon: Languages, tile: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' },
  { id: 'game24', title: 'The 24 Challenge', mode: 'solo', icon: Calculator, tile: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
  { id: 'sudoku', title: 'Sudoku Master', mode: 'solo', icon: Hash, tile: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  { id: 'nonogram', title: 'Nonogram Picross', mode: 'solo', icon: Grid, tile: 'bg-teal-500/15 text-teal-600 dark:text-teal-400' },
  { id: 'mind_matrix', title: 'Mind Matrix', mode: 'solo', icon: Brain, tile: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
  { id: 'guess_word', title: 'Wordle Deduction', mode: 'solo', icon: Type, tile: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400' },
  { id: 'logic_rows', title: 'Logic Rows', mode: 'solo', icon: Rows3, tile: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  { id: 'gut_check', title: 'Gut Check', mode: 'solo', icon: Eye, tile: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' }
];

export function getArenaGame(id: ArenaGameId): ArenaGameInfo | undefined {
  return ARENA_GAMES.find((game) => game.id === id);
}
