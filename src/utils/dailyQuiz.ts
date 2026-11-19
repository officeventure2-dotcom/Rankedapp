import type { TriviaQuestion } from '../types';
import { rng } from './photoMemory';

export const QUIZ_SIZE = 5;
export const XP_PER_CORRECT = 150;
export const XP_STREAK_BONUS = 50; // per streak day, capped at 10 days

/** The same five general-knowledge questions for everyone on a given local date (YYYY-MM-DD). */
export function pickQuestions(bank: TriviaQuestion[], day: string): TriviaQuestion[] {
  const r = rng(parseInt(day.replace(/-/g, ''), 10));
  const pool = [...bank];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, QUIZ_SIZE);
}

export const quizXp = (score: number, streak: number) => score * XP_PER_CORRECT + Math.min(streak, 10) * XP_STREAK_BONUS;
