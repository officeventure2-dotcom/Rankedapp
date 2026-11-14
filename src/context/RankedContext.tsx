import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  DailyQuest,
  Badge,
  FeedPost,
  FriendContact,
  ChatMessage,
  FitnessActivity,
  BookEntry,
  MovieEntry,
  AcademicMilestone,
  NotificationSetting,
  CategoryType,
  LeaderboardUser,
  OnlineBook,
  EducationalVideo,
  ThemeMode,
  ChallengeSubTab
} from '../types';
import { BookCatalogItem } from '../data/bookCatalogData';
import {
  INITIAL_USER,
  INITIAL_DAILY_QUESTS,
  BADGES_CATALOG,
  INITIAL_FEED_POSTS,
  INITIAL_FRIENDS,
  INITIAL_CHAT_HISTORIES,
  INITIAL_FITNESS,
  INITIAL_BOOKS,
  INITIAL_MOVIES,
  INITIAL_ACADEMICS,
  INITIAL_NOTIFICATIONS_SETTINGS,
  INITIAL_LEADERBOARD,
  ONLINE_BOOKS_LIBRARY,
  EDUCATIONAL_VIDEOS,
  USER_PROFILES_MAP
} from '../data/mockData';
import { getLevelFromXp, getTierForLevel } from '../utils/levelMath';
import { calculateDailyStreakXp } from '../utils/streakMath';
import { sounds } from '../utils/audio';

interface LevelUpInfo {
  oldLevel: number;
  newLevel: number;
  tier: string;
}

interface RankedContextType {
  user: UserProfile;
  dailyQuests: DailyQuest[];
  badges: Badge[];
  feedPosts: FeedPost[];
  friends: FriendContact[];
  activeFriendId: string;
  setActiveFriendId: (id: string) => void;
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (friendId: string, text: string) => void;
  fitnessActivities: FitnessActivity[];
  books: BookEntry[];
  movies: MovieEntry[];
  academics: AcademicMilestone[];
  leaderboard: LeaderboardUser[];
  activeTab: 'overview' | 'challenges' | 'library' | 'academy' | 'science' | 'leaderboard' | 'map' | 'social' | 'chat' | 'badges';
  /** Which Challenges section is open (so other screens can deep-link into one). */
  challengePillar: ChallengeSubTab;
  setChallengePillar: (pillar: ChallengeSubTab) => void;
  setActiveTab: (tab: 'overview' | 'challenges' | 'library' | 'academy' | 'science' | 'leaderboard' | 'map' | 'social' | 'chat' | 'badges') => void;
  userLocation: { lat: number; lng: number; city?: string } | null;
  locationEnabled: boolean;
  enableLocation: () => Promise<void>;
  toggleLocation: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  levelUpModal: LevelUpInfo | null;
  dismissLevelUp: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
  wearablesModalOpen: boolean;
  setWearablesModalOpen: (open: boolean) => void;
  notificationsModalOpen: boolean;
  setNotificationsModalOpen: (open: boolean) => void;
  streakModalOpen: boolean;
  setStreakModalOpen: (open: boolean) => void;
  androidModalOpen: boolean;
  setAndroidModalOpen: (open: boolean) => void;
  flutterModalOpen: boolean;
  setFlutterModalOpen: (open: boolean) => void;
  claimDailyStreakBonus: () => void;
  advanceStreakDaySimulated: () => void;
  notificationsSettings: NotificationSetting[];
  toggleNotificationSetting: (id: string) => void;
  requestPushPermissions: () => Promise<void>;
  gainXp: (amount: number, category: CategoryType, reason: string) => void;
  addBook: (title: string, author: string, pages: number, genre: string, rating: number, source?: BookEntry['source'], verified?: boolean, quizScore?: string) => void;
  addMovie: (title: string, director: string, year: number, genre: string, rating: number, source?: MovieEntry['source']) => void;
  addAcademicMilestone: (title: string, institution: string, field: string, type: AcademicMilestone['type'], year: number) => void;
  addFitnessActivity: (type: FitnessActivity['type'], title: string, distanceKm: number | undefined, durationMinutes: number, calories: number, source?: FitnessActivity['source']) => void;
  syncWearables: (brand: 'strava' | 'appleWatch' | 'garmin') => Promise<{ kmAdded: number; xpGained: number; calories: number }>;
  toggleWearableConnection: (brand: 'strava' | 'appleWatch' | 'garmin' | 'whoop' | 'goodreads') => void;
  
  // App Syncing: Reading & Movie Apps
  syncReadingApps: (brand?: 'goodreads' | 'kindle' | 'appleBooks' | 'storyGraph') => Promise<{ booksAdded: number; xpGained: number }>;
  syncMovieApps: (brand?: 'letterboxd' | 'imdb' | 'trakt') => Promise<{ moviesAdded: number; xpGained: number }>;
  isSyncingReading: boolean;
  isSyncingMovies: boolean;
  toggleConnectedApp: (serviceKey: keyof UserProfile['connectedWearables']) => void;
  
