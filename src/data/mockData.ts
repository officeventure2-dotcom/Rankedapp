import {
  UserProfile,
  Badge,
  DailyQuest,
  TriviaQuestion,
  IQQuestion,
  LanguageLesson,
  BookEntry,
  MovieEntry,
  AcademicMilestone,
  FitnessActivity,
  FeedPost,
  FriendContact,
  LeaderboardUser,
  NotificationSetting,
  OnlineBook,
  EducationalVideo,
  ThemePreset
} from '../types';

export const HERO_CREST_PATH = '/src/assets/images/ranked_hero_crest_1792934617606.jpg';
export const AVATAR_ELENA_PATH = '/src/assets/images/avatar_elena_1792934618640.jpg';
export const AVATAR_MARCUS_PATH = '/src/assets/images/avatar_marcus_1792934618838.jpg';
export const WEARABLE_PREVIEW_PATH = '/src/assets/images/device_wearable_preview_1792934619010.jpg';

export const INITIAL_USER: UserProfile = {
  id: 'usr_me',
  name: 'Alex Hunter',
  handle: '@alexhunter',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Endurance runner, literature explorer & language learner. Aiming for Level 500 Master rank this year.',
  level: 261,
  xp: 1245800,
  streakDays: 48,
  lastLoginDate: '2026-10-27',
  streakClaimedToday: false,
  totalStreakXpEarned: 139200,
  streakFreezeAvailable: 2,
  streakMilestonesClaimed: [7, 14, 30],
  yearsDedicated: 4.2,
  pillarMastery: {
    trivia: 58,
    language: 64,
    books: 72,
    movies: 45,
    fitness: 84,
    degree: 40,
    iq: 62
  },
  stats: {
    triviaSolved: 420,
    languagesStudied: 3,
    booksRead: 114,
    moviesWatched: 86,
    kmLogged: 2480,
    degreesEarned: 1,
    iqScore: 132
  },
  connectedWearables: {
    strava: true,
    appleWatch: true,
    garmin: false,
    whoop: false,
    goodreads: true,
    kindle: true,
    appleBooks: false,
    storyGraph: false,
    letterboxd: true,
    imdb: false,
    trakt: false
  },
  unlockedBadgeIds: ['b_first_step', 'b_bookworm_50', 'b_strava_sync', 'b_polyglot_starter', 'b_marathon_finisher', 'b_iq_sharp']
};

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'dq_1',
    title: 'Solve 1 IQ Matrix Puzzle',
    category: 'iq',
    description: 'Complete a visual pattern reasoning challenge to sharpen cognitive clarity.',
    xpReward: 1200,
    current: 0,
    target: 1,
    unit: 'puzzle',
    completed: false
  },
  {
    id: 'dq_2',
    title: 'Answer 5 Trivia Questions',
    category: 'trivia',
    description: 'Score at least 80% accuracy in the General Sciences or World History arena.',
    xpReward: 1500,
    current: 2,
    target: 5,
    unit: 'questions',
    completed: false
  },
  {
    id: 'dq_3',
    title: 'Log 5.0 km Workout',
    category: 'fitness',
    description: 'Sync your Strava or Apple Watch running or cycling session.',
    xpReward: 2000,
    current: 5.0,
    target: 5.0,
    unit: 'km',
    completed: true
  },
  {
    id: 'dq_4',
    title: 'Complete 1 Language Drill',
    category: 'language',
    description: 'Review Spanish or Japanese conversational sentence patterns.',
    xpReward: 1100,
    current: 0,
    target: 1,
    unit: 'session',
    completed: false
  }
];

export const BADGES_CATALOG: Badge[] = [
  {
    id: 'b_first_step',
    title: 'Initiate Rank',
    description: 'Completed your first verified life challenge in Ranked.',
    category: 'trivia',
    rarity: 'Common',
    xpReward: 500,
    iconName: 'Sparkles',
    requiredLevel: 1,
    unlockedAt: '2022-04-12'
  },
  {
    id: 'b_bookworm_50',
    title: 'Centurion of Pages',
    description: 'Read and logged over 100 comprehensive books across philosophy, science, and fiction.',
    category: 'books',
    rarity: 'Rare',
    xpReward: 15000,
    iconName: 'BookOpen',
    requiredLevel: 150,
    unlockedAt: '2023-11-20'
  },
  {
    id: 'b_strava_sync',
    title: 'Bio-Telemetry Connected',
    description: 'Linked Apple Watch and Strava for automated athletic proof.',
    category: 'fitness',
    rarity: 'Common',
    xpReward: 2500,
    iconName: 'Activity',
    unlockedAt: '2023-01-15'
  },
  {
    id: 'b_polyglot_starter',
    title: 'Trilingual Pioneer',
    description: 'Achieved verified B2 fluency across three distinct language families.',
    category: 'language',
    rarity: 'Rare',
    xpReward: 18000,
    iconName: 'Globe',
    requiredLevel: 200,
    unlockedAt: '2024-02-08'
  },
  {
    id: 'b_marathon_finisher',
    title: 'Sub-3:30 Marathoner',
    description: 'Completed 42.195 km official road marathon with biometric tracking.',
    category: 'fitness',
    rarity: 'Epic',
    xpReward: 45000,
    iconName: 'Flame',
    requiredLevel: 300,
    unlockedAt: '2024-09-15'
  },
  {
    id: 'b_iq_sharp',
    title: 'Mensa Caliber 130+',
    description: 'Scored in the top 2% of progressive cognitive matrices challenges.',
    category: 'iq',
    rarity: 'Epic',
    xpReward: 35000,
    iconName: 'Brain',
    requiredLevel: 320,
    unlockedAt: '2024-10-02'
  },
  {
    id: 'b_cinephile_500',
    title: 'Auteur Archive',
    description: 'Logged 250 historic world cinema masterpieces with analytical reviews.',
    category: 'movies',
    rarity: 'Rare',
    xpReward: 20000,
    iconName: 'Film',
    requiredLevel: 250
  },
  {
    id: 'b_doctorate_phd',
    title: 'Doctor of Philosophy',
    description: 'Defended a doctoral dissertation contributing original scientific knowledge to human civilization.',
    category: 'degree',
    rarity: 'Legendary',
    xpReward: 120000,
    iconName: 'GraduationCap',
    requiredLevel: 700
  },
  {
    id: 'b_ironman_triathlon',
    title: 'Iron Sovereign',
    description: '3.8km swim, 180km bike, and 42.2km run in a single competitive day.',
    category: 'fitness',
    rarity: 'Legendary',
    xpReward: 150000,
    iconName: 'Trophy',
    requiredLevel: 750
  },
  {
    id: 'b_decennial_mythic',
    title: 'The Ten-Year Apex',
    description: 'Reached Level 1000 through a full decade of deliberate polymath mastery.',
    category: 'degree',
    rarity: 'Mythic',
    xpReward: 500000,
    iconName: 'Crown',
    requiredLevel: 1000
  }
];

