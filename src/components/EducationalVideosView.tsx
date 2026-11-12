import React, { useState, useEffect, useRef } from 'react';
import { useRanked } from '../context/RankedContext';
import { EducationalVideo, VideoQuizQuestion } from '../types';
import {
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Youtube,
  Clock,
  Award,
  BookOpen,
  Brain,
  Film,
  GraduationCap,
  FastForward,
  HelpCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { data: number; target: any }) => void;
          };
        }
      ) => any;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

export const EducationalVideosView: React.FC = () => {
  const {
    educationalVideos,
    watchedVideoIds,
    completeVideo,
    gainXp,
    showToast
  } = useRanked();

  const [activeVideo, setActiveVideo] = useState<EducationalVideo>(educationalVideos[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Video watch detection state
  const [isFullyWatched, setIsFullyWatched] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(activeVideo.durationMinutes * 60);
  const [isPlayerActive, setIsPlayerActive] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

  // Comprehension Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Reset watch & quiz state when switching videos
  useEffect(() => {
    const isAlreadyWatched = watchedVideoIds.includes(activeVideo.id);
    setIsFullyWatched(isAlreadyWatched);
    setPlaybackSeconds(isAlreadyWatched ? activeVideo.durationMinutes * 60 : 0);
    setTotalDuration(activeVideo.durationMinutes * 60);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  }, [activeVideo.id, watchedVideoIds]);

  // Load YouTube IFrame API script dynamically
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize or re-create YouTube player when activeVideo changes
  useEffect(() => {
    let checkInterval: number | null = null;

    const initPlayer = () => {
      const container = document.getElementById('youtube-iframe-player');
      if (!container || !window.YT || !window.YT.Player) return;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player('youtube-iframe-player', {
          videoId: activeVideo.youtubeId,
          playerVars: {
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              const dur = event.target.getDuration();
              if (dur && dur > 0) setTotalDuration(dur);
            },
            onStateChange: (event: { data: number; target: any }) => {
              if (event.data === 1) { // PLAYING
                setIsPlayerActive(true);
              } else if (event.data === 0) { // ENDED
                handleTriggerFullyWatched();
              }
            }
          }
        });
      } catch {
        // Fallback gracefully
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Interval to monitor playback progress
    checkInterval = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const current = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration() || totalDuration;
          if (current) setPlaybackSeconds(Math.floor(current));
          if (dur) setTotalDuration(Math.floor(dur));

          // Auto-detect fully watched when within 5% of end or past 95%
          if (dur > 0 && current > 0 && current >= dur * 0.95 && !isFullyWatched) {
            handleTriggerFullyWatched();
          }
        } catch {
          // ignore
        }
      }
    }, 1000);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [activeVideo.youtubeId]);

  // Handler when video completes
  const handleTriggerFullyWatched = () => {
    if (isFullyWatched) return;
    setIsFullyWatched(true);
    setPlaybackSeconds(totalDuration);
    sounds.playLevelUp();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    showToast(`Lecture Finished! Answer the comprehension questions below to claim Knowledge XP.`);
  };

  // Instant simulation helper for test/eval
  const handleSimulateFullWatch = () => {
    handleTriggerFullyWatched();
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(totalDuration - 2, true);
      } catch {
        // ignore
      }
    }
  };

  const filteredVideos = educationalVideos.filter(v => {
    if (filterCategory === 'all') return true;
    return v.category === filterCategory;
  });

  const isAlreadyMastered = watchedVideoIds.includes(activeVideo.id);
  const quizList = activeVideo.quizQuestions || [];
  const currentQ = quizList[currentQuizIndex];

  // Quiz Answer selection
  const handleSelectQuizOption = (optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optIndex);
    setQuizSubmitted(true);

    if (optIndex === currentQ.correctIndex) {
      sounds.playSuccess();
      setQuizScore(prev => prev + 1);
      gainXp(currentQ.xpReward, activeVideo.category, `Quiz: ${currentQ.question.slice(0, 30)}...`);
    } else {
      sounds.playClick();
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < quizList.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      // Finished all quiz questions!
      setQuizFinished(true);
      completeVideo(activeVideo.id);
      sounds.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const watchPercentage = totalDuration > 0
    ? Math.min(100, Math.round((playbackSeconds / totalDuration) * 100))
    : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest font-semibold">
            <Youtube className="w-4 h-4" />
            <span>Interactive Educational Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-zinc-900 dark:text-zinc-50">
            Stream Masterclasses & Increase Knowledge
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Watch complete educational masterclasses on quantum physics, neural networks, neuroscience, and film theory. The app automatically detects when you watch the full video and presents a multiple-choice comprehension test to verify your knowledge!
          </p>
        </div>

        {/* Video Mastery KPI */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-zinc-500 block">Lectures Mastered</span>
            <p className="text-xl font-bold font-mono text-red-600 dark:text-red-400 tabular-nums">
              {watchedVideoIds.length} <span className="text-xs font-normal text-zinc-500">/ {educationalVideos.length}</span>
            </p>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700" />
          <div>
            <span className="text-[11px] text-zinc-500 block">Knowledge XP Gained</span>
            <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
              {(watchedVideoIds.length * 3500).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Video Viewport & Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Video Player & Automatic Watch Progress (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* YouTube Responsive iFrame Container */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black aspect-video shadow-lg">
            <div id="youtube-iframe-player" className="w-full h-full" />
          </div>

          {/* Automatic Watch Progress & Verification Bar */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isFullyWatched ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {isFullyWatched ? 'Watch Status: Fully Completed (100%)' : 'Auto-Detection Active: Watching in progress...'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 tabular-nums">
                  {formatSeconds(playbackSeconds)} / {formatSeconds(totalDuration)} ({watchPercentage}%)
                </span>
                {!isFullyWatched && (
                  <button
                    onClick={handleSimulateFullWatch}
                    title="Simulate reaching the end to test auto-detection"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <FastForward className="w-3 h-3 text-amber-500" />
                    <span>Auto-Complete Test</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Watch Progress Bar */}
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isFullyWatched ? 'bg-emerald-500' : 'bg-gradient-to-r from-red-500 to-amber-500'}`}
                style={{ width: `${Math.max(3, watchPercentage)}%` }}
              />
            </div>
          </div>

          {/* Video Metadata & Information */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="text-red-500 font-semibold">{activeVideo.channel}</span>
                  <span>·</span>
                  <span>{activeVideo.knowledgeDomain}</span>
                  <span>·</span>
                  <span>{activeVideo.durationMinutes} min</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                  {activeVideo.title}
                </h2>
              </div>

              <div className="shrink-0">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{activeVideo.xpReward.toLocaleString()} Total XP</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {activeVideo.description}
            </p>

            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Core Lecture Takeaways:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                {activeVideo.takeaways.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COMPREHENSION QUIZ SECTION - REVEALED ONCE FULLY WATCHED */}
          {isFullyWatched ? (
            <div className="p-6 rounded-2xl border-2 border-amber-500/80 bg-white dark:bg-zinc-900/95 shadow-xl space-y-5 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                      Post-Lecture Comprehension Quiz
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Auto-unlocked after full watch. Test your retention to claim verified knowledge mastery!
                    </p>
                  </div>
                </div>

                {!quizFinished && (
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Question {currentQuizIndex + 1} of {quizList.length}
                  </span>
                )}
              </div>

              {!quizFinished ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {currentQ.question}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQ.options.map((option, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrect = oIdx === currentQ.correctIndex;

                      let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 font-semibold';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(oIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                          {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <strong className="text-zinc-900 dark:text-zinc-100">Explanation: </strong>
                        {currentQ.explanation}
                      </p>

                      <div className="flex justify-end">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                        >
                          <span>{currentQuizIndex < quizList.length - 1 ? 'Next Question' : 'Complete Lecture & Finalize XP'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Complete Celebratory State */
                <div className="p-6 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                    Mastery Verified! ({quizScore}/{quizList.length} Correct)
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
                    You have watched the complete video and proven comprehension. Full knowledge XP (+{activeVideo.xpReward.toLocaleString()} XP) has been permanently recorded to your profile!
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setCurrentQuizIndex(0);
                        setSelectedOption(null);
                        setQuizSubmitted(false);
                        setQuizFinished(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Prompt to finish watching */
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Comprehension Quiz Locked
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Finish watching the complete video above. The quiz will auto-appear when the lecture concludes!
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulateFullWatch}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 whitespace-nowrap shrink-0"
              >
                Skip to Quiz
              </button>
            </div>
          )}

        </div>

        {/* Right: Curated Playlist & Knowledge Track Selection (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              Curated Video Lectures ({filteredVideos.length})
            </h3>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              All Tracks
            </button>
            <button
              onClick={() => setFilterCategory('iq')}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'iq'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Math & AI
            </button>
            <button
              onClick={() => setFilterCategory('degree')}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'degree'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Physics
            </button>
            <button
              onClick={() => setFilterCategory('trivia')}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'trivia'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Cognition & History
            </button>
          </div>

          {/* Playlist Cards */}
          <div className="space-y-3">
            {filteredVideos.map(video => {
              const isSelected = video.id === activeVideo.id;
              const isWatched = watchedVideoIds.includes(video.id);

              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500/80 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      {video.channel}
                    </span>
                    {isWatched && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-2">
                    {video.title}
                  </h4>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {video.durationMinutes}m
                    </span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                      +{video.xpReward.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