  // Book Reading Verification Quiz
  bookForVerification: BookCatalogItem | null;
  setBookForVerification: (item: BookCatalogItem | null) => void;
  addVerifiedBook: (title: string, author: string, pages: number, genre: string, rating: number, quizScore?: string) => void;

  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string) => void;
  createPost: (title: string, content: string, category: CategoryType) => void;
  switchProfile: (profileId: string) => void;
  isSyncingWearable: boolean;

  // Profile Inspection Modal
  inspectingUser: UserProfile | null;
  openUserProfile: (userId: string) => void;
  closeUserProfile: () => void;

  // In-app Online Reading
  onlineBooks: OnlineBook[];
  activeBookForReading: OnlineBook | null;
  activeChapterIndex: number;
  openReader: (book: OnlineBook, chapterIndex?: number) => void;
  closeReader: () => void;
  completeChapter: (bookId: string, chapterIndex: number) => void;

  // Educational Videos Academy
  educationalVideos: EducationalVideo[];
  watchedVideoIds: string[];
  completeVideo: (videoId: string) => void;

  // Science Discovery Codex
  masteredScienceCardIds: string[];
  toggleMasterScienceCard: (cardId: string) => void;
}

const RankedContext = createContext<RankedContextType | undefined>(undefined);

export const RankedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ranked_theme');
    const validThemes: ThemeMode[] = ['light', 'dark', 'dark-neo', 'anime-solo', 'anime-cyberpunk', 'anime-sakura', 'anime-saiyan'];
    return (validThemes.includes(saved as ThemeMode) ? (saved as ThemeMode) : 'dark');
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ranked_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [challengePillar, setChallengePillar] = useState<ChallengeSubTab>('competitive');
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'library' | 'academy' | 'science' | 'leaderboard' | 'map' | 'social' | 'chat' | 'badges'>('overview');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city?: string } | null>({
    lat: 37.7749,
    lng: -122.4194,
    city: 'San Francisco, CA'
  });
  const [locationEnabled, setLocationEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ranked_location_enabled');
    return saved === 'true';
  });

  const enableLocation = async (): Promise<void> => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            city: 'Your GPS Position'
          });
          setLocationEnabled(true);
          localStorage.setItem('ranked_location_enabled', 'true');
          showToast('📍 Live Geolocation Enabled: Discovering nearby players!');
          sounds.playLevelUp();
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using polymath network hub:', err);
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194,
            city: 'San Francisco, CA'
          });
          setLocationEnabled(true);
          localStorage.setItem('ranked_location_enabled', 'true');
          showToast('📍 Polymath Radar Active: Showing players near San Francisco Hub.');
        },
        { timeout: 8000 }
      );
    } else {
      setUserLocation({
        lat: 37.7749,
        lng: -122.4194,
        city: 'San Francisco, CA'
      });
      setLocationEnabled(true);
      localStorage.setItem('ranked_location_enabled', 'true');
      showToast('📍 Polymath Radar Active.');
    }
  };

  const toggleLocation = () => {
    if (locationEnabled) {
      setLocationEnabled(false);
      localStorage.setItem('ranked_location_enabled', 'false');
      showToast('Location visibility paused.');
    } else {
      enableLocation();
    }
  };

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_DAILY_QUESTS);
  const [badges, setBadges] = useState<Badge[]>(BADGES_CATALOG);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [friends, setFriends] = useState<FriendContact[]>(INITIAL_FRIENDS);
  const [activeFriendId, setActiveFriendId] = useState<string>('usr_marcus');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_HISTORIES);
  const [fitnessActivities, setFitnessActivities] = useState<FitnessActivity[]>(INITIAL_FITNESS);
  const [books, setBooks] = useState<BookEntry[]>(INITIAL_BOOKS);
  const [movies, setMovies] = useState<MovieEntry[]>(INITIAL_MOVIES);
  const [academics, setAcademics] = useState<AcademicMilestone[]>(INITIAL_ACADEMICS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [notificationsSettings, setNotificationsSettings] = useState<NotificationSetting[]>(INITIAL_NOTIFICATIONS_SETTINGS);

  // Science Discovery Cards state
  const [masteredScienceCardIds, setMasteredScienceCardIds] = useState<string[]>(['sci_1', 'sci_5']);

  const toggleMasterScienceCard = (cardId: string) => {
    setMasteredScienceCardIds(prev => {
      const exists = prev.includes(cardId);
      if (exists) {
        showToast('Card unbookmarked');
        return prev.filter(id => id !== cardId);
      } else {
        sounds.playBadgeUnlock();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        gainXp(450, 'trivia', 'Mastered Science Discovery Card');
        showToast('🌟 Science Card Mastered! +450 XP');
        return [...prev, cardId];
      }
    });
  };

  // Profile Inspection Modal state
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);

  // Online Reader state
  const [onlineBooks] = useState<OnlineBook[]>(ONLINE_BOOKS_LIBRARY);
  const [activeBookForReading, setActiveBookForReading] = useState<OnlineBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Educational Videos Academy state
  const [educationalVideos] = useState<EducationalVideo[]>(EDUCATIONAL_VIDEOS);
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ranked_watched_vids');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals & transient state
  const [levelUpModal, setLevelUpModal] = useState<LevelUpInfo | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [wearablesModalOpen, setWearablesModalOpen] = useState<boolean>(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState<boolean>(false);
  const [isSyncingWearable, setIsSyncingWearable] = useState<boolean>(false);
  const [isSyncingReading, setIsSyncingReading] = useState<boolean>(false);
  const [isSyncingMovies, setIsSyncingMovies] = useState<boolean>(false);
  const [streakModalOpen, setStreakModalOpen] = useState<boolean>(false);
  const [androidModalOpen, setAndroidModalOpen] = useState<boolean>(false);
  const [flutterModalOpen, setFlutterModalOpen] = useState<boolean>(false);
  const [bookForVerification, setBookForVerification] = useState<BookCatalogItem | null>(null);

  const claimDailyStreakBonus = () => {
    if (user.streakClaimedToday) {
      showToast('Daily streak attendance already claimed today! Return tomorrow.');
      return;
    }

    const calc = calculateDailyStreakXp(user.streakDays);
    const todayStr = new Date().toISOString().split('T')[0];

    // Gain the XP directly into user total
    gainXp(calc.totalDailyXp, 'fitness', `Day ${user.streakDays} Consecutive Attendance Reward`);

    // Audio & celebratory visual effects
    sounds.playLevelUp();
    confetti({
      particleCount: calc.milestone ? 140 : 70,
      spread: calc.milestone ? 100 : 70,
      origin: { y: 0.6 }
    });

    setUser(prev => ({
      ...prev,
      streakClaimedToday: true,
      lastLoginDate: todayStr,
      totalStreakXpEarned: (prev.totalStreakXpEarned || 0) + calc.totalDailyXp,
      streakMilestonesClaimed: calc.milestone
        ? [...(prev.streakMilestonesClaimed || []), calc.milestone.day]
        : prev.streakMilestonesClaimed
    }));

    if (calc.milestone) {
      showToast(`🔥 MILESTONE DAY ${user.streakDays}! ${calc.milestone.title} (+${calc.totalDailyXp.toLocaleString()} XP)!`);
    } else {
      showToast(`🔥 Day ${user.streakDays} Streak Claimed! +${calc.totalDailyXp.toLocaleString()} XP`);
    }
  };

  const advanceStreakDaySimulated = () => {
    setUser(prev => {
      const nextDay = prev.streakDays + 1;
      return {
        ...prev,
        streakDays: nextDay,
        streakClaimedToday: false,
        lastLoginDate: 'Simulated Tomorrow'
      };
    });
    sounds.playClick();
    showToast(`⏰ Simulated Day Advanced! Streak is now Day ${user.streakDays + 1}. Claim bonus ready!`);
  };

  // Sync sound class enabled
  useEffect(() => {
    sounds.enabled = soundEnabled;
    localStorage.setItem('ranked_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Sync theme class and data-theme attribute on root document
  useEffect(() => {
    localStorage.setItem('ranked_theme', theme);
    const root = document.documentElement;
    // Clean previous theme classes
    root.classList.remove(
      'theme-light',
      'theme-dark',
      'theme-dark-neo',
      'theme-anime-solo',
      'theme-anime-cyberpunk',
      'theme-anime-sakura',
      'theme-anime-saiyan'
    );

    if (theme === 'light') {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      document.body.classList.add('dark');
    }

    root.classList.add(`theme-${theme}`);
    root.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    sounds.playClick();
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    sounds.playClick();
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Centralized XP Gain & Level Progression
  const gainXp = (amount: number, category: CategoryType, reason: string) => {
    setUser(prevUser => {
      const oldXp = prevUser.xp;
      const newXp = oldXp + amount;
      const oldLevel = prevUser.level;
      const newLevel = getLevelFromXp(newXp);

      // Increase pillar mastery
      const currentPillar = prevUser.pillarMastery[category] || 50;
      const newPillar = Math.min(100, currentPillar + Math.ceil(amount / 5000));

      const updatedUser: UserProfile = {
        ...prevUser,
        xp: newXp,
        level: newLevel,
        pillarMastery: {
          ...prevUser.pillarMastery,
          [category]: newPillar
        }
      };

      if (newLevel > oldLevel) {
        sounds.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setLevelUpModal({
          oldLevel,
          newLevel,
          tier: getTierForLevel(newLevel)
        });
      } else {
        sounds.playSuccess();
      }

      showToast(`+${amount.toLocaleString()} XP from ${reason}!`);
      return updatedUser;
    });

    // Also update current user on leaderboard
    setLeaderboard(prev =>
      prev.map(item => {
        if (item.isCurrentUser) {
          const newXp = item.xp + amount;
          const newLevel = getLevelFromXp(newXp);
          return {
            ...item,
            xp: newXp,
            level: newLevel,
            tier: getTierForLevel(newLevel)
          };
        }
        return item;
      }).sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }))
    );
  };

  // Add Book
  const addBook = (
    title: string,
    author: string,
    pages: number,
    genre: string,
    rating: number,
    source: BookEntry['source'] = 'Manual',
    verified: boolean = false,
    quizScore?: string
  ) => {
    const xp = Math.round(pages * 12) + (verified ? 500 : 0);
    const newBook: BookEntry = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      author,
      pages,
      genre,
      completedDate: new Date().toISOString().split('T')[0],
      rating,
      xpAwarded: xp,
      source,
      verified,
      quizScore
    };
    setBooks(prev => [newBook, ...prev]);
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, booksRead: prev.stats.booksRead + 1 }
    }));
    gainXp(xp, 'books', `${verified ? 'Verified Read' : 'Reading'}: "${title}"`);
  };

  const addVerifiedBook = (
    title: string,
    author: string,
    pages: number,
    genre: string,
    rating: number,
    quizScore: string = '100% Score'
  ) => {
    addBook(title, author, pages, genre, rating, 'Verification Test', true, quizScore);
  };

  // Add Movie
  const addMovie = (
    title: string,
    director: string,
    year: number,
    genre: string,
    rating: number,
    source: MovieEntry['source'] = 'Manual'
  ) => {
    const xp = 2200;
    const newMovie: MovieEntry = {
      id: `mv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      director,
      year,
      genre,
      completedDate: new Date().toISOString().split('T')[0],
      rating,
      xpAwarded: xp,
      source
    };
    setMovies(prev => [newMovie, ...prev]);
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, moviesWatched: prev.stats.moviesWatched + 1 }
    }));
    gainXp(xp, 'movies', `${source || 'Film Diary'}: "${title}"`);
  };

  // Add Academic Milestone
  const addAcademicMilestone = (
    title: string,
    institution: string,
    field: string,
    type: AcademicMilestone['type'],
    year: number
  ) => {
    let xp = 20000;
    if (type === 'Bachelor') xp = 60000;
    if (type === 'Master') xp = 90000;
    if (type === 'Doctorate (PhD)') xp = 150000;
    if (type === 'Research Paper') xp = 25000;

    const newMilestone: AcademicMilestone = {
      id: `ac_${Date.now()}`,
      title,
      institution,
      field,
      type,
      yearCompleted: year,
      xpAwarded: xp
    };
    setAcademics(prev => [newMilestone, ...prev]);
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, degreesEarned: prev.stats.degreesEarned + 1 }
    }));
    gainXp(xp, 'degree', `${type}: ${title}`);
  };

  // Add Fitness Activity
  const addFitnessActivity = (
    type: FitnessActivity['type'],
    title: string,
    distanceKm: number | undefined,
    durationMinutes: number,
    calories: number,
    source: FitnessActivity['source'] = 'Manual'
  ) => {
    const baseDistanceXp = distanceKm ? Math.round(distanceKm * 250) : 0;
    const baseDurationXp = Math.round(durationMinutes * 30);
    const xp = baseDistanceXp + baseDurationXp;

    const newAct: FitnessActivity = {
      id: `fit_${Date.now()}`,
      type,
      title,
      distanceKm,
      durationMinutes,
      caloriesBurned: calories,
      source,
      timestamp: new Date().toLocaleString(),
      xpAwarded: xp
    };

    setFitnessActivities(prev => [newAct, ...prev]);
    if (distanceKm) {
      setUser(prev => ({
        ...prev,
        stats: { ...prev.stats, kmLogged: Math.round(prev.stats.kmLogged + distanceKm) }
      }));
    }
    gainXp(xp, 'fitness', `${source} workout: ${title}`);
  };

  // Sync Wearables simulation
  const syncWearables = async (brand: 'strava' | 'appleWatch' | 'garmin') => {
    setIsSyncingWearable(true);
    sounds.playClick();

    await new Promise(resolve => setTimeout(resolve, 1200));

    const brandNames = {
      strava: 'Strava GPS',
      appleWatch: 'Apple Watch Ultra',
      garmin: 'Garmin Forerunner'
    };

    const simulatedKm = brand === 'garmin' ? 24.5 : brand === 'strava' ? 14.8 : 8.2;
    const simulatedCals = Math.round(simulatedKm * 68);
    const durationMins = Math.round(simulatedKm * 4.9);
    const xp = Math.round(simulatedKm * 260) + 500;

    const actName = brand === 'strava' ? 'Strava Evening Tempo Run' : brand === 'garmin' ? 'Garmin Long Distance Ride' : 'Apple Watch HIIT & Run';

    addFitnessActivity(
      brand === 'garmin' ? 'Cycle' : 'Run',
      actName,
      simulatedKm,
      durationMins,
      simulatedCals,
      brand === 'strava' ? 'Strava' : brand === 'appleWatch' ? 'Apple Watch' : 'Garmin'
    );

    setIsSyncingWearable(false);
    showToast(`Synced ${simulatedKm} km from ${brandNames[brand]}! +${xp.toLocaleString()} XP`);
    return { kmAdded: simulatedKm, xpGained: xp, calories: simulatedCals };
  };

  const toggleWearableConnection = (brand: 'strava' | 'appleWatch' | 'garmin' | 'whoop' | 'goodreads') => {
    sounds.playClick();
    setUser(prev => {
      const current = prev.connectedWearables[brand];
      const updated = {
        ...prev,
        connectedWearables: {
          ...prev.connectedWearables,
          [brand]: !current
        }
      };
      showToast(`${brand.toUpperCase()} ${!current ? 'Connected' : 'Disconnected'}`);
      return updated;
    });
  };

  const toggleConnectedApp = (serviceKey: keyof UserProfile['connectedWearables']) => {
    sounds.playClick();
    setUser(prev => {
      const current = !!prev.connectedWearables[serviceKey];
      const updated = {
        ...prev,
        connectedWearables: {
          ...prev.connectedWearables,
          [serviceKey]: !current
        }
      };
      showToast(`${String(serviceKey).toUpperCase()} ${!current ? 'Connected' : 'Disconnected'}`);
      return updated;
    });
  };

  // Sync Reading Apps (Goodreads, Kindle, Apple Books, The StoryGraph)
  const syncReadingApps = async (brand: 'goodreads' | 'kindle' | 'appleBooks' | 'storyGraph' = 'goodreads') => {
    setIsSyncingReading(true);
    sounds.playClick();
    await new Promise(resolve => setTimeout(resolve, 1300));

    const mockSyncPayload: Record<string, Array<{ title: string; author: string; pages: number; genre: string; rating: number }>> = {
      kindle: [
        { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', pages: 320, genre: 'Sci-Fi / Literature', rating: 5 },
        { title: 'Zero to One: Notes on Startups', author: 'Peter Thiel', pages: 224, genre: 'Entrepreneurship', rating: 5 }
      ],
      goodreads: [
        { title: 'The Structure of Scientific Revolutions', author: 'Thomas S. Kuhn', pages: 264, genre: 'Philosophy of Science', rating: 5 },
        { title: 'Clean Code: Handbook of Agile Craft', author: 'Robert C. Martin', pages: 464, genre: 'Computer Science', rating: 5 }
      ],
      appleBooks: [
        { title: 'Man’s Search for Meaning', author: 'Viktor E. Frankl', pages: 165, genre: 'Psychology', rating: 5 },
        { title: 'The Art of War', author: 'Sun Tzu', pages: 112, genre: 'Strategy', rating: 5 }
      ],
      storyGraph: [
        { title: 'Atomic Habits', author: 'James Clear', pages: 320, genre: 'Self Mastery', rating: 5 },
        { title: 'Principles: Life and Work', author: 'Ray Dalio', pages: 592, genre: 'Systems Thinking', rating: 5 }
      ]
    };

    const brandLabels: Record<string, string> = {
      kindle: 'Amazon Kindle Whispersync',
      goodreads: 'Goodreads Shelf',
      appleBooks: 'Apple Books Library',
      storyGraph: 'The StoryGraph Tracker'
    };

    const sourceLabelMap: Record<string, BookEntry['source']> = {
      kindle: 'Kindle',
      goodreads: 'Goodreads',
      appleBooks: 'Apple Books',
      storyGraph: 'The StoryGraph'
    };

    const toImport = mockSyncPayload[brand] || mockSyncPayload.goodreads;
    let totalXp = 0;

    const existingTitles = new Set(books.map(b => b.title.toLowerCase()));
    const newItems = toImport.filter(b => !existingTitles.has(b.title.toLowerCase()));
    const itemsToAdd = newItems.length > 0 ? newItems : [toImport[0]];

    const importedEntries: BookEntry[] = itemsToAdd.map((b, idx) => {
      const xp = Math.round(b.pages * 12) + 500;
      totalXp += xp;
      return {
        id: `bk_sync_${brand}_${Date.now()}_${idx}`,
        title: b.title,
        author: b.author,
        pages: b.pages,
        genre: b.genre,
        completedDate: new Date().toISOString().split('T')[0],
        rating: b.rating,
        xpAwarded: xp,
        source: sourceLabelMap[brand] || 'Goodreads',
        verified: true,
        quizScore: 'App Telemetry Verified (100% Read)'
      };
    });

    setBooks(prev => [...importedEntries, ...prev]);
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, booksRead: prev.stats.booksRead + importedEntries.length }
    }));

    gainXp(totalXp, 'books', `${brandLabels[brand]} Import`);
    sounds.playBadgeUnlock();
    confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
    setIsSyncingReading(false);
    showToast(`📚 Synced ${importedEntries.length} books from ${brandLabels[brand]}! +${totalXp.toLocaleString()} XP`);
    return { booksAdded: importedEntries.length, xpGained: totalXp };
  };

  // Sync Movie Apps (Letterboxd, IMDb, Trakt.tv)
  const syncMovieApps = async (brand: 'letterboxd' | 'imdb' | 'trakt' = 'letterboxd') => {
    setIsSyncingMovies(true);
    sounds.playClick();
    await new Promise(resolve => setTimeout(resolve, 1300));

    const mockMoviePayload: Record<string, Array<{ title: string; director: string; year: number; genre: string; rating: number }>> = {
      letterboxd: [
        { title: 'Interstellar', director: 'Christopher Nolan', year: 2014, genre: 'Sci-Fi / Space Exploration', rating: 5 },
        { title: 'Parasite', director: 'Bong Joon-ho', year: 2019, genre: 'Thriller / Social Satire', rating: 5 }
      ],
      imdb: [
        { title: 'The Godfather', director: 'Francis Ford Coppola', year: 1972, genre: 'Crime / Epic Drama', rating: 5 },
        { title: 'Spirited Away', director: 'Hayao Miyazaki', year: 2001, genre: 'Animation / Fantasy', rating: 5 }
      ],
      trakt: [
        { title: 'Blade Runner 2049', director: 'Denis Villeneuve', year: 2017, genre: 'Cyberpunk Sci-Fi', rating: 5 },
        { title: 'There Will Be Blood', director: 'Paul Thomas Anderson', year: 2007, genre: 'Epic Period Drama', rating: 5 }
      ]
    };

    const brandLabels: Record<string, string> = {
      letterboxd: 'Letterboxd Diary',
      imdb: 'IMDb Rated Watchlist',
      trakt: 'Trakt.tv Scrobbler'
    };

    const sourceLabelMap: Record<string, MovieEntry['source']> = {
      letterboxd: 'Letterboxd',
      imdb: 'IMDb',
      trakt: 'Trakt.tv'
    };

    const toImport = mockMoviePayload[brand] || mockMoviePayload.letterboxd;
    let totalXp = 0;

    const existingTitles = new Set(movies.map(m => m.title.toLowerCase()));
    const newItems = toImport.filter(m => !existingTitles.has(m.title.toLowerCase()));
    const itemsToAdd = newItems.length > 0 ? newItems : [toImport[0]];

    const importedEntries: MovieEntry[] = itemsToAdd.map((m, idx) => {
      const xp = 2200;
      totalXp += xp;
      return {
        id: `mv_sync_${brand}_${Date.now()}_${idx}`,
        title: m.title,
        director: m.director,
        year: m.year,
        genre: m.genre,
        completedDate: new Date().toISOString().split('T')[0],
        rating: m.rating,
        xpAwarded: xp,
        source: sourceLabelMap[brand] || 'Letterboxd'
      };
    });

    setMovies(prev => [...importedEntries, ...prev]);
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, moviesWatched: prev.stats.moviesWatched + importedEntries.length }
    }));

    gainXp(totalXp, 'movies', `${brandLabels[brand]} Import`);
    sounds.playBadgeUnlock();
    confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
    setIsSyncingMovies(false);
    showToast(`🎬 Synced ${importedEntries.length} films from ${brandLabels[brand]}! +${totalXp.toLocaleString()} XP`);
    return { moviesAdded: importedEntries.length, xpGained: totalXp };
  };

  // Like & Comment
  const toggleLikePost = (postId: string) => {
    sounds.playClick();
    setFeedPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likes: hasLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      })
    );
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    sounds.playClick();
    setFeedPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [
              ...post.comments,
              {
                id: `c_${Date.now()}`,
                userName: user.name,
                text: commentText,
                timestamp: 'Just now'
              }
            ]
          };
        }
        return post;
      })
    );
  };

  // Create Milestone Post
  const createPost = (title: string, content: string, category: CategoryType) => {
    sounds.playSuccess();
    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userHandle: user.handle,
      userAvatar: user.avatar,
      userLevel: user.level,
      timestamp: 'Just now',
      category,
      title,
      content,
      xpGained: 1500,
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: []
    };
    setFeedPosts(prev => [newPost, ...prev]);
    gainXp(1500, category, 'Community Milestone Share');
    showToast('Milestone shared to social feed!');
  };

  // Chat message sending with simulated realistic replies
  const sendChatMessage = (friendId: string, text: string) => {
    if (!text.trim()) return;
    sounds.playClick();

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: 'Just now',
      isSelf: true
    };

    setChatMessages(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg]
    }));

    // Generate responsive simulated reply
    setTimeout(() => {
      let reply = 'Great effort! Consistency is everything on the path to Level 1,000.';
      const friend = friends.find(f => f.id === friendId);
      const name = friend ? friend.name : 'Friend';

      if (friendId === 'usr_marcus') {
        if (text.toLowerCase().includes('iq') || text.toLowerCase().includes('puzzle')) {
          reply = 'The key to the sequence matrix is spotting recursive doubling plus offset. Keep sharpening your deduction models.';
        } else if (text.toLowerCase().includes('book') || text.toLowerCase().includes('read')) {
          reply = 'Deep literature trains the working memory like nothing else. Have you examined the formal proofs in Chapter 4?';
        } else {
          reply = 'Ten years of dedicated mastery requires patience. Measure your daily gains by depth, not mere volume.';
        }
      } else if (friendId === 'usr_elena') {
        if (text.toLowerCase().includes('run') || text.toLowerCase().includes('strava')) {
          reply = 'Awesome! Heart rate pacing and recovery intervals make all the difference. Let’s compare weekly mileage on Strava!';
        } else {
          reply = 'Keep pushing the physical benchmark! Remember to log the calories and hydration stats.';
        }
      } else if (friendId === 'usr_sophia') {
        reply = 'The cinematographic framing in classical films holds so many cognitive layers. What movie are you reviewing next?';
      }

      sounds.playSuccess();
      const replyMsg: ChatMessage = {
        id: `m_reply_${Date.now()}`,
        senderId: friendId,
        senderName: name,
        text: reply,
        timestamp: 'Just now',
        isSelf: false
      };

      setChatMessages(prev => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), replyMsg]
      }));

      showToast(`New message from ${name}`);
    }, 1400);
  };

  // Switch between demo accounts for quick testing
  const switchProfile = (profileId: string) => {
    sounds.playClick();
    if (profileId === 'usr_marcus') {
      const marcusUser = leaderboard.find(l => l.id === 'usr_marcus');
      if (marcusUser) {
        setUser({
          id: marcusUser.id,
          name: marcusUser.name,
          handle: marcusUser.handle,
          avatar: marcusUser.avatar,
          bio: 'Theoretical Physicist, Chess Grandmaster, and Decade Polymath. Level 989.',
          level: marcusUser.level,
          xp: marcusUser.xp,
          streakDays: 820,
          yearsDedicated: 10.4,
          pillarMastery: {
            trivia: 95,
            language: 88,
            books: 98,
            movies: 82,
            fitness: 76,
            degree: 100,
            iq: 99
          },
          stats: {
            triviaSolved: 3400,
            languagesStudied: 5,
            booksRead: 640,
            moviesWatched: 410,
            kmLogged: 6200,
            degreesEarned: 3,
            iqScore: 156
          },
          connectedWearables: {
            strava: true,
            appleWatch: false,
            garmin: true,
            whoop: true,
            goodreads: true
          },
          unlockedBadgeIds: BADGES_CATALOG.map(b => b.id)
        });
        showToast('Switched to Dr. Marcus Vance (Level 989)');
      }
    } else if (profileId === 'usr_elena') {
      const elenaUser = leaderboard.find(l => l.id === 'usr_elena');
      if (elenaUser) {
        setUser({
          id: elenaUser.id,
          name: elenaUser.name,
          handle: elenaUser.handle,
          avatar: elenaUser.avatar,
          bio: 'Ultra-marathoner, mountaineer, trilingual translator. Level 742 Grandmaster.',
          level: elenaUser.level,
          xp: elenaUser.xp,
          streakDays: 412,
          yearsDedicated: 7.8,
          pillarMastery: {
            trivia: 68,
            language: 94,
            books: 76,
            movies: 60,
            fitness: 100,
            degree: 75,
            iq: 82
          },
          stats: {
            triviaSolved: 1100,
            languagesStudied: 4,
            booksRead: 280,
            moviesWatched: 190,
            kmLogged: 18400,
            degreesEarned: 2,
            iqScore: 138
          },
          connectedWearables: {
            strava: true,
            appleWatch: true,
            garmin: true,
            whoop: true,
            goodreads: false
          },
          unlockedBadgeIds: BADGES_CATALOG.slice(0, 7).map(b => b.id)
        });
        showToast('Switched to Elena Rostova (Level 742)');
      }
    } else {
      setUser(INITIAL_USER);
      showToast('Switched to Alex Hunter (Level 342)');
    }
  };

  const toggleNotificationSetting = (id: string) => {
    sounds.playClick();
    setNotificationsSettings(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const requestPushPermissions = async () => {
    sounds.playClick();
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Push notifications enabled for Ranked goal reminders!');
      } else {
        showToast('Push notification permission was declined or dismissed.');
      }
    } else {
      showToast('Push notifications enabled in browser simulator.');
    }
  };

  const dismissLevelUp = () => {
    sounds.playClick();
    setLevelUpModal(null);
  };

  // Profile Inspection Modal Handlers
  const openUserProfile = (userId: string) => {
    sounds.playClick();
    if (userId === user.id || userId === 'usr_me') {
      setInspectingUser(user);
      return;
    }

    if (USER_PROFILES_MAP[userId]) {
      setInspectingUser(USER_PROFILES_MAP[userId]);
      return;
    }

    // Fallback: build from leaderboard record
    const lb = leaderboard.find(l => l.id === userId);
    if (lb) {
      setInspectingUser({
        id: lb.id,
        name: lb.name,
        handle: lb.handle,
        avatar: lb.avatar,
        bio: `Dedicated ranked competitor in ${lb.topCategory}. Currently holding Rank #${lb.rank}.`,
        level: lb.level,
        xp: lb.xp,
        streakDays: Math.round(lb.level * 0.75),
        yearsDedicated: parseFloat((lb.level / 95).toFixed(1)),
        pillarMastery: {
          trivia: lb.topCategory === 'trivia' ? 90 : 60,
          language: lb.topCategory === 'language' ? 90 : 60,
          books: lb.topCategory === 'books' ? 90 : 60,
          movies: lb.topCategory === 'movies' ? 90 : 60,
          fitness: lb.topCategory === 'fitness' ? 90 : 60,
          degree: lb.topCategory === 'degree' ? 90 : 60,
          iq: lb.topCategory === 'iq' ? 90 : 60
        },
        stats: {
          triviaSolved: lb.level * 3,
          languagesStudied: 2,
          booksRead: Math.round(lb.level * 0.4),
          moviesWatched: Math.round(lb.level * 0.3),
          kmLogged: lb.level * 10,
          degreesEarned: lb.level > 500 ? 2 : 1,
          iqScore: 125 + Math.min(35, Math.floor(lb.level / 30))
        },
        connectedWearables: {
          strava: true,
          appleWatch: false,
          garmin: false,
          whoop: false,
          goodreads: true
        },
        unlockedBadgeIds: ['b_first_step', 'b_bookworm_50', 'b_strava_sync']
      });
    }
  };

  const closeUserProfile = () => {
    sounds.playClick();
    setInspectingUser(null);
  };

  // Online Reader Handlers
  const openReader = (book: OnlineBook, chapterIndex: number = 0) => {
    sounds.playClick();
    setActiveBookForReading(book);
    setActiveChapterIndex(chapterIndex);
  };

  const closeReader = () => {
    sounds.playClick();
    setActiveBookForReading(null);
  };

  const completeChapter = (bookId: string, chapterIndex: number) => {
    const book = onlineBooks.find(b => b.id === bookId);
    if (!book) return;

    const chapter = book.chapters[chapterIndex];
    const xp = Math.round(book.totalXp / Math.max(1, book.chapters.length));
    sounds.playSuccess();
    gainXp(xp, 'books', `Read: ${book.title} (${chapter.title})`);
    showToast(`Completed ${chapter.title}! +${xp.toLocaleString()} XP in Literature`);
  };

  // Educational Videos Academy Handlers
  const completeVideo = (videoId: string) => {
    const video = educationalVideos.find(v => v.id === videoId);
    if (!video) return;

    const isAlreadyWatched = watchedVideoIds.includes(videoId);
    const xp = isAlreadyWatched ? 600 : video.xpReward;

    if (!isAlreadyWatched) {
      const updated = [...watchedVideoIds, videoId];
      setWatchedVideoIds(updated);
      localStorage.setItem('ranked_watched_vids', JSON.stringify(updated));
    }

    sounds.playSuccess();
    gainXp(xp, video.category, `Watched: ${video.title}`);
    showToast(`Mastered "${video.title}"! +${xp.toLocaleString()} XP in ${video.knowledgeDomain}`);
  };

  return (
    <RankedContext.Provider
      value={{
        user,
        dailyQuests,
        badges,
        feedPosts,
        friends,
        activeFriendId,
        setActiveFriendId,
        chatMessages,
        sendChatMessage,
        fitnessActivities,
        books,
        movies,
        academics,
        leaderboard,
        activeTab,
        setActiveTab,
        challengePillar,
        setChallengePillar,
        userLocation,
        locationEnabled,
        enableLocation,
        toggleLocation,
        theme,
        setTheme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        levelUpModal,
        dismissLevelUp,
        toast,
        showToast,
        wearablesModalOpen,
        setWearablesModalOpen,
        notificationsModalOpen,
        setNotificationsModalOpen,
        streakModalOpen,
        setStreakModalOpen,
        androidModalOpen,
        setAndroidModalOpen,
        flutterModalOpen,
        setFlutterModalOpen,
        claimDailyStreakBonus,
        advanceStreakDaySimulated,
        notificationsSettings,
        toggleNotificationSetting,
        requestPushPermissions,
        gainXp,
        addBook,
        addMovie,
        addAcademicMilestone,
        addFitnessActivity,
        syncWearables,
        toggleWearableConnection,
        syncReadingApps,
        syncMovieApps,
        isSyncingReading,
        isSyncingMovies,
        toggleConnectedApp,
        bookForVerification,
        setBookForVerification,
        addVerifiedBook,
        toggleLikePost,
        addCommentToPost,
        createPost,
        switchProfile,
        isSyncingWearable,
        inspectingUser,
        openUserProfile,
        closeUserProfile,
        onlineBooks,
        activeBookForReading,
        activeChapterIndex,
        openReader,
        closeReader,
        completeChapter,
        educationalVideos,
        watchedVideoIds,
        completeVideo,
        masteredScienceCardIds,
        toggleMasterScienceCard
      }}
    >
      {children}
    </RankedContext.Provider>
  );
};

export const useRanked = () => {
  const context = useContext(RankedContext);
  if (!context) {
    throw new Error('useRanked must be used within a RankedProvider');
  }
  return context;
};
