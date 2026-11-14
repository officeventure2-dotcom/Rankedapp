export type CategoryType = 
  | 'trivia'
  | 'language'
  | 'books'
  | 'movies'
  | 'fitness'
  | 'degree'
  | 'iq';

/** A section of the Challenges screen: one per pillar, plus the 1v1 mind-games arena. */
export type ChallengeSubTab = CategoryType | 'competitive';

export type TierType = 
  | 'Novice'       // 1 - 99
  | 'Adept'        // 100 - 249
  | 'Expert'       // 250 - 449
  | 'Master'       // 450 - 649
  | 'Grandmaster'  // 650 - 849
  | 'Apex'         // 850 - 949
  | 'Mythic';      // 950 - 1000 (10+ years dedicated mastery)

export interface StreakMilestone {
  day: number;
  title: string;
  bonusXp: number;
  badgeId?: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  streakDays: number;
  lastLoginDate?: string;
  streakClaimedToday?: boolean;
  totalStreakXpEarned?: number;
  streakFreezeAvailable?: number;
  streakMilestonesClaimed?: number[];
  pillarMastery: Record<CategoryType, number>; // 0 to 100 score in each pillar
  yearsDedicated: number;
  stats: {
    triviaSolved: number;
    languagesStudied: number;
    booksRead: number;
    moviesWatched: number;
    kmLogged: number;
    degreesEarned: number;
    iqScore: number;
  };
  connectedWearables: {
    strava: boolean;
    appleWatch: boolean;
    garmin: boolean;
    whoop: boolean;
    goodreads: boolean;
    kindle?: boolean;
    appleBooks?: boolean;
    storyGraph?: boolean;
    letterboxd?: boolean;
    imdb?: boolean;
    trakt?: boolean;
  };
  unlockedBadgeIds: string[];
  readBookIds?: string[];
  watchedVideoIds?: string[];
}

export interface BookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string[];
  estimatedMinutes: number;
}

export interface OnlineBook {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  coverColor: string;
  pages: number;
  description: string;
  chapters: BookChapter[];
  totalXp: number;
}

export interface VideoQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export interface EducationalVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  category: CategoryType;
  durationMinutes: number;
  description: string;
  takeaways: string[];
  xpReward: number;
  knowledgeDomain: string;
  quizQuestions: VideoQuizQuestion[];
}

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  rarity: BadgeRarity;
  xpReward: number;
  iconName: string;
  requiredLevel?: number;
  unlockedAt?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  xpReward: number;
  current: number;
  target: number;
  unit: string;
  completed: boolean;
}

export type TriviaDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Grandmaster';

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: TriviaDifficulty;
  xp: number;
}

export interface TriviaAttempt {
  id: string;
  questionId: string;
  question: string;
  category: string;
  difficulty: TriviaDifficulty;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  xpEarned: number;
  timestamp: string;
}

export interface TriviaStats {
  totalAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
  bestStreak: number;
  totalXpEarned: number;
  byDifficulty: Record<TriviaDifficulty, {
    total: number;
    correct: number;
    wrong: number;
  }>;
}

export interface IQQuestion {
  id: string;
  prompt: string;
  visualMatrix?: string[]; // Grid symbols or sequence
  options: string[];
  correctIndex: number;
  logicExplanation: string;
  iqWeight: number; // e.g., +2 to +5 IQ points
  xp: number;
}

export type LanguageGoal = 'learn' | 'improve';
export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AlphabetChar {
  char: string;
  transliteration: string;
  name: string;
  phoneticSound: string;
  exampleWord: string;
  exampleMeaning: string;
}

export interface PhonicsWord {
  word: string;
  phonetic: string;
  syllables: string[];
  meaning: string;
  readingTip: string;
}

export interface LanguageExercise {
  id: string;
  languageId: string;
  languageName: string;
  nativeName: string;
  flag: string;
  localeCode: string;
  goal: LanguageGoal;
  level: CEFRLevel;
  levelLabel: string;
  topic: string;
  prompt: string;
  taskPhrase: string;
  phonetic?: string;
  grammarNote: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export type ScienceField = 
  | 'Astrophysics'
  | 'Quantum Physics'
  | 'Molecular Biology'
  | 'Neuroscience'
  | 'Biochemistry'
  | 'Chemistry'
  | 'Evolution'
  | 'Cosmology';

export interface ScienceCard {
  id: string;
  term: string;
  field: ScienceField;
  pronunciation: string;
  etymology: string;
  definition: string;
  breakthroughFact: string;
  discoveryYear?: string;
  discoverer?: string;
  realWorldImpact: string;
  xpReward: number;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LanguageLesson {
  id: string;
  language: string;
  flag: string;
  level: string; // A1, A2, B1, B2, C1, C2
  prompt: string;
  translationTask: string;
  options: string[];
  correctIndex: number;
  xp: number;
}

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  pages: number;
  genre: string;
  completedDate: string;
  rating: number;
  xpAwarded: number;
  source?: 'Manual' | 'Verification Test' | 'Goodreads' | 'Kindle' | 'Apple Books' | 'The StoryGraph';
  verified?: boolean;
  quizScore?: string;
}

export interface MovieEntry {
  id: string;
  title: string;
  director: string;
  year: number;
  genre: string;
  completedDate: string;
  rating: number;
  xpAwarded: number;
  source?: 'Manual' | 'Letterboxd' | 'IMDb' | 'Trakt.tv';
}

export interface AcademicMilestone {
  id: string;
  title: string;
  institution: string;
  field: string;
  type: 'Bachelor' | 'Master' | 'Doctorate (PhD)' | 'Professional Certification' | 'Research Paper';
  yearCompleted: number;
  xpAwarded: number;
}

export interface FitnessActivity {
  id: string;
  type: 'Run' | 'Cycle' | 'Strength' | 'Swim' | 'HIIT';
  title: string;
  distanceKm?: number;
  durationMinutes: number;
  caloriesBurned: number;
  source: 'Strava' | 'Apple Watch' | 'Garmin' | 'Manual';
  timestamp: string;
  xpAwarded: number;
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  userLevel: number;
  timestamp: string;
  category: CategoryType;
  title: string;
  content: string;
  xpGained: number;
  badgeUnlocked?: string;
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  comments: Array<{
    id: string;
    userName: string;
    text: string;
    timestamp: string;
  }>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface FriendContact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline' | 'in_challenge';
  sharedInterests: string[];
  lastMessage: string;
  unreadCount: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: number;
  xp: number;
  tier: TierType;
  topCategory: CategoryType;
  isFriend: boolean;
  isCurrentUser?: boolean;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  time?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'level_up' | 'streak' | 'leaderboard' | 'chat' | 'wearable';
}

export interface PlayerLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface MapPlayer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: number;
  xp: number;
  tier: TierType;
  topCategory: CategoryType;
  location: PlayerLocation;
  bio: string;
  statusText: string;
  isFriend: boolean;
  isCurrentUser?: boolean;
  onlineNow?: boolean;
  distanceKm?: number;
  lastActive?: string;
}

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'dark-neo'
  | 'anime-solo'
  | 'anime-cyberpunk'
  | 'anime-sakura'
  | 'anime-saiyan';

export interface ThemePreset {
  id: ThemeMode;
  name: string;
  subtitle: string;
  category: 'Standard' | 'Neo-Brutalism' | 'Anime & Gaming';
  badge: string;
  accentColor: string;
  bgHex: string;
  accentHex: string;
  secondaryHex: string;
  description: string;
  glowClass: string;
  bannerBorder: string;
}

