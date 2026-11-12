import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../../context/RankedContext';
import { TRIVIA_BANK } from '../../data/mockData';
import { Trophy, Zap, Users, Bot, RotateCcw, CheckCircle2, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

export const TriviaDuelGame: React.FC = () => {
  const { user, gainXp, showToast } = useRanked();

  const [mode, setMode] = useState<'2p' | 'bot'>('2p');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [buzzedPlayer, setBuzzedPlayer] = useState<'p1' | 'p2' | null>(null);
  const [roundTimer, setRoundTimer] = useState(8);
  const [isAnswerPhase, setIsAnswerPhase] = useState(false);
  const [answerTimer, setAnswerTimer] = useState(5);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [roundResult, setRoundResult] = useState<{
    winner: 'p1' | 'p2' | 'timeout' | null;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [isMatchOver, setIsMatchOver] = useState(false);

  const roundTimerRef = useRef<number | null>(null);
  const answerTimerRef = useRef<number | null>(null);

  const currentQ = TRIVIA_BANK[questionIndex % TRIVIA_BANK.length];
  const TOTAL_ROUNDS = 5;

  // Question buzz phase timer
  useEffect(() => {
    if (isMatchOver || buzzedPlayer || roundResult) return;

    roundTimerRef.current = window.setInterval(() => {
      setRoundTimer(prev => {
        if (prev <= 1) {
          handleBuzzTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    };
  }, [questionIndex, buzzedPlayer, roundResult, isMatchOver]);

  // Answer countdown after someone buzzes in
  useEffect(() => {
    if (!buzzedPlayer || roundResult || isMatchOver) return;

    answerTimerRef.current = window.setInterval(() => {
      setAnswerTimer(prev => {
        if (prev <= 1) {
          handleAnswerTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (answerTimerRef.current) clearInterval(answerTimerRef.current);
    };
  }, [buzzedPlayer, roundResult, isMatchOver]);

  // Bot auto-buzz logic
  useEffect(() => {
    if (mode !== 'bot' || buzzedPlayer || roundResult || isMatchOver) return;

    // Bot decides to buzz within 1.5 to 4 seconds
    const botReaction = 1500 + Math.random() * 2500;
    const botTimeout = window.setTimeout(() => {
      if (!buzzedPlayer && !roundResult) {
        handleBuzz('p2');
        // Bot answers after 1.2s
        window.setTimeout(() => {
          // 80% accuracy for Marcus Vance bot
          const willAnswerCorrect = Math.random() < 0.8;
          const choice = willAnswerCorrect
            ? currentQ.correctIndex
            : (currentQ.correctIndex + 1) % currentQ.options.length;
          submitAnswer(choice, 'p2');
        }, 1200);
      }
    }, botReaction);

    return () => clearTimeout(botTimeout);
  }, [questionIndex, buzzedPlayer, mode, roundResult, isMatchOver]);

  const handleBuzz = (player: 'p1' | 'p2') => {
    if (buzzedPlayer || roundResult) return;
    sounds.playClick();
    setBuzzedPlayer(player);
    setIsAnswerPhase(true);
    setAnswerTimer(6);
  };

  const handleBuzzTimeout = () => {
    setRoundResult({
      winner: 'timeout',
      isCorrect: false,
      explanation: `Time expired! The correct answer was: "${currentQ.options[currentQ.correctIndex]}"`
    });
  };

  const handleAnswerTimeout = () => {
    const penalized = buzzedPlayer;
    if (penalized === 'p1') {
      setP1Score(prev => Math.max(0, prev - 100));
    } else {
      setP2Score(prev => Math.max(0, prev - 100));
    }
    setRoundResult({
      winner: null,
      isCorrect: false,
      explanation: `${penalized === 'p1' ? 'Player 1' : 'Player 2'} timed out on the answer! -100 pts`
    });
  };

  const submitAnswer = (optionIdx: number, answeringPlayer: 'p1' | 'p2') => {
    if (roundResult) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      if (answeringPlayer === 'p1') {
        setP1Score(prev => prev + 250);
      } else {
        setP2Score(prev => prev + 250);
      }
      setRoundResult({
        winner: answeringPlayer,
        isCorrect: true,
        explanation: currentQ.explanation
      });
    } else {
      // Steal or penalty
      if (answeringPlayer === 'p1') {
        setP1Score(prev => Math.max(0, prev - 100));
      } else {
        setP2Score(prev => Math.max(0, prev - 100));
      }
      setRoundResult({
        winner: null,
        isCorrect: false,
        explanation: `Incorrect! ${currentQ.explanation}`
      });
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= TOTAL_ROUNDS) {
      setIsMatchOver(true);
      if (p1Score >= p2Score) {
        sounds.playLevelUp();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        gainXp(1200, 'trivia', '1v1 Trivia Duel Victory');
        showToast('🏆 1v1 Trivia Duel Victory! +1,200 XP');
      }
    } else {
      setQuestionIndex(prev => prev + 1);
      setBuzzedPlayer(null);
      setIsAnswerPhase(false);
      setSelectedOption(null);
      setRoundResult(null);
      setRoundTimer(8);
      setAnswerTimer(6);
    }
  };

  const restartMatch = () => {
    setQuestionIndex(0);
    setP1Score(0);
    setP2Score(0);
    setBuzzedPlayer(null);
    setIsAnswerPhase(false);
    setSelectedOption(null);
    setRoundResult(null);
    setRoundTimer(8);
    setAnswerTimer(6);
    setIsMatchOver(false);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Fast-Paced Knowledge Buzzer</span>
            <span>·</span>
            <span>Round {Math.min(questionIndex + 1, TOTAL_ROUNDS)} of {TOTAL_ROUNDS}</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>1v1 Trivia Duel</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => { setMode('2p'); restartMatch(); }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                mode === '2p'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2 Players (Pass & Play)</span>
            </button>
            <button
              onClick={() => { setMode('bot'); restartMatch(); }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
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
            onClick={restartMatch}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            title="Reset Match"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Duel Scoreboard */}
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          buzzedPlayer === 'p1'
            ? 'border-red-500 bg-red-500/10 shadow-md ring-2 ring-red-500/30'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user.name} (P1)
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
              Lvl {user.level}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {p1Score}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">points</span>
          </div>
          {buzzedPlayer === 'p1' && (
            <div className="mt-2 text-[11px] font-bold text-red-600 dark:text-red-400 animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>BUZZED IN · {answerTimer}s to answer</span>
            </div>
          )}
        </div>

        {/* Player 2 Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          buzzedPlayer === 'p2'
            ? 'border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/30'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {mode === '2p' ? 'Player 2 (Opponent)' : 'Dr. Marcus Vance (AI)'}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {mode === '2p' ? 'Lvl 340' : 'Lvl 989'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {p2Score}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">points</span>
          </div>
          {buzzedPlayer === 'p2' && (
            <div className="mt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>BUZZED IN · {answerTimer}s to answer</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Stage */}
      {!isMatchOver ? (
        <div className="space-y-6">
          
          {/* Question Box */}
          <div className="p-5 rounded-xl bg-zinc-950 text-white border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-wider font-semibold text-amber-400">
                {currentQ.category} · {currentQ.difficulty}
              </span>
              <span className="font-mono text-zinc-300">
                Buzz Window: <strong className="text-white">{roundTimer}s</strong>
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium text-zinc-100">
              {currentQ.question}
            </p>
          </div>

          {/* Buzzer Stage if nobody buzzed yet */}
          {!buzzedPlayer && !roundResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleBuzz('p1')}
                className="h-28 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-lg flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-7 h-7 fill-white" />
                <span>HIT BUZZER (P1)</span>
                <span className="text-xs font-normal opacity-80">Tap to lock in answer</span>
              </button>

              <button
                onClick={() => {
                  if (mode === '2p') handleBuzz('p2');
                }}
                disabled={mode === 'bot'}
                className={`h-28 rounded-2xl font-extrabold text-lg flex flex-col items-center justify-center gap-1.5 shadow-lg transition-all ${
                  mode === 'bot'
                    ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white active:scale-95 cursor-pointer'
                }`}
              >
                <Zap className="w-7 h-7 fill-current" />
                <span>{mode === 'bot' ? 'AI THINKING...' : 'HIT BUZZER (P2)'}</span>
                <span className="text-xs font-normal opacity-80">
                  {mode === 'bot' ? 'Marcus is evaluating question' : 'Tap to lock in answer'}
                </span>
              </button>
            </div>
          )}

          {/* Options Grid when a player has buzzed */}
          {buzzedPlayer && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span>
                  {buzzedPlayer === 'p1' ? 'Player 1' : mode === 'bot' ? 'AI' : 'Player 2'} has the floor!
                </span>
                <span className="font-mono text-amber-500 font-bold">{answerTimer}s remaining</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-400 text-zinc-900 dark:text-zinc-100';
                  if (roundResult) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={!!roundResult || (mode === 'bot' && buzzedPlayer === 'p2')}
                      onClick={() => submitAnswer(idx, buzzedPlayer)}
                      className={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {roundResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {roundResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Round Resolution Banner */}
          {roundResult && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center gap-2">
                {roundResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {roundResult.winner ? `${roundResult.winner === 'p1' ? 'Player 1' : 'Player 2'} scored +250 points!` : 'No points awarded'}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {roundResult.explanation}
              </p>
              <button
                onClick={nextQuestion}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                {questionIndex + 1 >= TOTAL_ROUNDS ? 'Finish Duel & View Results' : 'Next Question →'}
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Match Finished View */
        <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-extrabold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            {p1Score > p2Score
              ? `${user.name} Wins the Duel!`
              : p2Score > p1Score
              ? `${mode === 'bot' ? 'Marcus Vance' : 'Player 2'} Takes Victory!`
              : 'Stalemate! Tied Score!'}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Final Score: {p1Score} vs {p2Score} · 1v1 Competitive MMR Updated
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
            <Award className="w-4 h-4" />
            <span>+1,200 XP Awarded to Trivia Mastery Pillar</span>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={restartMatch}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              Play Rematch
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