export const TRIVIA_BANK: TriviaQuestion[] = [
  // --- EASY DIFFICULTY ---
  {
    id: 'triv_easy_1',
    category: 'Astronomy',
    question: 'Which planet in our solar system is known as the "Red Planet" due to iron oxide on its surface?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctIndex: 1,
    explanation: 'Mars is covered with iron(III) oxide (rust), which gives its regolith and atmosphere a reddish hue.',
    difficulty: 'Easy',
    xp: 200
  },
  {
    id: 'triv_easy_2',
    category: 'Geography',
    question: 'What is the largest and deepest ocean on Earth, covering more than 30% of the planet\'s surface?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    correctIndex: 2,
    explanation: 'The Pacific Ocean spans approximately 165 million square kilometers and contains the Mariana Trench.',
    difficulty: 'Easy',
    xp: 200
  },
  {
    id: 'triv_easy_3',
    category: 'Biology',
    question: 'What is the basic fundamental unit of life in all known living organisms?',
    options: ['Atom', 'Molecule', 'Cell', 'Organ'],
    correctIndex: 2,
    explanation: 'Cells are the structural, functional, and biological units of all living organisms.',
    difficulty: 'Easy',
    xp: 180
  },
  {
    id: 'triv_easy_4',
    category: 'World History',
    question: 'In which modern-day country are the ancient Great Pyramids of Giza located?',
    options: ['Greece', 'Egypt', 'Iraq', 'Turkey'],
    correctIndex: 1,
    explanation: 'The Giza pyramid complex stands on the Giza Plateau in Greater Cairo, Egypt.',
    difficulty: 'Easy',
    xp: 180
  },
  {
    id: 'triv_easy_5',
    category: 'Computer Science',
    question: 'What does the standard hardware acronym "CPU" stand for?',
    options: ['Central Processing Unit', 'Core Power Utility', 'Computer Program Unit', 'Central Peripheral Unit'],
    correctIndex: 0,
    explanation: 'The Central Processing Unit (CPU) is the primary component that executes computer instructions and logic.',
    difficulty: 'Easy',
    xp: 220
  },
  {
    id: 'triv_easy_6',
    category: 'Literature',
    question: 'Which famous English playwright wrote "Hamlet", "Macbeth", and "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Geoffrey Chaucer'],
    correctIndex: 1,
    explanation: 'William Shakespeare (1564–1616) authored 39 plays and 154 sonnets during the Elizabethan and Jacobean eras.',
    difficulty: 'Easy',
    xp: 200
  },
  {
    id: 'triv_easy_7',
    category: 'Chemistry',
    question: 'What is the chemical formula for ordinary pure water?',
    options: ['CO2', 'NaCl', 'H2O', 'O2'],
    correctIndex: 2,
    explanation: 'Water molecules consist of two hydrogen atoms covalently bonded to a single oxygen atom (H2O).',
    difficulty: 'Easy',
    xp: 180
  },

  // --- MEDIUM DIFFICULTY ---
  {
    id: 'triv_med_1',
    category: 'Astrophysics',
    question: 'What is the theoretical boundary around a black hole beyond which nothing, not even light, can escape?',
    options: ['Schwarzschild Sphere', 'Event Horizon', 'Accretion Disk', 'Ergosphere'],
    correctIndex: 1,
    explanation: 'The event horizon is the critical threshold where the gravitational escape velocity equals the speed of light.',
    difficulty: 'Medium',
    xp: 350
  },
  {
    id: 'triv_med_2',
    category: 'Neuroscience',
    question: 'Which neurotransmitter is primarily synthesized in the Substantia Nigra and plays a critical role in motor control and reward pathways?',
    options: ['Serotonin', 'GABA', 'Dopamine', 'Acetylcholine'],
    correctIndex: 2,
    explanation: 'Dopaminergic neurons in the substantia nigra project to the striatum; their degeneration is the hallmark of Parkinson’s disease.',
    difficulty: 'Medium',
    xp: 380
  },
  {
    id: 'triv_med_3',
    category: 'Classical Literature',
    question: 'Which epic poem begins with the invocation: "Sing in me, Muse, and through me tell the story of that man skilled in all ways of contending"?',
    options: ['The Aeneid', 'The Odyssey', 'The Iliad', 'Metamorphoses'],
    correctIndex: 1,
    explanation: 'This famous translation introduces Odysseus at the opening of Homer’s epic Odyssey.',
    difficulty: 'Medium',
    xp: 360
  },
  {
    id: 'triv_med_4',
    category: 'Cellular Biology',
    question: 'Which organelle is responsible for generating adenosine triphosphate (ATP) through cellular respiration?',
    options: ['Endoplasmic Reticulum', 'Golgi Apparatus', 'Mitochondrion', 'Lysosome'],
    correctIndex: 2,
    explanation: 'Mitochondria generate the majority of chemical energy used by cellular biochemical reactions through the Krebs cycle and oxidative phosphorylation.',
    difficulty: 'Medium',
    xp: 350
  },
  {
    id: 'triv_med_5',
    category: 'World History',
    question: 'Which ruler led the Ottoman Empire during its 16th-century golden age of legal, cultural, and military expansion?',
    options: ['Mehmed II', 'Suleiman the Magnificent', 'Osman I', 'Selim I'],
    correctIndex: 1,
    explanation: 'Suleiman I, known as Suleiman the Lawgiver and the Magnificent, ruled from 1520 to 1566 over the peak of the empire.',
    difficulty: 'Medium',
    xp: 380
  },
  {
    id: 'triv_med_6',
    category: 'Philosophy',
    question: 'Which 17th-century philosopher formulated the foundational statement "Cogito, ergo sum" ("I think, therefore I am")?',
    options: ['John Locke', 'René Descartes', 'Baruch Spinoza', 'Thomas Hobbes'],
    correctIndex: 1,
    explanation: 'René Descartes used methodical doubt in "Discourse on the Method" to establish indubitable existence.',
    difficulty: 'Medium',
    xp: 350
  },
  {
    id: 'triv_med_7',
    category: 'Earth Sciences',
    question: 'What is the outermost solid mechanical layer of the Earth, encompassing the crust and uppermost mantle?',
    options: ['Asthenosphere', 'Lithosphere', 'Mesosphere', 'Outer Core'],
    correctIndex: 1,
    explanation: 'The lithosphere is the rigid outer layer divided into brittle tectonic plates.',
    difficulty: 'Medium',
    xp: 360
  },

  // --- HARD DIFFICULTY ---
  {
    id: 'triv_hard_1',
    category: 'World History',
    question: 'In what year was the Library of Alexandria reportedly damaged during Julius Caesar’s siege of Alexandria?',
    options: ['48 BC', '14 AD', '323 BC', '1453 AD'],
    correctIndex: 0,
    explanation: 'Julius Caesar inadvertently burned part of the fleet and dockside scroll warehouses in 48 BC during the Alexandrian civil war.',
    difficulty: 'Hard',
    xp: 600
  },
  {
    id: 'triv_hard_2',
    category: 'Quantum Computing',
    question: 'What quantum mechanical principle allows qubits to exist in linear combinations of |0⟩ and |1⟩ states simultaneously?',
    options: ['Quantum Tunneling', 'Superposition', 'Wave-Particle Duality', 'Quantum Zeno Effect'],
    correctIndex: 1,
    explanation: 'Superposition allows a quantum state to be described as a linear sum of basis states prior to wave function collapse.',
    difficulty: 'Hard',
    xp: 550
  },
  {
    id: 'triv_hard_3',
    category: 'Molecular Genetics',
    question: 'Which enzyme is primarily responsible for unwinding and separating the double-stranded DNA helix at the replication fork?',
    options: ['DNA Polymerase III', 'DNA Topoisomerase', 'DNA Helicase', 'DNA Ligase'],
    correctIndex: 2,
    explanation: 'DNA Helicase breaks the hydrogen bonds between complementary base pairs, unwinding the double helix.',
    difficulty: 'Hard',
    xp: 650
  },
  {
    id: 'triv_hard_4',
    category: 'Mathematics',
    question: 'What is the value of Euler\'s totient function φ(13), measuring the count of positive integers up to 13 that are coprime to 13?',
    options: ['11', '12', '13', '6'],
    correctIndex: 1,
    explanation: 'For any prime p, Euler\'s totient function φ(p) = p - 1. Since 13 is prime, φ(13) = 12.',
    difficulty: 'Hard',
    xp: 650
  },
  {
    id: 'triv_hard_5',
    category: 'Economics',
    question: 'What economic term describes an inferior good whose demand paradoxically increases as its price rises due to an extreme income effect?',
    options: ['Veblen Good', 'Giffen Good', 'Public Good', 'Club Good'],
    correctIndex: 1,
    explanation: 'A Giffen good is a non-luxury product for which an increase in price causes an increase in consumption due to lack of close substitutes.',
    difficulty: 'Hard',
    xp: 620
  },
  {
    id: 'triv_hard_6',
    category: 'Astrophysics',
    question: 'What is the boundary where the supersonic solar wind abruptly decelerates below the speed of sound upon encountering interstellar gas?',
    options: ['Bow Shock', 'Termination Shock', 'Heliopause', 'Oort Cloud'],
    correctIndex: 1,
    explanation: 'The termination shock is the boundary where solar wind particles drop to subsonic speeds (~75-90 AU from the Sun).',
    difficulty: 'Hard',
    xp: 700
  },
  {
    id: 'triv_hard_7',
    category: 'World Architecture',
    question: 'Which Byzantine Emperor commissioned the reconstruction of the grand Hagia Sophia in Constantinople following the Nika riots in 532 AD?',
    options: ['Constantine the Great', 'Justinian I', 'Heraclius', 'Basil II'],
    correctIndex: 1,
    explanation: 'Emperor Justinian I hired physicists/geometers Isidore of Miletus and Anthemius of Tralles to build the Hagia Sophia.',
    difficulty: 'Hard',
    xp: 600
  },

  // --- GRANDMASTER DIFFICULTY ---
  {
    id: 'triv_gm_1',
    category: 'Theoretical Physics',
    question: 'In the Einstein field equations G_μν + Λg_μν = (8πG/c^4) T_μν, what does the tensor T_μν represent?',
    options: ['Ricci Curvature Tensor', 'Stress-Energy-Momentum Tensor', 'Metric Tensor', 'Weyl Curvature Tensor'],
    correctIndex: 1,
    explanation: 'T_μν is the stress-energy tensor describing the density and flux of energy, momentum, shear stress, and pressure in spacetime.',
    difficulty: 'Grandmaster',
    xp: 1000
  },
  {
    id: 'triv_gm_2',
    category: 'Epistemology',
    question: 'In 1963, Edmund Gettier famously published counterexamples demonstrating that knowledge cannot simply be defined as what?',
    options: ['Empirically Verifiable Truth', 'Justified True Belief (JTB)', 'Pragmatic Coherence', 'Synthetic A Priori Judgment'],
    correctIndex: 1,
    explanation: 'Gettier problems demonstrate scenarios where someone holds a belief that is both true and justified, yet true only by coincidence.',
    difficulty: 'Grandmaster',
    xp: 950
  },
  {
    id: 'triv_gm_3',
    category: 'Particle Physics',
    question: 'In the Standard Model, which gauge bosons mediate the weak nuclear force responsible for radioactive beta decay?',
    options: ['Gluons', 'W+, W-, and Z0 Bosons', 'Photons', 'Gravitons'],
    correctIndex: 1,
    explanation: 'The weak interaction is mediated by the massive intermediate vector bosons W+, W-, and Z0 discovered at CERN in 1983.',
    difficulty: 'Grandmaster',
    xp: 900
  },
  {
    id: 'triv_gm_4',
    category: 'Organic Chemistry',
    question: 'Which palladium-catalyzed cross-coupling reaction couples an aryl- or vinyl-boronic acid with an aryl- or vinyl-halide?',
    options: ['Heck Reaction', 'Sonogashira Coupling', 'Suzuki-Miyaura Reaction', 'Stille Coupling'],
    correctIndex: 2,
    explanation: 'The Suzuki-Miyaura reaction won the 2010 Nobel Prize in Chemistry for its mild conditions and use of organoboron reagents.',
    difficulty: 'Grandmaster',
    xp: 1100
  },
  {
    id: 'triv_gm_5',
    category: 'European History',
    question: 'Signed in 1648, the Peace of Westphalia established the modern sovereign state system while concluding which devastating conflict?',
    options: ['The War of the Spanish Succession', 'The Seven Years\' War', 'The Thirty Years\' War', 'The Hundred Years\' War'],
    correctIndex: 2,
    explanation: 'The Peace of Westphalia (treaties of Osnabrück and Münster) concluded the Thirty Years\' War in the Holy Roman Empire.',
    difficulty: 'Grandmaster',
    xp: 950
  },
  {
    id: 'triv_gm_6',
    category: 'Number Theory',
    question: 'Which famous unproven conjecture states that every even integer greater than 2 can be expressed as the sum of two prime numbers?',
    options: ['Riemann Hypothesis', 'Goldbach\'s Conjecture', 'Collatz Conjecture', 'Twin Prime Conjecture'],
    correctIndex: 1,
    explanation: 'Goldbach\'s Conjecture, formulated in Christian Goldbach\'s 1742 letter to Leonhard Euler, remains unproven for all integers.',
    difficulty: 'Grandmaster',
    xp: 1050
  },
  {
    id: 'triv_gm_7',
    category: 'Cellular Biochemistry',
    question: 'In the mitochondrial electron transport chain, which complex directly transfers electrons to molecular oxygen, reducing it to water?',
    options: ['Complex I (NADH dehydrogenase)', 'Complex II (Succinate dehydrogenase)', 'Complex III (Cytochrome bc1)', 'Complex IV (Cytochrome c oxidase)'],
    correctIndex: 3,
    explanation: 'Complex IV (cytochrome c oxidase) transfers electrons from cytochrome c to O2, pumping protons across the inner mitochondrial membrane.',
    difficulty: 'Grandmaster',
    xp: 1200
  }
];

