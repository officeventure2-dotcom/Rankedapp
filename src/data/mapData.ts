import { MapPlayer } from '../types';
import { AVATAR_MARCUS_PATH, AVATAR_ELENA_PATH } from './mockData';

export const INITIAL_MAP_PLAYERS: MapPlayer[] = [
  {
    id: 'usr_me',
    name: 'Alex Hunter (You)',
    handle: '@alexhunter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 261,
    xp: 1245800,
    tier: 'Expert',
    topCategory: 'fitness',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco, CA',
      country: 'United States'
    },
    bio: 'Endurance runner, literature explorer & language learner. Aiming for Level 500 Master rank this year.',
    statusText: 'Logging Strava 10k tempo & studying Spanish B2',
    isFriend: true,
    isCurrentUser: true,
    onlineNow: true,
    lastActive: 'Just now'
  },
  {
    id: 'usr_marcus',
    name: 'Dr. Marcus Vance',
    handle: '@marcus_vance',
    avatar: AVATAR_MARCUS_PATH,
    level: 989,
    xp: 24371000,
    tier: 'Mythic',
    topCategory: 'degree',
    location: {
      lat: 46.2044,
      lng: 6.1432,
      city: 'Geneva',
      country: 'Switzerland'
    },
    bio: 'Theoretical Physicist at CERN & European Physical Society, FIDE Chess Grandmaster. 10.4 years of daily polymath mastery.',
    statusText: 'Analyzing particle collision data at CERN & solving 3000 Elo chess puzzles',
    isFriend: true,
    onlineNow: true,
    lastActive: '3m ago'
  },
  {
    id: 'usr_soren',
    name: 'Søren Lindqvist',
    handle: '@lindqvist_master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    level: 954,
    xp: 22430000,
    tier: 'Mythic',
    topCategory: 'iq',
    location: {
      lat: 55.6761,
      lng: 12.5683,
      city: 'Copenhagen',
      country: 'Denmark'
    },
    bio: 'Pure Mathematician and Logic Analyst. 9.8 years of relentless intellectual optimization.',
    statusText: 'Drafting discrete category theory proof',
    isFriend: false,
    onlineNow: false,
    lastActive: '45m ago'
  },
  {
    id: 'usr_aiko',
    name: 'Aiko Tanaka',
    handle: '@aiko_polymath',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    level: 912,
    xp: 20260000,
    tier: 'Apex',
    topCategory: 'language',
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: 'Tokyo',
      country: 'Japan'
    },
    bio: 'Simultaneous diplomatic interpreter (6 languages) and classical pianist.',
    statusText: 'Practicing Chopin Nocturnes & translating Arabic legal texts',
    isFriend: false,
    onlineNow: true,
    lastActive: 'Just now'
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    handle: '@elena_run',
    avatar: AVATAR_ELENA_PATH,
    level: 742,
    xp: 12683000,
    tier: 'Grandmaster',
    topCategory: 'fitness',
    location: {
      lat: 45.9237,
      lng: 6.8694,
      city: 'Chamonix-Mont-Blanc',
      country: 'France'
    },
    bio: 'Ultra-trail marathoner, Alpine mountaineer, and trilingual literary translator. Grandmaster tier athlete.',
    statusText: 'Alpine 50k altitude training session logged',
    isFriend: true,
    onlineNow: true,
    lastActive: '12m ago'
  },
  {
    id: 'usr_liam',
    name: 'Liam O’Connor',
    handle: '@liam_trivia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level: 634,
    xp: 8800000,
    tier: 'Master',
    topCategory: 'trivia',
    location: {
      lat: 53.3498,
      lng: -6.2603,
      city: 'Dublin',
      country: 'Ireland'
    },
    bio: 'Competitive Quiz League Champion, History lecturer, and powerlifting competitor.',
    statusText: 'Hosting national pub trivia championship & deadlifting 240kg',
    isFriend: true,
    onlineNow: false,
    lastActive: '2h ago'
  },
  {
    id: 'usr_sophia',
    name: 'Sophia Chen',
    handle: '@sophia_cinema',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    level: 518,
    xp: 5620000,
    tier: 'Master',
    topCategory: 'movies',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: 'London',
      country: 'United Kingdom'
    },
    bio: 'Film theorist & neuroscientist researching perceptual cognition in cinema. Polyglot reader.',
    statusText: 'Screening 70mm restoration at BFI Southbank',
    isFriend: true,
    onlineNow: true,
    lastActive: '5m ago'
  },
  {
    id: 'usr_maya',
    name: 'Maya Lin',
    handle: '@maya_neural',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 312,
    xp: 1750000,
    tier: 'Expert',
    topCategory: 'iq',
    location: {
      lat: 37.8715,
      lng: -122.2730,
      city: 'Berkeley, CA',
      country: 'United States'
    },
    bio: 'AI researcher and competitive Sudoku speed-solver. Working on biological compute models.',
    statusText: 'Solving Sudoku Master in 3m 42s',
    isFriend: false,
    onlineNow: true,
    lastActive: 'Just now'
  },
  {
    id: 'usr_carlos',
    name: 'Carlos Mendez',
    handle: '@carlos_tri',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    level: 185,
    xp: 620000,
    tier: 'Adept',
    topCategory: 'fitness',
    location: {
      lat: 37.3382,
      lng: -121.8863,
      city: 'San Jose, CA',
      country: 'United States'
    },
    bio: 'Triathlete and software engineer. Pushing daily towards Level 250 Expert rank.',
    statusText: 'Morning 40km road cycle completed',
    isFriend: false,
    onlineNow: false,
    lastActive: '1h ago'
  },
  {
    id: 'usr_julian',
    name: 'Julian Voss',
    handle: '@julian_polyglot',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    level: 420,
    xp: 3450000,
    tier: 'Expert',
    topCategory: 'language',
    location: {
      lat: 37.4419,
      lng: -122.1430,
      city: 'Palo Alto, CA',
      country: 'United States'
    },
    bio: 'Computational linguist studying Latin, Mandarin, and Ancient Greek etymology.',
    statusText: 'Reviewing 200 HSK 5 flashcards',
    isFriend: false,
    onlineNow: true,
    lastActive: '8m ago'
  },
  {
    id: 'usr_rachel',
    name: 'Rachel Stern',
    handle: '@rachel_books',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    level: 580,
    xp: 7200000,
    tier: 'Master',
    topCategory: 'books',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      city: 'Los Angeles, CA',
      country: 'United States'
    },
    bio: 'Author and comparative literature professor. 420 verified tomes finished.',
    statusText: 'Reading Proust in original French',
    isFriend: false,
    onlineNow: false,
    lastActive: '3h ago'
  },
  {
    id: 'usr_tariq',
    name: 'Tariq Al-Mansoor',
    handle: '@tariq_books',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    level: 215,
    xp: 830350,
    tier: 'Adept',
    topCategory: 'books',
    location: {
      lat: 25.2048,
      lng: 55.2708,
      city: 'Dubai',
      country: 'United Arab Emirates'
    },
    bio: 'History scholar & rare manuscript archivist.',
    statusText: 'Cataloging medieval Islamic astronomy treatises',
    isFriend: false,
    onlineNow: false,
    lastActive: '5h ago'
  },
  {
    id: 'usr_nadia',
    name: 'Nadia Volkov',
    handle: '@nadia_iq',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    level: 162,
    xp: 469400,
    tier: 'Adept',
    topCategory: 'iq',
    location: {
      lat: 47.3769,
      lng: 8.5417,
      city: 'Zurich',
      country: 'Switzerland'
    },
    bio: 'Applied Cryptographer & Zurich Math Olympiad coach.',
    statusText: 'Benchmarking lattice cryptography algorithms',
    isFriend: false,
    onlineNow: true,
    lastActive: '14m ago'
  },
  {
    id: 'usr_kofi',
    name: 'Kofi Mensah',
    handle: '@kofi_runner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    level: 115,
    xp: 243970,
    tier: 'Adept',
    topCategory: 'fitness',
    location: {
      lat: 5.6037,
      lng: -0.1870,
      city: 'Accra',
      country: 'Ghana'
    },
    bio: 'Sub-32 10k runner and solar energy researcher.',
    statusText: 'Logging interval speed session on track',
    isFriend: false,
    onlineNow: false,
    lastActive: '4h ago'
  },
  {
    id: 'usr_lucas',
    name: 'Lucas Moreau',
    handle: '@lucas_chess',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level: 670,
    xp: 10100000,
    tier: 'Grandmaster',
    topCategory: 'iq',
    location: {
      lat: 48.8566,
      lng: 2.3522,
      city: 'Paris',
      country: 'France'
    },
    bio: 'IM Chess Player, Philosopher of Science at Sorbonne.',
    statusText: 'Streaming blindfold chess simultaneous exhibition',
    isFriend: false,
    onlineNow: true,
    lastActive: 'Just now'
  },
  {
    id: 'usr_hiroshi',
    name: 'Hiroshi Sato',
    handle: '@hiroshi_apex',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    level: 880,
    xp: 18600000,
    tier: 'Apex',
    topCategory: 'degree',
    location: {
      lat: 35.0116,
      lng: 135.7681,
      city: 'Kyoto',
      country: 'Japan'
    },
    bio: 'Quantum Photonics Professor at Kyoto University. 13 years unbroken daily study streak.',
    statusText: 'Peer reviewing quantum optics nature paper',
    isFriend: false,
    onlineNow: false,
    lastActive: '6h ago'
  },
  {
    id: 'usr_priya',
    name: 'Priya Sharma',
    handle: '@priya_polymath',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    level: 530,
    xp: 5980000,
    tier: 'Master',
    topCategory: 'trivia',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      city: 'Bengaluru',
      country: 'India'
    },
    bio: 'Bioinformatics researcher & Sanskrit computational etymologist.',
    statusText: 'Modeling protein folding sequences with AlphaFold',
    isFriend: false,
    onlineNow: true,
    lastActive: '18m ago'
  },
  {
    id: 'usr_noah',
    name: 'Noah Bennett',
    handle: '@noah_nyc',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    level: 360,
    xp: 2350000,
    tier: 'Expert',
    topCategory: 'books',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      city: 'New York, NY',
      country: 'United States'
    },
    bio: 'Wall Street quant analyst & competitive chess master. Central Park marathoner.',
    statusText: 'Training for NYC Marathon & speed chess blitz',
    isFriend: false,
    onlineNow: true,
    lastActive: '30m ago'
  },
  {
    id: 'usr_astrid',
    name: 'Astrid Lind',
    handle: '@astrid_nordic',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    level: 790,
    xp: 14500000,
    tier: 'Grandmaster',
    topCategory: 'fitness',
    location: {
      lat: 59.3293,
      lng: 18.0686,
      city: 'Stockholm',
      country: 'Sweden'
    },
    bio: 'Cross-country ski Olympian & computational neurobiology researcher.',
    statusText: 'Logged 40km Nordic ski biometrics',
    isFriend: false,
    onlineNow: false,
    lastActive: '1h ago'
  }
];

// Calculate Haversine distance in kilometers between two lat/lng pairs
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
