import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { BookCatalogItem } from '../data/bookCatalogData';
import { BookOpen, CheckCircle2, XCircle, Award, Sparkles, X, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface BookVerificationQuizModalProps {
  book: BookCatalogItem | null;
  onClose: () => void;
  onSuccess: (book: BookCatalogItem) => void;
}

export const BookVerificationQuizModal: React.FC<BookVerificationQuizModalProps> = ({
  book,
  onClose,
  onSuccess
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  if (!book) return null;

  const questions = book.verificationQuestions;
  const currentQ = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);

    if (idx === currentQ.correctIndex) {
      sounds.playSuccess();
      setUserScore(prev => prev + 1);
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setTestCompleted(true);
      sounds.playBadgeUnlock();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } else {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleFinalAccept = () => {
    onSuccess(book);
    onClose();
  };

  const earnedXp = Math.round(book.pages * 12) + 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                  Reading Verification Test
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono">
                  {book.tag}
                </span>
              </div>
              <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                {book.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close quiz"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors inline-flex items-center justify-center min-h-touch min-w-touch"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Completion Celebration State */}
          {testCompleted ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-amber-500/20">
                <Award className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Comprehension Authenticated
                </span>
                <h4 className="text-2xl font-black font-['Outfit'] text-zinc-900 dark:text-zinc-50">
                  Reading Proof Verified!
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  You successfully verified your comprehension of <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{book.title}"</span> by {book.author}.
                </p>
              </div>

              {/* Reward Metric Box */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">Pages Logged</span>
                  <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">{book.pages}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">Literature XP</span>
                  <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">+{earnedXp.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">Proof Status</span>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">VERIFIED ✓</span>
                </div>
              </div>

              <button
                onClick={handleFinalAccept}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Accept Book into My Reading Archive (+{earnedXp.toLocaleString()} XP)</span>
              </button>
            </div>
          ) : (
            <>
              {/* Question Progress & Meta */}
              <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-mono">
                  Question <span className="text-amber-500 font-bold">{currentQIndex + 1}</span> of {questions.length}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {book.genre} · {book.pages} pages
                </span>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {currentQ.question}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Choose the answer that accurately reflects the book's core premise:
                </p>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQ.correctIndex;

                  let optionStyle = 'border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-amber-500/50 hover:bg-amber-500/5';
                  
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
                    } else if (isChosen && !isCorrectAnswer) {
                      optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium ring-1 ring-rose-500';
                    } else {
                      optionStyle = 'opacity-40 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 text-zinc-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] border border-current">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {isSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isChosen && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {isSubmitted && (
                <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in-50 duration-150 ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          Accurate! Comprehension point awarded.
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                          Incorrect comprehension selection.
                        </span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {selectedOption !== currentQ.correctIndex && (
                      <button
                        onClick={handleRetryQuestion}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                    )}
                    {selectedOption === currentQ.correctIndex && (
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm"
                      >
                        <span>{isLastQuestion ? 'Complete Test & Verify' : 'Next Question'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