export const IQ_QUESTIONS_BANK: IQQuestion[] = [
  {
    id: 'iq_1',
    prompt: 'Matrix Pattern Sequence: [3 → 8 → 18 → 38 → ?]. Which integer completes the recursive function?',
    visualMatrix: ['3', '8', '18', '38', '?', '158'],
    options: ['74', '78', '82', '88'],
    correctIndex: 1,
    logicExplanation: 'Formula is x_{n+1} = (x_n * 2) + 2. (3*2+2=8, 8*2+2=18, 18*2+2=38, 38*2+2=78, 78*2+2=158).',
    iqWeight: 3,
    xp: 850
  },
  {
    id: 'iq_2',
    prompt: 'Spatial Rotation & Complement: A solid 3D cube has faces painted with symbols (▲, ◆, ●, ★, ✕, ⬡). If ▲ is opposite ★, and ◆ is opposite ✕, what is opposite ●?',
    visualMatrix: ['▲ ↔ ★', '◆ ↔ ✕', '● ↔ ?'],
    options: ['✕', '⬡', '▲', '◆'],
    correctIndex: 1,
    logicExplanation: 'Standard cube has 3 pairs of opposite faces. Since ▲↔★ and ◆↔✕ are fixed, the remaining pair must be ●↔⬡.',
    iqWeight: 2,
    xp: 650
  },
  {
    id: 'iq_3',
    prompt: 'Analogical Deduction: EPIDEMIOLOGY is to VIRUS as SEISMOLOGY is to:',
    options: ['Tectonic Fault', 'Atmospheric Cyclone', 'Magma Chamber', 'Ocean Current'],
    correctIndex: 0,
    logicExplanation: 'Epidemiology investigates the transmission and source agents of disease (viruses); seismology investigates earthquake genesis along tectonic faults.',
    iqWeight: 3,
    xp: 750
  },
  {
    id: 'iq_4',
    prompt: 'Numerical Matrix Grid: Row 1: [4, 7, 28]. Row 2: [6, 9, 54]. Row 3: [8, 12, ?]. What is the missing product?',
    visualMatrix: ['[4, 7, 28]', '[6, 9, 54]', '[8, 12, ?]'],
    options: ['92', '96', '104', '88'],
    correctIndex: 1,
    logicExplanation: 'The third cell in each row is the product of the first two: 8 × 12 = 96.',
    iqWeight: 2,
    xp: 600
  }
];

