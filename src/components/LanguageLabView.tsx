import React, { useState, useMemo } from 'react';
import { useRanked } from '../context/RankedContext';
import {
  SUPPORTED_LANGUAGES,
  CEFR_LEVELS_META,
  LANGUAGE_EXERCISES_DATABASE,
  LANGUAGE_CHEATSHEETS,
  LANGUAGE_ALPHABETS,
  LANGUAGE_PHONICS_WORDS,
  SupportedLanguage,
  LevelInfo
} from '../data/languageData';
import { LanguageGoal, CEFRLevel, LanguageExercise } from '../types';
import {
  Globe,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Zap,
  GraduationCap,
  Info,
  Flame,
  Check,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export const LanguageLabView: React.FC = () => {
  const { user, gainXp, showToast } = useRanked();

  // 1. Language Selection (Default: Spanish)
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('spanish');

  // 2. Intent Selection: "learn" (new language) vs "improve" (polish existing)
  const [goal, setGoal] = useState<LanguageGoal>('learn');

  // 3. Known Level Selection: A1, A2, B1, B2, C1, C2
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');

  // Exercise interactive state
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [completedDrillsCount, setCompletedDrillsCount] = useState<number>(0);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [a0StudioTab, setA0StudioTab] = useState<'alphabet' | 'phonics'>('alphabet');
  const [masteredPhonicsWords, setMasteredPhonicsWords] = useState<string[]>([]);

  // Selected language object
  const currentLang: SupportedLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguageId) || SUPPORTED_LANGUAGES[0];
  }, [selectedLanguageId]);

  // Selected level object
  const currentLevelMeta: LevelInfo = useMemo(() => {
    return CEFR_LEVELS_META.find(lvl => lvl.level === selectedLevel) || CEFR_LEVELS_META[0];
  }, [selectedLevel]);

  // Filter exercises based on selection
  const matchingExercises: LanguageExercise[] = useMemo(() => {
    // Exact match: language + goal + level
    let filtered = LANGUAGE_EXERCISES_DATABASE.filter(
      ex => ex.languageId === selectedLanguageId && ex.goal === goal && ex.level === selectedLevel
    );

    // Fallback 1: match language + goal
    if (filtered.length === 0) {
      filtered = LANGUAGE_EXERCISES_DATABASE.filter(
        ex => ex.languageId === selectedLanguageId && ex.goal === goal
      );
    }

    // Fallback 2: match language only
    if (filtered.length === 0) {
      filtered = LANGUAGE_EXERCISES_DATABASE.filter(
        ex => ex.languageId === selectedLanguageId
      );
    }

    // Fallback 3: all
    if (filtered.length === 0) {
      filtered = LANGUAGE_EXERCISES_DATABASE;
    }

    return filtered;
  }, [selectedLanguageId, goal, selectedLevel]);

  // Active exercise
  const currentExercise: LanguageExercise = matchingExercises[exerciseIndex % matchingExercises.length];

  // Cheatsheet for current language
  const currentCheatsheet = LANGUAGE_CHEATSHEETS[selectedLanguageId] || LANGUAGE_CHEATSHEETS['spanish'];

  // Alphabets and Phonics words for current language
  const currentAlphabets = useMemo(() => {
    return LANGUAGE_ALPHABETS[selectedLanguageId] || LANGUAGE_ALPHABETS['spanish'] || [];
  }, [selectedLanguageId]);

  const currentPhonicsWords = useMemo(() => {
    return LANGUAGE_PHONICS_WORDS[selectedLanguageId] || LANGUAGE_PHONICS_WORDS['spanish'] || [];
  }, [selectedLanguageId]);

  // Speech synthesis audio playback
  const playNativeAudio = (textToSpeak: string) => {
    sounds.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean bracketed transliterations for speech
      const cleanedText = textToSpeak.replace(/\(.*?\)/g, '').replace(/[_\*]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = currentLang.localeCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      showToast(`Audio preview: "${textToSpeak}"`);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
    setIsSubmitted(true);

    const isCorrect = index === currentExercise.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      const xpAward = currentExercise.xpReward || currentLevelMeta.defaultXp;
      gainXp(xpAward, 'language', `${currentLang.name} (${selectedLevel}): ${currentExercise.topic}`);
      setCompletedDrillsCount(prev => prev + 1);
      showToast(`✨ Correct! +${xpAward} XP added to Language Pillar`);
    } else {
      sounds.playClick();
    }
  };

  const handleNextExercise = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setExerciseIndex(prev => prev + 1);
  };

  const handleAdvanceLevel = () => {
    const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levelOrder.indexOf(selectedLevel);
    if (currentIndex < levelOrder.length - 1) {
      const nextLvl = levelOrder[currentIndex + 1];
      setSelectedLevel(nextLvl);
      setSelectedOption(null);
      setIsSubmitted(false);
      setExerciseIndex(0);
      sounds.playLevelUp();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      gainXp(1500, 'language', `CEFR Level Certification: ${currentLang.name} ${nextLvl}`);
      showToast(`🎓 Certified! Advanced to ${currentLang.name} ${nextLvl} (+1,500 XP)`);
    } else {
      showToast(`🏆 You have reached C2 Polymath Mastery in ${currentLang.name}!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Multilingual Polyglot Academy</span>
            </div>
            <h2 className="text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
              <span>Language Lab</span>
              <span className="text-xl font-normal text-zinc-400">·</span>
              <span className="text-lg font-medium text-purple-600 dark:text-purple-400 font-mono">
                {currentLang.flag} {currentLang.name}
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Personalized language acquisition track. Select your target language, specify whether you are acquiring fundamentals or mastering advanced rhetoric, and drill at your exact CEFR proficiency level.
            </p>
          </div>

          {/* Polyglot Pillar KPI Badge */}
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/60 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-500 font-medium">Languages Studied</div>
              <div className="text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                {user.stats.languagesStudied} Languages <span className="text-xs font-normal text-purple-500 font-sans">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Language Selector Grid / Scroll */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Step 1: Choose Your Language</span>
            <span className="text-[11px] font-normal text-zinc-400">10 World Languages Available</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SUPPORTED_LANGUAGES.map(lang => {
              const isSelected = lang.id === selectedLanguageId;
              return (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguageId(lang.id);
                    setSelectedOption(null);
                    setIsSubmitted(false);
                    setExerciseIndex(0);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{lang.flag}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {lang.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium">
                      {lang.nativeName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Goal / Intent & Level Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Step 2: Goal Switcher (Learn vs Improve) */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Step 2: Your Current Objective
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setGoal('learn');
                  setSelectedOption(null);
                  setIsSubmitted(false);
                  setExerciseIndex(0);
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  goal === 'learn'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold">Learn New Language</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  Foundations, pronunciation phonetics, core vocabulary & basic sentence construction.
                </p>
              </button>

              <button
                onClick={() => {
                  setGoal('improve');
                  setSelectedOption(null);
                  setIsSubmitted(false);
                  setExerciseIndex(0);
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  goal === 'improve'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold">Improve & Polish</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  Advanced nuances, subjunctive mood, idiomatic expressions & rhetorical fluency.
                </p>
              </button>
            </div>
          </div>

            {/* Step 3: Current Known Level Selector (A0 - C2) */}
            <div className="lg:col-span-7 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>Step 3: Select Level You Know</span>
                <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {currentLevelMeta.badge} · {currentLevelMeta.targetVocab}
                </span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {CEFR_LEVELS_META.map(lvl => {
                  const isSelected = lvl.level === selectedLevel;
                  return (
                    <button
                      key={lvl.level}
                      onClick={() => {
                        setSelectedLevel(lvl.level);
                        setSelectedOption(null);
                        setIsSubmitted(false);
                        setExerciseIndex(0);
                        sounds.playClick();
                      }}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-600 text-white font-extrabold shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{lvl.level}</div>
                      <div className={`text-[9px] truncate ${isSelected ? 'text-purple-100' : 'text-zinc-400'}`}>
                        {lvl.level === 'A0' ? 'Alphabet' :
                         lvl.level === 'A1' ? 'Beginner' :
                         lvl.level === 'A2' ? 'Elem.' :
                         lvl.level === 'B1' ? 'Interm.' :
                         lvl.level === 'B2' ? 'Upper' :
                         lvl.level === 'C1' ? 'Adv.' : 'Mastery'}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                <strong className="text-zinc-800 dark:text-zinc-200">{currentLevelMeta.title}:</strong> {currentLevelMeta.description}
              </p>
            </div>

          </div>

        </div>

        {/* 4. A0 ABSOLUTE BEGINNER: ALPHABET & WORD READING STUDIO */}
        {selectedLevel === 'A0' ? (
          <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
            
            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono">
                    {currentLang.flag} {currentLang.name} · Absolute Beginner Foundation
                  </span>
                  <span>·</span>
                  <span>Phonics & Word Reading Laboratory</span>
                </div>
                <h3 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                  {currentLang.name} Alphabet & How to Read Words
                </h3>
              </div>

              {/* Sub-tab toggle between Alphabet and Word Reading */}
              <div className="flex items-center rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setA0StudioTab('alphabet')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    a0StudioTab === 'alphabet'
                      ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" />Alphabet & Sounds</span>
                </button>
                <button
                  onClick={() => setA0StudioTab('phonics')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    a0StudioTab === 'phonics'
                      ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />How to Read Words</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Alphabet & Soundboard Grid */}
            {a0StudioTab === 'alphabet' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Click any character to hear its exact native pronunciation & phonetic sound:</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {currentAlphabets.length} Characters in Soundboard
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                  {currentAlphabets.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => playNativeAudio(item.char)}
                      className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 bg-zinc-50/50 dark:bg-zinc-800/40 text-left transition-all hover:scale-105 active:scale-95 group cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {item.char}
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                      <div className="mt-2">
                        <div className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                          {item.transliteration}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate" title={item.phoneticSound}>
                          {item.phoneticSound}
                        </div>
                        <div className="text-[9px] text-zinc-500 italic mt-0.5 truncate" title={`${item.exampleWord} (${item.exampleMeaning})`}>
                          {item.exampleWord}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs text-zinc-700 dark:text-zinc-300">
                    <strong>Mastered the sounds?</strong> Move to the syllable blending lab to learn how to read full words!
                  </div>
                  <button
                    onClick={() => setA0StudioTab('phonics')}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Practice Reading Words</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: How to Read Words (Phonics & Syllable Blending) */}
            {a0StudioTab === 'phonics' && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-500">
                  Learn how letters combine into syllables and fluid speech. Click on syllables and listen to full word pronunciations:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPhonicsWords.map((item, idx) => {
                    const isMastered = masteredPhonicsWords.includes(item.word);
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all space-y-3 bg-zinc-50/50 dark:bg-zinc-800/40 ${
                          isMastered
                            ? 'border-emerald-500/60 ring-1 ring-emerald-500/20'
                            : 'border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-2xl font-bold font-sans text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                              <span>{item.word}</span>
                              <button
                                onClick={() => playNativeAudio(item.word)}
                                title="Listen to word"
                                className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-medium">
                              Phonetic: {item.phonetic}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                              Meaning: <strong className="text-zinc-700 dark:text-zinc-300">{item.meaning}</strong>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (!isMastered) {
                                setMasteredPhonicsWords(prev => [...prev, item.word]);
                                sounds.playSuccess();
                                gainXp(200, 'language', `Mastered Reading Word: ${item.word}`);
                                showToast(`✨ Word Mastered! +200 XP`);
                              }
                            }}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                              isMastered
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isMastered ? 'Mastered' : 'Mark Learned'}</span>
                          </button>
                        </div>

                        {/* Syllable Breakdown */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                            Syllable Separation (Blend left to right):
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.syllables.map((syl, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => playNativeAudio(syl)}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:border-purple-400 cursor-pointer"
                              >
                                {syl}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Phonics Reading Rule Tip */}
                        <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40 text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          <strong className="text-purple-700 dark:text-purple-300">How to Read: </strong>
                          {item.readingTip}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ready to Graduate to A1 button */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <div className="text-xs text-zinc-500">
                    Mastered <strong className="text-purple-600 dark:text-purple-400">{masteredPhonicsWords.length}</strong> of {currentPhonicsWords.length} reading words
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLevel('A1');
                      sounds.playLevelUp();
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                      gainXp(500, 'language', `Graduated from A0 Alphabets to A1 Beginner: ${currentLang.name}`);
                      showToast(`🎓 Promoted to A1 Beginner in ${currentLang.name}! (+500 XP)`);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Graduate to A1 Beginner →</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* 4. Interactive Drill Arena for A1 - C2 */
          <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
            
            {/* Drill Meta Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono">
                    {currentLang.flag} {currentLang.name} · {currentExercise.levelLabel}
                  </span>
                  <span>·</span>
                  <span>{goal === 'learn' ? 'Foundational Track' : 'Advanced Fluency Track'}</span>
                  <span>·</span>
                  <span className="text-zinc-400">{currentExercise.topic}</span>
                </div>
                <h3 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                  {currentExercise.prompt}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedLevel('A0')}
                  title="Review Alphabet & How to Read Words"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Alphabet Soundboard</span>
                </button>
                <button
                  onClick={() => playNativeAudio(currentExercise.taskPhrase)}
                  title="Listen to native pronunciation"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Pronounce</span>
                </button>
                <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                  +{currentExercise.xpReward.toLocaleString()} XP
                </span>
              </div>
            </div>

        {/* Challenge Task Box */}
        <div className="p-5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-purple-600 dark:text-purple-400">
              Target Sentence Exercise
            </span>
            {currentExercise.phonetic && (
              <span className="text-[11px] font-mono text-zinc-400">
                Phonetics: <span className="italic">{currentExercise.phonetic}</span>
              </span>
            )}
          </div>
          <p className="text-lg sm:text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed font-sans">
            {currentExercise.taskPhrase}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {currentExercise.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentExercise.correctIndex;

            let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-purple-400 dark:hover:border-purple-500';
            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border text-left font-medium text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Post-Submission Linguistic Explanation & Controls */}
        {isSubmitted && (
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-500 shrink-0" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Grammar Breakdown & Rule
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {currentExercise.grammarNote}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
              <strong>Answer Context:</strong> {currentExercise.explanation}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/60 dark:border-zinc-700/60">
              <div className="text-xs text-zinc-500">
                Completed <strong className="text-purple-600 dark:text-purple-400">{completedDrillsCount}</strong> drills in this session
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdvanceLevel}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg border border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Test Out to Next CEFR Level</span>
                </button>
                <button
                  onClick={handleNextExercise}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Next Exercise</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      )}

      {/* 5. Grammar Cheatsheet & Vocab Rules Drawer */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCheatsheet(prev => !prev)}
          className="w-full p-5 text-left flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {currentLang.name} Grammar Insights & Polyglot Reference
              </h4>
              <p className="text-[11px] text-zinc-500">
                Essential grammar rules, word order rules & nuances for {currentLang.name}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
            {showCheatsheet ? 'Collapse ▲' : 'View Grammar Rules ▼'}
          </span>
        </button>

        {showCheatsheet && (
          <div className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {currentCheatsheet.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5"
                >
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{tip.title}</span>
                  </h5>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {tip.rule}
                  </p>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 font-mono text-[11px] text-purple-700 dark:text-purple-300">
                    {tip.example}
                  </div>
                  <div className="text-[10px] text-zinc-400 italic">
                    {tip.translation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
