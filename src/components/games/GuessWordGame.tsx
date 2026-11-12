import React, { useState, useEffect, useCallback } from 'react';
import { useRanked } from '../../context/RankedContext';
import {
  Trophy,
  Users,
  Bot,
  RotateCcw,
  Sparkles,
  Award,
  HelpCircle,
  Delete,
  CheckCircle2,
  XCircle,
  Zap,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface SecretWordEntry {
  word: string;
  category: string;
  hint: string;
}

const SECRET_WORDS_BANK: SecretWordEntry[] = [
  { word: 'LOGIC', category: 'Philosophy', hint: 'The systematic principles of valid reasoning and deduction.' },
  { word: 'BRAIN', category: 'Neuroscience', hint: 'Organ housing 86 billion neurons and 100 trillion synapses.' },
  { word: 'QUANT', category: 'Physics', hint: 'Discrete packet or financial algorithmic mathematician.' },
  { word: 'PRIME', category: 'Mathematics', hint: 'An integer greater than 1 with exactly two positive divisors.' },
  { word: 'HELIX', category: 'Genetics', hint: 'The double-stranded spiral architectural shape of DNA.' },
  { word: 'ATOMS', category: 'Chemistry', hint: 'Basic units of chemical elements composed of protons, neutrons, electrons.' },
  { word: 'ORBIT', category: 'Astrophysics', hint: 'The gravitationally curved trajectory of an astronomical body.' },
  { word: 'VIRUS', category: 'Biology', hint: 'Submicroscopic infectious agent replicating only inside living cells.' },
  { word: 'GENES', category: 'Genetics', hint: 'Basic physical and functional units of heredity encoded in DNA.' },
  { word: 'SOLAR', category: 'Astronomy', hint: 'Relating to or determined by the energy of the Sun.' }
];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

export const GuessWordGame: React.FC = () => {
  const { user, gainXp, showToast } = useRanked();

  const [mode, setMode] = useState<'2p' | 'bot'>('bot');
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [currentSecret, setCurrentSecret] = useState<SecretWordEntry>(SECRET_WORDS_BANK[0]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [scoreP1, setScoreP1] = useState<number>(0);
  const [scoreP2, setScoreP2] = useState<number>(0);

  const MAX_ATTEMPTS = 6;
  const WORD_LENGTH = 5;

  const resetRound = useCallback((nextWordIndex?: number) => {
    const idx = nextWordIndex !== undefined ? nextWordIndex : Math.floor(Math.random() * SECRET_WORDS_BANK.length);
    setWordIndex(idx);
    setCurrentSecret(SECRET_WORDS_BANK[idx]);
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setHasWon(false);
    setShowHint(false);
  }, []);

  const handleKeyInput = useCallback((key: string) => {
    if (isGameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        showToast('Word must be 5 letters!');
        sounds.playClick();
        return;
      }

      sounds.playSuccess();
      const nextGuesses = [...guesses, currentGuess];
      setGuesses(nextGuesses);
      setCurrentGuess('');

      if (currentGuess === currentSecret.word) {
        // Victory!
        setHasWon(true);
        setIsGameOver(true);
        sounds.playLevelUp();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setScoreP1(prev => prev + 500);
        gainXp(750, 'trivia', `1v1 Guess The Word: ${currentSecret.word}`);
        showToast(`🎉 Correct Word: ${currentSecret.word}! +750 XP`);
      } else if (nextGuesses.length >= MAX_ATTEMPTS) {
        // Defeat
        setIsGameOver(true);
        setHasWon(false);
        setScoreP2(prev => prev + 300);
        showToast(`Out of attempts! The word was ${currentSecret.word}`);
      }
    } else if (key === 'BACK' || key === 'BACKSPACE') {
      sounds.playClick();
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < WORD_LENGTH) {
        sounds.playClick();
        setCurrentGuess(prev => prev + key);
      }
    }
  }, [currentGuess, currentSecret, guesses, isGameOver, gainXp, showToast]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        handleKeyInput('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyInput('BACK');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyInput]);

  // Color evaluation for a row
  const getLetterStatus = (letter: string, index: number, target: string) => {
    if (target[index] === letter) return 'correct'; // green
    if (target.includes(letter)) return 'present'; // yellow
    return 'absent'; // dark
  };

  // Keyboard key statuses
  const getKeyStatus = (key: string): 'correct' | 'present' | 'absent' | 'unused' => {
    let status: 'correct' | 'present' | 'absent' | 'unused' = 'unused';
    guesses.forEach(guess => {
      guess.split('').forEach((letter, i) => {
        if (letter === key) {
          if (currentSecret.word[i] === key) {
            status = 'correct';
          } else if (currentSecret.word.includes(key) && status !== 'correct') {
            status = 'present';
          } else if (status === 'unused') {
            status = 'absent';
          }
        }
      });
    });
    return status;
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Lexical Deduction Clash</span>
            <span>·</span>
            <span>Category: <strong className="text-purple-600 dark:text-purple-400">{currentSecret.category}</strong></span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="text-2xl">🔤</span>
            <span>Guess The Word (1v1 Clash)</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => { setMode('bot'); resetRound(); }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'bot'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>vs AI Master</span>
            </button>
            <button
              onClick={() => { setMode('2p'); resetRound(); }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === '2p'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2 Players (Pass & Play)</span>
            </button>
          </div>
          <button
            onClick={() => resetRound()}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
            title="Next Word"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clue Hint Strip */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
        <div className="flex items-center gap-2 text-xs">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          {showHint ? (
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{currentSecret.hint}</span>
          ) : (
            <span className="text-zinc-500">Need an intellectual clue? Click to reveal scientific definition.</span>
          )}
        </div>
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Reveal Hint
          </button>
        )}
      </div>

      {/* 5x6 Word Grid */}
      <div className="flex justify-center py-2">
        <div className="grid grid-rows-6 gap-2">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
            const guess = guesses[rowIndex];
            const isCurrentRow = rowIndex === guesses.length;

            return (
              <div key={rowIndex} className="flex gap-2">
                {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                  let letter = '';
                  let statusStyle = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100';

                  if (guess) {
                    letter = guess[colIndex] || '';
                    const status = getLetterStatus(letter, colIndex, currentSecret.word);
                    if (status === 'correct') {
                      statusStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                    } else if (status === 'present') {
                      statusStyle = 'bg-amber-500 text-white border-amber-500 font-bold';
                    } else {
                      statusStyle = 'bg-zinc-700 text-zinc-300 border-zinc-700 font-medium';
                    }
                  } else if (isCurrentRow) {
                    letter = currentGuess[colIndex] || '';
                    if (letter) {
                      statusStyle = 'border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 font-bold scale-105';
                    }
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center font-mono text-xl sm:text-2xl uppercase transition-all shadow-2xs ${statusStyle}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Keyboard */}
      <div className="space-y-1.5 max-w-lg mx-auto">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5">
            {row.map(key => {
              const status = getKeyStatus(key);
              let keyBg = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700';

              if (status === 'correct') {
                keyBg = 'bg-emerald-600 text-white font-bold';
              } else if (status === 'present') {
                keyBg = 'bg-amber-500 text-white font-bold';
              } else if (status === 'absent') {
                keyBg = 'bg-zinc-800 text-zinc-500 opacity-60';
              }

              const isWide = key === 'ENTER' || key === 'BACK';

              return (
                <button
                  key={key}
                  onClick={() => handleKeyInput(key)}
                  className={`h-12 rounded-lg text-xs font-mono font-bold transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center ${keyBg} ${
                    isWide ? 'px-3 sm:px-4 text-[10px]' : 'w-8 sm:w-10'
                  }`}
                >
                  {key === 'BACK' ? <Delete className="w-4 h-4" /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game Finished Summary */}
      {isGameOver && (
        <div className="p-6 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            {hasWon ? <Trophy className="w-6 h-6" /> : <XCircle className="w-6 h-6 text-rose-500" />}
          </div>
          <h3 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            {hasWon ? 'You Cracked the Scientific Word!' : `Word Was: ${currentSecret.word}`}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {currentSecret.hint}
          </p>
          <div className="pt-2">
            <button
              onClick={() => resetRound()}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Play Next Word →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