export const LANGUAGE_LESSONS: LanguageLesson[] = [
  {
    id: 'lang_1',
    language: 'Spanish',
    flag: '🇪🇸',
    level: 'B2 Advanced',
    prompt: 'Select the correct subjunctive mood for expressing doubt:',
    translationTask: '"Dudo que ellos ______ a tiempo con este tráfico."',
    options: ['llegan', 'lleguen', 'llegarán', 'llegaron'],
    correctIndex: 1,
    xp: 450
  },
  {
    id: 'lang_2',
    language: 'Japanese',
    flag: '🇯🇵',
    level: 'N3 Intermediate',
    prompt: 'Which particle indicates reason or cause in polite discourse?',
    translationTask: '"雨が降った_____、試合は中止になりました。"',
    options: ['ので (node)', 'のに (noni)', 'でも (demo)', 'より (yori)'],
    correctIndex: 0,
    xp: 500
  },
  {
    id: 'lang_3',
    language: 'German',
    flag: '🇩🇪',
    level: 'B1 Intermediate',
    prompt: 'Complete the sentence with the correct relative pronoun in dative case:',
    translationTask: '"Der Mann, _____ ich geholfen habe, ist mein Professor."',
    options: ['den', 'dem', 'dessen', 'der'],
    correctIndex: 1,
    xp: 450
  },
  {
    id: 'lang_4',
    language: 'Mandarin',
    flag: '🇨🇳',
    level: 'HSK 4',
    prompt: 'Identify the measure word used for vehicles or bicycles:',
    translationTask: '"他昨天买了一_____新自行车。"',
    options: ['辆 (liàng)', '本 (běn)', '张 (zhāng)', '件 (jiàn)'],
    correctIndex: 0,
    xp: 500
  }
];

export const INITIAL_BOOKS: BookEntry[] = [
  {
    id: 'bk_1',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    pages: 499,
    genre: 'Cognitive Psychology',
    completedDate: '2024-03-14',
    rating: 5,
    xpAwarded: 5200
  },
  {
    id: 'bk_2',
    title: 'Gödel, Escher, Bach: An Eternal Golden Braid',
    author: 'Douglas Hofstadter',
    pages: 777,
    genre: 'Philosophy & Math',
    completedDate: '2024-06-20',
    rating: 5,
    xpAwarded: 9500
  },
  {
    id: 'bk_3',
    title: 'Dune',
    author: 'Frank Herbert',
    pages: 688,
    genre: 'Science Fiction',
    completedDate: '2024-08-02',
    rating: 5,
    xpAwarded: 7100
  }
];

export const INITIAL_MOVIES: MovieEntry[] = [
  {
    id: 'mv_1',
    title: '2001: A Space Odyssey',
    director: 'Stanley Kubrick',
    year: 1968,
    genre: 'Sci-Fi / Philosophical',
    completedDate: '2024-01-22',
    rating: 5,
    xpAwarded: 2400
  },
  {
    id: 'mv_2',
    title: 'Seven Samurai',
    director: 'Akira Kurosawa',
    year: 1954,
    genre: 'Action Drama / Epic',
    completedDate: '2024-04-18',
    rating: 5,
    xpAwarded: 2600
  },
  {
    id: 'mv_3',
    title: 'Oppenheimer',
    director: 'Christopher Nolan',
    year: 2023,
    genre: 'Biographical Drama',
    completedDate: '2024-07-10',
    rating: 5,
    xpAwarded: 2200
  }
];

export const INITIAL_ACADEMICS: AcademicMilestone[] = [
  {
    id: 'ac_1',
    title: 'B.S. in Computer Science & Applied Mathematics',
    institution: 'University of Washington',
    field: 'Algorithms & Discrete Math',
    type: 'Bachelor',
    yearCompleted: 2021,
    xpAwarded: 60000
  },
  {
    id: 'ac_2',
    title: 'AWS Certified Solutions Architect – Professional',
    institution: 'Amazon Web Services',
    field: 'Distributed Cloud Systems',
    type: 'Professional Certification',
    yearCompleted: 2023,
    xpAwarded: 15000
  }
];

export const INITIAL_FITNESS: FitnessActivity[] = [
  {
    id: 'fit_1',
    type: 'Run',
    title: 'Morning Lake Loop Tempo Run',
    distanceKm: 12.4,
    durationMinutes: 58,
    caloriesBurned: 840,
    source: 'Strava',
    timestamp: '2026-10-24 07:15',
    xpAwarded: 3200
  },
  {
    id: 'fit_2',
    type: 'Strength',
    title: 'Heavy Deadlift & Barbell Complex',
    durationMinutes: 70,
    caloriesBurned: 520,
    source: 'Apple Watch',
    timestamp: '2026-10-23 18:30',
    xpAwarded: 2600
  },
  {
    id: 'fit_3',
    type: 'Cycle',
    title: 'Hill Repeat Climb & Endurance',
    distanceKm: 42.0,
    durationMinutes: 94,
    caloriesBurned: 1150,
    source: 'Garmin',
    timestamp: '2026-10-21 09:00',
    xpAwarded: 4800
  }
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    userId: 'usr_marcus',
    userName: 'Dr. Marcus Vance',
    userHandle: '@marcus_vance',
    userAvatar: AVATAR_MARCUS_PATH,
    userLevel: 989,
    timestamp: '2 hours ago',
    category: 'degree',
    title: 'New Peer-Reviewed Paper Published in Nature Physics',
    content: 'After 3 years of rigorous validation across European particle accelerators, our team verified topological invariants in non-Abelian anyon systems. Added milestone: +25,000 XP towards Level 990!',
    xpGained: 25000,
    badgeUnlocked: 'The Ten-Year Apex',
    likes: 184,
    hasLiked: true,
    commentsCount: 28,
    comments: [
      {
        id: 'c_1',
        userName: 'Elena Rostova',
        text: 'Monumental work Marcus! Less than 11 levels away from Level 1,000 Mythic status.',
        timestamp: '1 hour ago'
      },
      {
        id: 'c_2',
        userName: 'Alex Hunter',
        text: 'True inspiration. That ten-year grind embodies what Ranked is all about.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'usr_elena',
    userName: 'Elena Rostova',
    userHandle: '@elena_run',
    userAvatar: AVATAR_ELENA_PATH,
    userLevel: 742,
    timestamp: '5 hours ago',
    category: 'fitness',
    title: 'Ultra-Trail Marathon 50km Completed via Strava',
    content: '50.2 km across the Alpine ridge with 2,400m elevation gain. Strava auto-synced the biometrics. Heart rate stayed disciplined in Zone 3 throughout.',
    xpGained: 18400,
    badgeUnlocked: 'Sub-3:30 Marathoner',
    likes: 92,
    hasLiked: false,
    commentsCount: 14,
    comments: [
      {
        id: 'c_3',
        userName: 'Alex Hunter',
        text: 'Incredible pace on that technical terrain Elena!',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'usr_me',
    userName: 'Alex Hunter',
    userHandle: '@alexhunter',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userLevel: 342,
    timestamp: '1 day ago',
    category: 'books',
    title: 'Completed Douglas Hofstadter’s "Gödel, Escher, Bach"',
    content: '777 pages of profound reflections on formal systems, self-reference, and artificial intelligence. Level 342 reached with +9,500 XP!',
    xpGained: 9500,
    badgeUnlocked: 'Centurion of Pages',
    likes: 46,
    hasLiked: true,
    commentsCount: 6,
    comments: [
      {
        id: 'c_4',
        userName: 'Dr. Marcus Vance',
        text: 'A foundational masterpiece. Try Hofstadter’s "I Am a Strange Loop" next.',
        timestamp: '18 hours ago'
      }
    ]
  }
];

export const INITIAL_FRIENDS: FriendContact[] = [
  {
    id: 'usr_marcus',
    name: 'Dr. Marcus Vance',
    handle: '@marcus_vance',
    avatar: AVATAR_MARCUS_PATH,
    level: 989,
    status: 'online',
    sharedInterests: ['Physics', 'Chess', 'Philosophy', 'IQ Puzzles'],
    lastMessage: 'Let me know when you attempt today’s matrix reasoning sequence.',
    unreadCount: 1
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    handle: '@elena_run',
    avatar: AVATAR_ELENA_PATH,
    level: 742,
    status: 'in_challenge',
    sharedInterests: ['Ultra Running', 'German', 'Strava', 'Endurance'],
    lastMessage: 'Synced my Strava 50k run! Are you logging a weekend long run?',
    unreadCount: 0
  },
  {
    id: 'usr_sophia',
    name: 'Sophia Chen',
    handle: '@sophia_cinema',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    level: 518,
    status: 'online',
    sharedInterests: ['Film Theory', 'Cognitive Science', 'Mandarin'],
    lastMessage: 'Kubrick’s visual pacing is unmatched. Have you added Barry Lyndon yet?',
    unreadCount: 2
  },
  {
    id: 'usr_liam',
    name: 'Liam O’Connor',
    handle: '@liam_trivia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level: 634,
    status: 'offline',
    sharedInterests: ['World Trivia', 'Powerlifting', 'History'],
    lastMessage: 'Good trivia duel yesterday! Your astrophysics score was sharp.',
    unreadCount: 0
  }
];

export const INITIAL_CHAT_HISTORIES: Record<string, Array<{
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}>> = {
  usr_marcus: [
    {
      id: 'm1',
      senderId: 'usr_marcus',
      senderName: 'Dr. Marcus Vance',
      text: 'Alex, I noticed you logged Hofstadter’s GEB. Exceptional dedication.',
      timestamp: 'Yesterday at 4:15 PM',
      isSelf: false
    },
    {
      id: 'm2',
      senderId: 'usr_me',
      senderName: 'Alex Hunter',
      text: 'Thank you Marcus! Your Level 989 benchmark is mind-blowing. Reaching Level 1000 really is a 10-year journey.',
      timestamp: 'Yesterday at 4:22 PM',
      isSelf: true
    },
    {
      id: 'm3',
      senderId: 'usr_marcus',
      senderName: 'Dr. Marcus Vance',
      text: 'Indeed. It takes deliberate daily practice across intellectual and physical pillars. Let me know when you attempt today’s matrix reasoning sequence.',
      timestamp: 'Today at 8:40 AM',
      isSelf: false
    }
  ],
  usr_elena: [
    {
      id: 'e1',
      senderId: 'usr_elena',
      senderName: 'Elena Rostova',
      text: 'Hey Alex! Just saw your 12.4km morning run synced from Strava.',
      timestamp: 'Yesterday at 8:05 AM',
      isSelf: false
    },
    {
      id: 'e2',
      senderId: 'usr_me',
      senderName: 'Alex Hunter',
      text: 'Thanks Elena! Pushed for a solid tempo. Seeing your 50k Alpine run motivated me.',
      timestamp: 'Yesterday at 8:30 AM',
      isSelf: true
    },
    {
      id: 'e3',
      senderId: 'usr_elena',
      senderName: 'Elena Rostova',
      text: 'Synced my Strava 50k run! Are you logging a weekend long run?',
      timestamp: 'Today at 6:15 AM',
      isSelf: false
    }
  ],
  usr_sophia: [
    {
      id: 's1',
      senderId: 'usr_sophia',
      senderName: 'Sophia Chen',
      text: 'Did you catch 2001: A Space Odyssey on the 70mm re-release?',
      timestamp: '2 days ago',
      isSelf: false
    },
    {
      id: 's2',
      senderId: 'usr_sophia',
      senderName: 'Sophia Chen',
      text: 'Kubrick’s visual pacing is unmatched. Have you added Barry Lyndon yet?',
      timestamp: 'Today at 9:10 AM',
      isSelf: false
    }
  ]
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'usr_marcus',
    name: 'Dr. Marcus Vance',
    handle: '@marcus_vance',
    avatar: AVATAR_MARCUS_PATH,
    level: 989,
    xp: 24371000,
    tier: 'Mythic',
    topCategory: 'degree',
    isFriend: true
  },
  {
    rank: 2,
    id: 'usr_soren',
    name: 'Søren Lindqvist',
    handle: '@lindqvist_master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    level: 954,
    xp: 22430000,
    tier: 'Mythic',
    topCategory: 'iq',
    isFriend: false
  },
  {
    rank: 3,
    id: 'usr_aiko',
    name: 'Aiko Tanaka',
    handle: '@aiko_polymath',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    level: 912,
    xp: 20260000,
    tier: 'Apex',
    topCategory: 'language',
    isFriend: false
  },
  {
    rank: 4,
    id: 'usr_elena',
    name: 'Elena Rostova',
    handle: '@elena_run',
    avatar: AVATAR_ELENA_PATH,
    level: 742,
    xp: 12683000,
    tier: 'Grandmaster',
    topCategory: 'fitness',
    isFriend: true
  },
  {
    rank: 5,
    id: 'usr_liam',
    name: 'Liam O’Connor',
    handle: '@liam_trivia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level: 634,
    xp: 8800000,
    tier: 'Master',
    topCategory: 'trivia',
    isFriend: true
  },
  {
    rank: 6,
    id: 'usr_sophia',
    name: 'Sophia Chen',
    handle: '@sophia_cinema',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    level: 518,
    xp: 5620000,
    tier: 'Master',
    topCategory: 'movies',
    isFriend: true
  },
  {
    rank: 7,
    id: 'usr_me',
    name: 'Alex Hunter (You)',
    handle: '@alexhunter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 261,
    xp: 1245800,
    tier: 'Expert',
    topCategory: 'fitness',
    isFriend: true,
    isCurrentUser: true
  },
  {
    rank: 8,
    id: 'usr_tariq',
    name: 'Tariq Al-Mansoor',
    handle: '@tariq_books',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    level: 215,
    xp: 830350,
    tier: 'Adept',
    topCategory: 'books',
    isFriend: false
  },
  {
    rank: 9,
    id: 'usr_nadia',
    name: 'Nadia Volkov',
    handle: '@nadia_iq',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    level: 162,
    xp: 469400,
    tier: 'Adept',
    topCategory: 'iq',
    isFriend: false
  },
  {
    rank: 10,
    id: 'usr_kofi',
    name: 'Kofi Mensah',
    handle: '@kofi_runner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    level: 115,
    xp: 243970,
    tier: 'Adept',
    topCategory: 'fitness',
    isFriend: false
  }
];

export const INITIAL_NOTIFICATIONS_SETTINGS: NotificationSetting[] = [
  {
    id: 'daily_streak',
    label: 'Daily Streak Saver',
    description: 'Alert me at 8:00 PM if my daily goal is incomplete to preserve my active streak.',
    enabled: true,
    time: '20:00'
  },
  {
    id: 'friend_overtake',
    label: 'Leaderboard Rivalry Alert',
    description: 'Notify me when a friend passes my level on the global or division leaderboard.',
    enabled: true
  },
  {
    id: 'wearable_sync',
    label: 'Wearable Sync Confirmation',
    description: 'Instant notification whenever Strava or Apple Watch records a new workout.',
    enabled: true
  },
  {
    id: 'chat_messages',
    label: 'Friend Direct Messages',
    description: 'Real-time alert when friends message about books, fitness, or quizzes.',
    enabled: true
  }
];

export const ONLINE_BOOKS_LIBRARY: OnlineBook[] = [
  {
    id: 'book_meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 180,
    genre: 'Stoic Philosophy',
    coverColor: '#b45309',
    pages: 240,
    description: 'The personal writings of the Roman Emperor outlining Stoic principles on resilience, internal dominion, and mortality.',
    totalXp: 8500,
    chapters: [
      {
        id: 'med_ch1',
        chapterNumber: 1,
        title: 'Book II: On Daily Human Nature & Focus',
        estimatedMinutes: 6,
        content: [
          'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.',
          'But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine.',
          'None of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my kin, or hate him. We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is unnatural.',
          'Do every act of your life as if it were your last, freed from all lack of purpose, from all deviation that your intellect might allow from the rule of reason, and free from insincerity, self-love, and discontent with the portion which has been allotted to you.'
        ]
      },
      {
        id: 'med_ch2',
        chapterNumber: 2,
        title: 'Book IV: The Citadel of the Rational Soul',
        estimatedMinutes: 8,
        content: [
          'People look for retreats for themselves, in the country, by the coast, or in the hills. There is nowhere that a person can find a more peaceful and trouble-free retreat than in his own mind.',
          'Constantly give yourself this retreat, and renew yourself. Let your basic principles be brief and fundamental, so that at once they will purify your thoughts and send you back without irritation to whatever awaits you.',
          'Remember: Matter: how tiny your share of it. Time: how brief and fleeting your allotment of it. Destiny: how small a role you play in it.',
          'Never regard something as beneficial to yourself that will one day compel you to break your promise, to lose your self-respect, to hate any person, or to desire anything that needs walls and curtains.'
        ]
      }
    ]
  },
  {
    id: 'book_relativity',
    title: 'Relativity: The Special and General Theory',
    author: 'Albert Einstein',
    year: 1916,
    genre: 'Theoretical Physics',
    coverColor: '#1d4ed8',
    pages: 188,
    description: 'Albert Einstein’s original exposition written for thinkers who possess an interest in physics and mathematical logic.',
    totalXp: 9200,
    chapters: [
      {
        id: 'rel_ch1',
        chapterNumber: 1,
        title: 'Physical Meaning of Geometrical Propositions',
        estimatedMinutes: 7,
        content: [
          'In your school days, geometry was presented as a collection of fixed theorems, logically deduced from axioms. You were taught that two points determine a line, that parallel lines never meet, and that the sum of angles in a triangle is two right angles.',
          'However, the moment we ask: "Are these propositions true in actual physical nature?", geometry ceases to be mere formal mathematics and becomes an empirical physical science.',
          'If we place two rigid measuring rods together, do they behave according to Euclidean geometry regardless of gravitational fields or velocity? Physics must answer this through experimental measurement rather than mathematical convenience.'
        ]
      },
      {
        id: 'rel_ch2',
        chapterNumber: 2,
        title: 'The Invariance of the Speed of Light in Vacuo',
        estimatedMinutes: 9,
        content: [
          'Classical mechanics assumes that velocities add together linearly. If a train moves at speed v, and a passenger inside throws a stone forwards with speed w relative to the carriage, classical intuition asserts that an observer on the platform measures the speed as v + w.',
          'Yet the fundamental laws of Maxwellian electrodynamics state that light in empty space propagates with a constant velocity c = 300,000 km/s in all directions, independent of the motion of the emitting source.',
          'How can this constancy of the speed of light be reconciled with the principle of relativity? The resolution requires nothing less than a radical overthrow of our traditional concepts of absolute time and simultaneous events.'
        ]
      }
    ]
  },
  {
    id: 'book_art_of_war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    year: -500,
    genre: 'Strategy & Game Theory',
    coverColor: '#b91c1c',
    pages: 160,
    description: 'Ancient tactical treatise on resource allocation, psychological momentum, strategic terrain, and disciplined execution.',
    totalXp: 7400,
    chapters: [
      {
        id: 'aow_ch1',
        chapterNumber: 1,
        title: 'Laying Plans: The Five Fundamental Factors',
        estimatedMinutes: 6,
        content: [
          'The art of war is of vital importance to the state. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.',
          'The art of war, then, is governed by five constant factors, to be taken into account in one\'s deliberations when seeking to determine the conditions obtaining in the field: The Moral Law, Heaven, Earth, The Commander, and Method and Discipline.',
          'All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.',
          'Hold out baits to entice the enemy. Feign disorder, and crush him. If he is secure at all points, be prepared for him. If he is in superior strength, evade him.'
        ]
      },
      {
        id: 'aow_ch2',
        chapterNumber: 2,
        title: 'Strategic Dispositions & Formless Flow',
        estimatedMinutes: 7,
        content: [
          'Sun Tzu said: The good fighters of old first put themselves beyond the possibility of defeat, and then waited for an opportunity of defeating the enemy.',
          'To secure ourselves against defeat lies in our own hands, but the opportunity of defeating the enemy is provided by the enemy himself.',
          'Hence the skillful fighter puts himself into a position which makes defeat impossible, and does not miss the moment for defeating the enemy.',
          'Military tactics are like unto water; for water in its natural course runs away from high places and hastens downwards. So in war, the way is to avoid what is strong and to strike at what is weak.'
        ]
      }
    ]
  },
  {
    id: 'book_beyond_good_evil',
    title: 'Beyond Good and Evil',
    author: 'Friedrich Nietzsche',
    year: 1886,
    genre: 'Philosophy & Psychology',
    coverColor: '#4338ca',
    pages: 280,
    description: 'A relentless critique of traditional dogmatism, exposing the subconscious psychological motivations behind human intellect.',
    totalXp: 9600,
    chapters: [
      {
        id: 'bge_ch1',
        chapterNumber: 1,
        title: 'On the Prejudices of Philosophers',
        estimatedMinutes: 8,
        content: [
          'The Will to Truth, which is to tempt us to many a hazardous enterprise, the famous Truthfulness of which all philosophers have hitherto spoken with respect, what questions has this Will to Truth not laid before us!',
          'What strange, perplexing, questionable questions! Is it any wonder if we at last grow distrustful, lose patience, and turn impatiently away? Untruth as a condition of life: that is certainly to impugn the traditional ideas of value in a perilous manner.',
          'Most of the conscious thinking of a philosopher is secretly guided and forced into definite channels by his instincts. Behind all logic and its seeming sovereignty of movement, there are valuations, or to speak more plainly, physiological demands for the maintenance of a definite mode of life.'
        ]
      }
    ]
  }
];

export const EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  {
    id: 'vid_neural_networks',
    youtubeId: 'aircAruvnKk',
    title: 'But what is a neural network? | Chapter 1, Deep Learning',
    channel: '3Blue1Brown',
    category: 'iq',
    knowledgeDomain: 'Machine Learning & Mathematics',
    durationMinutes: 19,
    description: 'Grant Sanderson provides an intuitive visual foundation for artificial neural networks, weights, biases, and activation matrices.',
    xpReward: 3500,
    takeaways: [
      'Neurons hold numbers between 0 and 1 representing layer activations.',
      'Hidden layers assemble lower-level features (e.g. edges, loops) into higher abstraction representations.',
      'Weights and biases form a vast high-dimensional landscape optimized through gradient descent.'
    ],
    quizQuestions: [
      {
        id: 'nn_q1',
        question: 'In this visual framework, what does an individual neuron’s activation value fundamentally represent?',
        options: [
          'A real number typically bounded between 0 and 1',
          'A physical electric pulse measured in millivolts',
          'A strictly binary 0 or 1 bit with no intermediate state',
          'A random cryptographic seed value'
        ],
        correctIndex: 0,
        explanation: 'In artificial neural networks, each neuron holds an activation scalar (often normalized between 0 and 1 via Sigmoid, ReLU, or GeLU).',
        xpReward: 600
      },
      {
        id: 'nn_q2',
        question: 'How do hidden layers in a deep neural network process visual recognition tasks like identifying handwritten digits?',
        options: [
          'By memorizing exact pixel coordinates in a lookup hash table',
          'By hierarchically composing simple edges and loops into higher-level abstract patterns',
          'By randomly shuffling pixel brightness values until an answer emerges',
          'By calculating the average color of the screen'
        ],
        correctIndex: 1,
        explanation: 'Deep networks build hierarchical abstractions: early layers detect lines/edges, subsequent layers combine them into loops or strokes, and final layers detect complete numerals.',
        xpReward: 700
      }
    ]
  },
  {
    id: 'vid_quantum_bell',
    youtubeId: 'ZuvK-464fL0',
    title: 'The Quantum Conspiracy: What Einstein Got Wrong About Reality',
    channel: 'Veritasium',
    category: 'degree',
    knowledgeDomain: 'Quantum Mechanics & Foundations',
    durationMinutes: 24,
    description: 'Exploration of Bell’s Theorem, quantum entanglement, and the experimental proof that our universe cannot be both local and real.',
    xpReward: 4200,
    takeaways: [
      'Einstein, Podolsky, and Rosen (EPR) argued that quantum mechanics was incomplete due to spooky action at a distance.',
      'John Bell formulated an inequality testable by experiment to distinguish local hidden variables from quantum mechanics.',
      'Alain Aspect and subsequent Nobel-prize experiments proved that locality and counterfactual definiteness cannot coexist.'
    ],
    quizQuestions: [
      {
        id: 'bell_q1',
        question: 'What core philosophical position did Albert Einstein defend in the famous 1935 EPR paradox paper?',
        options: [
          'Local Realism: objects have definite pre-existing properties and cannot influence each other faster than light',
          'That mathematics is fundamentally incompatible with astrophysics',
          'That light does not travel as photons in vacuum',
          'That quantum computers could never be engineered'
        ],
        correctIndex: 0,
        explanation: 'Einstein defended Local Realism—the conviction that physical values exist independent of measurement and that causal influences respect the speed of light.',
        xpReward: 800
      },
      {
        id: 'bell_q2',
        question: 'What did John Stewart Bell prove with his mathematical theorem and inequality?',
        options: [
          'That the speed of light varies based on the observer’s mass',
          'A measurable statistical threshold that no local hidden variable theory can exceed, which quantum entanglement violates',
          'That gravity and electromagnetism are identical at high temperatures',
          'That particles do not exist before the Big Bang'
        ],
        correctIndex: 1,
        explanation: 'Bell proved that any physical theory constrained by local realism has an upper limit on entangled correlations. Decades of Nobel-winning tests show nature violates this bound.',
        xpReward: 900
      }
    ]
  },
  {
    id: 'vid_brain_consciousness',
    youtubeId: '75d_29Q156o',
    title: 'What Are You? (Consciousness & The Brain)',
    channel: 'Kurzgesagt – In a Nutshell',
    category: 'trivia',
    knowledgeDomain: 'Cognitive Neuroscience & Philosophy',
    durationMinutes: 12,
    description: 'An inquiry into biological split-brain patients, hemispherectomy, neuroplasticity, and what constitutes the unified conscious self.',
    xpReward: 2800,
    takeaways: [
      'Cutting the corpus callosum produces two independent processing spheres with distinct preferences and abilities.',
      'The human brain is a distributed colony of 86 billion neurons orchestrating a continuous narrative simulation.',
      'Neuroplasticity allows human working memory and physical skill to expand through deliberate practice.'
    ],
    quizQuestions: [
      {
        id: 'brain_q1',
        question: 'What medical procedure performed to treat severe epilepsy famously revealed dual conscious spheres in humans?',
        options: [
          'Frontal lobe ablation',
          'Severing the Corpus Callosum (split-brain surgery)',
          'Removal of the pituitary gland',
          'Cerebellar bypass'
        ],
        correctIndex: 1,
        explanation: 'Severing the corpus callosum prevented seizures from crossing hemispheres, but experimental tests revealed that both cerebral hemispheres could process perceptions and make decisions independently.',
        xpReward: 500
      },
      {
        id: 'brain_q2',
        question: 'What neurobiological property allows deliberate cognitive practice to strengthen neural networks over a decade?',
        options: [
          'Neuroplasticity: the brain’s ability to structurally rewire synaptic strengths and pathways through repeated use',
          'Cellular crystallization of white matter',
          'Constant expansion of overall skull volume',
          'Static unalterable genetic wiring'
        ],
        correctIndex: 0,
        explanation: 'Neuroplasticity enables neurons to adjust their connectivity and efficiency in response to continuous learning, study, and physical exercise.',
        xpReward: 600
      }
    ]
  },
  {
    id: 'vid_crash_history',
    youtubeId: 'Yocja_N5s1I',
    title: 'The Agricultural Revolution: Crash Course World History #1',
    channel: 'CrashCourse (John Green)',
    category: 'trivia',
    knowledgeDomain: 'Anthropology & World History',
    durationMinutes: 11,
    description: 'How the transition from hunter-gatherer foraging to sedentary farming transformed social hierarchy, mathematics, and metallurgy.',
    xpReward: 2400,
    takeaways: [
      'Agriculture arose independently in the Fertile Crescent, Yangtze River basin, Indus Valley, and Mesoamerica.',
      'Surplus caloric storage enabled specialization of labor, legal codes, and monumental architecture.',
      'Early agrarian societies experienced increased disease burden and nutritional narrowing before technological maturation.'
    ],
    quizQuestions: [
      {
        id: 'hist_q1',
        question: 'What fundamental development allowed ancient agrarian societies to support specialized classes like philosophers, scribes, and engineers?',
        options: [
          'Immediate cessation of all tribal conflict',
          'Surplus caloric food production that freed workers from full-time subsistence hunting',
          'The discovery of electricity in Mesopotamia',
          'Universal literacy among all hunter-gatherers'
        ],
        correctIndex: 1,
        explanation: 'Grain agriculture generated caloric surplus that could be stored, taxed, and redistributed, enabling specialized labor divisions like priests, administrators, and metalworkers.',
        xpReward: 500
      },
      {
        id: 'hist_q2',
        question: 'Which geographical zone provides the earliest documented archaeological evidence for independent grain domestication?',
        options: [
          'The Scandinavian Fjords',
          'The Fertile Crescent in Southwest Asia',
          'The Great Australian Bight',
          'The Mojave Desert'
        ],
        correctIndex: 1,
        explanation: 'The Fertile Crescent (spanning modern Iraq, Syria, Lebanon, Israel, Jordan, and southern Turkey) yields the earliest confirmed sites of wheat, barley, and legume cultivation (~10,000 BCE).',
        xpReward: 550
      }
    ]
  },
  {
    id: 'vid_cinema_fincher',
    youtubeId: '3kXqO7Y_7s4',
    title: 'David Fincher - And the Other Way is Wrong',
    channel: 'Every Frame a Painting',
    category: 'movies',
    knowledgeDomain: 'Cinema Analysis & Directing',
    durationMinutes: 8,
    description: 'A study of camera stabilization, psychological blocking, framing discipline, and visual information density in modern auteur cinema.',
    xpReward: 2200,
    takeaways: [
      'Camera movement is strictly locked to character motion, never arbitrary handheld jitter.',
      'Every shot conveys precise spatial orientation and emotional withholding.',
      'Editing pacing reinforces the cold, analytical detachment of obsessive protagonists.'
    ],
    quizQuestions: [
      {
        id: 'cin_q1',
        question: 'According to this cinema analysis, what is the governing rule of camera movement in David Fincher’s filmography?',
        options: [
          'Constant handheld shaky-cam to simulate subjective documentary panic',
          'The camera only moves when a character moves, tracking spatial dynamics with surgical locking',
          'The camera must rotate 360 degrees in every dialogue scene',
          'Only drone aerial shots may be used during dramatic confrontations'
        ],
        correctIndex: 1,
        explanation: 'Fincher prohibits unmotivated handheld operator wobble; camera pans and dollies are mathematically locked to the characters\' physical trajectories.',
        xpReward: 500
      },
      {
        id: 'cin_q2',
        question: 'What emotional tone does Fincher’s disciplined visual blocking and geometry establish for the audience?',
        options: [
          'Improvised chaotic comedy',
          'Clinical, analytical detachment that mirrors his characters’ obsessive forensic minds',
          'Nostalgic fantasy escapism',
          'Unstructured melodrama'
        ],
        correctIndex: 1,
        explanation: 'Fincher’s rigorous geometrical framing and calculated editing pace induce a laser-focused, clinical detachment that reflects the obsession of investigators and perfectionists.',
        xpReward: 550
      }
    ]
  }
];

export const USER_PROFILES_MAP: Record<string, UserProfile> = {
  usr_me: INITIAL_USER,
  usr_marcus: {
    id: 'usr_marcus',
    name: 'Dr. Marcus Vance',
    handle: '@marcus_vance',
    avatar: AVATAR_MARCUS_PATH,
    bio: 'Theoretical Physicist at CERN & European Physical Society, FIDE Chess Grandmaster. 10.4 years of daily polymath mastery.',
    level: 989,
    xp: 24371000,
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
  },
  usr_elena: {
    id: 'usr_elena',
    name: 'Elena Rostova',
    handle: '@elena_run',
    avatar: AVATAR_ELENA_PATH,
    bio: 'Ultra-trail marathoner, Alpine mountaineer, and trilingual literary translator. Grandmaster tier athlete.',
    level: 742,
    xp: 12683000,
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
    unlockedBadgeIds: ['b_first_step', 'b_strava_sync', 'b_marathon_finisher', 'b_polyglot_starter', 'b_ironman_triathlon']
  },
  usr_sophia: {
    id: 'usr_sophia',
    name: 'Sophia Chen',
    handle: '@sophia_cinema',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Film theorist & neuroscientist researching perceptual cognition in cinema. Polyglot reader.',
    level: 518,
    xp: 5620000,
    streakDays: 245,
    yearsDedicated: 5.2,
    pillarMastery: {
      trivia: 74,
      language: 82,
      books: 85,
      movies: 98,
      fitness: 52,
      degree: 80,
      iq: 92
    },
    stats: {
      triviaSolved: 840,
      languagesStudied: 4,
      booksRead: 340,
      moviesWatched: 720,
      kmLogged: 1800,
      degreesEarned: 2,
      iqScore: 144
    },
    connectedWearables: {
      strava: false,
      appleWatch: true,
      garmin: false,
      whoop: false,
      goodreads: true
    },
    unlockedBadgeIds: ['b_first_step', 'b_bookworm_50', 'b_cinephile_500', 'b_iq_sharp']
  },
  usr_liam: {
    id: 'usr_liam',
    name: 'Liam O’Connor',
    handle: '@liam_trivia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Competitive Quiz League Champion, History lecturer, and powerlifting competitor.',
    level: 634,
    xp: 8800000,
    streakDays: 310,
    yearsDedicated: 6.5,
    pillarMastery: {
      trivia: 99,
      language: 62,
      books: 80,
      movies: 70,
      fitness: 88,
      degree: 75,
      iq: 84
    },
    stats: {
      triviaSolved: 4800,
      languagesStudied: 2,
      booksRead: 290,
      moviesWatched: 230,
      kmLogged: 3400,
      degreesEarned: 2,
      iqScore: 140
    },
    connectedWearables: {
      strava: true,
      appleWatch: true,
      garmin: false,
      whoop: true,
      goodreads: true
    },
    unlockedBadgeIds: ['b_first_step', 'b_bookworm_50', 'b_iq_sharp', 'b_strava_sync']
  },
  usr_soren: {
    id: 'usr_soren',
    name: 'Søren Lindqvist',
    handle: '@lindqvist_master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Pure Mathematician and Logic Analyst. 9.8 years of relentless intellectual optimization.',
    level: 954,
    xp: 22430000,
    streakDays: 780,
    yearsDedicated: 9.8,
    pillarMastery: {
      trivia: 88,
      language: 85,
      books: 94,
      movies: 72,
      fitness: 70,
      degree: 98,
      iq: 100
    },
    stats: {
      triviaSolved: 2800,
      languagesStudied: 4,
      booksRead: 520,
      moviesWatched: 320,
      kmLogged: 4200,
      degreesEarned: 3,
      iqScore: 160
    },
    connectedWearables: {
      strava: false,
      appleWatch: true,
      garmin: false,
      whoop: false,
      goodreads: true
    },
    unlockedBadgeIds: BADGES_CATALOG.filter(b => b.id !== 'b_decennial_mythic').map(b => b.id)
  },
  usr_aiko: {
    id: 'usr_aiko',
    name: 'Aiko Tanaka',
    handle: '@aiko_polymath',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Simultaneous diplomatic interpreter (English, Japanese, French, Mandarin, Arabic, Russian) and classical pianist.',
    level: 912,
    xp: 20260000,
    streakDays: 690,
    yearsDedicated: 9.2,
    pillarMastery: {
      trivia: 84,
      language: 100,
      books: 92,
      movies: 85,
      fitness: 65,
      degree: 92,
      iq: 94
    },
    stats: {
      triviaSolved: 2100,
      languagesStudied: 6,
      booksRead: 490,
      moviesWatched: 380,
      kmLogged: 2900,
      degreesEarned: 2,
      iqScore: 150
    },
    connectedWearables: {
      strava: true,
      appleWatch: true,
      garmin: false,
      whoop: false,
      goodreads: true
    },
    unlockedBadgeIds: ['b_first_step', 'b_bookworm_50', 'b_polyglot_starter', 'b_cinephile_500', 'b_iq_sharp', 'b_doctorate_phd']
  }
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dark',
    name: 'Obsidian Minimal',
    subtitle: 'Classic High-Performance Dark',
    category: 'Standard',
    badge: 'Default',
    accentColor: 'text-amber-500',
    bgHex: '#09090b',
    accentHex: '#f59e0b',
    secondaryHex: '#71717a',
    description: 'Sleek OLED zinc dark mode with warm gold accents. Reduced eye strain and optimal contrast.',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    bannerBorder: 'border-zinc-800'
  },
  {
    id: 'light',
    name: 'Scholar Alabaster',
    subtitle: 'High-Contrast Daylight Clarity',
    category: 'Standard',
    badge: 'Light Mode',
    accentColor: 'text-amber-600',
    bgHex: '#f8fafc',
    accentHex: '#d97706',
    secondaryHex: '#64748b',
    description: 'Crisp parchment paper aesthetics designed for prolonged reading, bright sunlight, and study sessions.',
    glowClass: 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
    bannerBorder: 'border-zinc-300'
  },
  {
    id: 'dark-neo',
    name: 'Dark Neo-Brutalist',
    subtitle: 'Cyberpunk Wireframe & High Voltage',
    category: 'Neo-Brutalism',
    badge: 'High Voltage',
    accentColor: 'text-cyan-400',
    bgHex: '#07090e',
    accentHex: '#06b6d4',
    secondaryHex: '#84cc16',
    description: 'Ultra high-contrast terminal styling with radiant electric cyan and toxic lime outlines, bold tech borders.',
    glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    bannerBorder: 'border-cyan-500/50'
  },
  {
    id: 'anime-solo',
    name: 'Solo Leveling (Shadow Monarch)',
    subtitle: 'Arise: Abyssal Void & Mana Blue',
    category: 'Anime & Gaming',
    badge: 'S-Rank Hunter',
    accentColor: 'text-sky-400',
    bgHex: '#040714',
    accentHex: '#38bdf8',
    secondaryHex: '#818cf8',
    description: 'Deep abyssal midnight space infused with radiant electric mana blue and shadow monarch violet aura.',
    glowClass: 'shadow-[0_0_30px_rgba(56,189,248,0.35)]',
    bannerBorder: 'border-sky-500/40'
  },
  {
    id: 'anime-cyberpunk',
    name: 'Cyber Mecha (EVA-01)',
    subtitle: 'Sync Rate 100%: Toxic Plum & Acid Green',
    category: 'Anime & Gaming',
    badge: 'Mecha Core',
    accentColor: 'text-emerald-400',
    bgHex: '#0f051d',
    accentHex: '#22c55e',
    secondaryHex: '#f43f5e',
    description: 'Evangelion biomechanical aesthetic: deep dark purple chassis illuminated by radioactive green and neon magenta.',
    glowClass: 'shadow-[0_0_30px_rgba(34,197,94,0.35)]',
    bannerBorder: 'border-emerald-500/40'
  },
  {
    id: 'anime-sakura',
    name: 'Tokyo Twilight Sakura',
    subtitle: 'Demon Slayer Wisteria & Blossom Petals',
    category: 'Anime & Gaming',
    badge: 'Hashira Spirit',
    accentColor: 'text-pink-400',
    bgHex: '#0e0a17',
    accentHex: '#f472b6',
    secondaryHex: '#c084fc',
    description: 'Enchanting twilight wisteria violet and glowing cherry blossom petals. Elegant, ethereal Japanese nighttime motif.',
    glowClass: 'shadow-[0_0_30px_rgba(244,114,182,0.35)]',
    bannerBorder: 'border-pink-500/40'
  },
  {
    id: 'anime-saiyan',
    name: 'Super Saiyan Ki Flare',
    subtitle: 'Power Level Over 9000: Dragon Gold',
    category: 'Anime & Gaming',
    badge: 'Ascended Saiyan',
    accentColor: 'text-yellow-400',
    bgHex: '#0b0a06',
    accentHex: '#facc15',
    secondaryHex: '#f97316',
    description: 'Intense golden ki aura erupting over charred volcanic obsidian. Blazing determination and combat energy.',
    glowClass: 'shadow-[0_0_30px_rgba(250,204,21,0.35)]',
    bannerBorder: 'border-yellow-500/40'
  }
];

