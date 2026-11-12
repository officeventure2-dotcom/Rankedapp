export interface BookVerificationQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BookCatalogItem {
  id: string;
  title: string;
  author: string;
  year: number;
  pages: number;
  genre: string;
  summary: string;
  coverBg: string;
  tag: string;
  verificationQuestions: BookVerificationQuestion[];
}

export const BOOK_CATALOG: BookCatalogItem[] = [
  {
    id: 'cat_meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 180,
    pages: 256,
    genre: 'Stoic Philosophy',
    summary: 'Personal writings of the Roman Emperor Marcus Aurelius on Stoic duty, mortal transience, and inner sovereignty.',
    coverBg: 'from-amber-700 to-stone-900',
    tag: 'Classical Canon',
    verificationQuestions: [
      {
        id: 'med_q1',
        question: 'According to Marcus Aurelius, where does true serenity and freedom reside?',
        options: [
          'In political power and imperial decree',
          'Within the disciplined governing mind (hegemonikon) that controls judgments',
          'In physical asceticism away from civilization',
          'In external accolades and posthumous fame'
        ],
        correctIndex: 1,
        explanation: 'Aurelius repeatedly stresses that external events cannot touch the soul; only our own judgments about them govern our peace.'
      },
      {
        id: 'med_q2',
        question: 'What metaphor does Marcus use to describe the transient nature of mortal fame and worldly achievements?',
        options: [
          'A fortress carved in marble',
          'Smoke, shadows, and dead leaves scattered by autumn winds',
          'A river that never meets the ocean',
          'A bronze coin buried in deep soil'
        ],
        correctIndex: 1,
        explanation: 'He writes of fame as a mere echo in an empty chamber, transient as smoke or dead leaves swept away by time.'
      }
    ]
  },
  {
    id: 'cat_fast_slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    pages: 499,
    genre: 'Cognitive Psychology',
    summary: 'Seminal investigation into the two modes of thought: System 1 (fast, emotional, heuristic) and System 2 (slow, deliberative, logical).',
    coverBg: 'from-blue-700 to-indigo-950',
    tag: 'Nobel Behavioral Science',
    verificationQuestions: [
      {
        id: 'tfs_q1',
        question: 'In Kahneman’s dual-system framework, which system operates automatically with little or no effort?',
        options: [
          'System 2 (Deliberative Analysis)',
          'System 1 (Fast & Intuitive)',
          'System 3 (Reflective Metacognition)',
          'The Default Mode Network'
        ],
        correctIndex: 1,
        explanation: 'System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control.'
      },
      {
        id: 'tfs_q2',
        question: 'What cognitive bias describes evaluating outcomes based on ease of retrieval from memory rather than statistical probability?',
        options: [
          'Availability Heuristic',
          'Anchoring Effect',
          'Sunk Cost Fallacy',
          'Hindsight Bias'
        ],
        correctIndex: 0,
        explanation: 'The availability heuristic leads individuals to judge frequency or likelihood by how readily relevant instances come to mind.'
      }
    ]
  },
  {
    id: 'cat_1984',
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    pages: 328,
    genre: 'Dystopian Fiction',
    summary: 'A chilling vision of totalitarian control, psychological surveillance by Big Brother, and the weaponization of language through Newspeak.',
    coverBg: 'from-red-800 to-neutral-950',
    tag: 'Dystopian Masterpiece',
    verificationQuestions: [
      {
        id: '1984_q1',
        question: 'What is the primary function of Newspeak in the Oceania state regime?',
        options: [
          'To enhance poetic expressiveness and vocabulary',
          'To narrow the range of thought and make thoughtcrime literally impossible',
          'To standardize dialect among all Outer Party members',
          'To enable encrypted radio transmission'
        ],
        correctIndex: 1,
        explanation: 'Newspeak was systematically engineered to diminish the range of thought by eliminating undesirable words and shades of meaning.'
      },
      {
        id: '1984_q2',
        question: 'What is the dreaded destination in the Ministry of Love where victims face their worst fear?',
        options: [
          'Cell 7',
          'Room 101',
          'The Golden Country',
          'The Chestnut Tree Cafe'
        ],
        correctIndex: 1,
        explanation: 'Room 101 contains "the worst thing in the world," tailored specifically to break each prisoner’s psyche.'
      }
    ]
  },
  {
    id: 'cat_sapiens',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    year: 2014,
    pages: 443,
    genre: 'Anthropology & History',
    summary: 'Traces the trajectory of Homo sapiens from insignificant apes on the African savanna to lords of planet Earth through cognitive revolutions and imagined orders.',
    coverBg: 'from-amber-600 to-zinc-900',
    tag: 'Global History',
    verificationQuestions: [
      {
        id: 'sap_q1',
        question: 'What does Harari identify as the defining breakthrough of the Cognitive Revolution (~70,000 years ago)?',
        options: [
          'The invention of the wheel and agriculture',
          'The ability to transmit information about things that do not exist (shared fictions / myths)',
          'The mastery of fire and smelting bronze',
          'The development of written legal codes'
        ],
        correctIndex: 1,
        explanation: 'Harari argues that Homo sapiens conquered the globe because only we can cooperate flexibly in large numbers based on belief in imagined realities (religions, nations, money).'
      },
      {
        id: 'sap_q2',
        question: 'Harari controversially refers to the Agricultural Revolution as:',
        options: [
          'History’s greatest fraud / trap',
          'The inevitable paradise of abundant calories',
          'The moment humans achieved total biological immunity',
          'The birth of human ecological preservation'
        ],
        correctIndex: 0,
        explanation: 'He argues that agriculture trapped farmers into longer work hours and poorer diets compared to foragers, benefiting wheat rather than individual humans.'
      }
    ]
  },
  {
    id: 'cat_dune',
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    pages: 688,
    genre: 'Science Fiction',
    summary: 'Epic space saga set on the desert planet Arrakis, exploring politics, religion, ecology, and human potential centered on the spice melange.',
    coverBg: 'from-orange-700 to-amber-950',
    tag: 'Sci-Fi Epic',
    verificationQuestions: [
      {
        id: 'dune_q1',
        question: 'What is the vital commodity found exclusively on the desert planet Arrakis?',
        options: [
          'Water essence',
          'The spice melange (geriatric substance enabling interstellar navigation)',
          'Plutonium isotopes',
          'Crystalline crysknife ore'
        ],
        correctIndex: 1,
        explanation: 'Melange grants longevity, expands consciousness, and allows Spacing Guild Navigators to fold space safely.'
      },
      {
        id: 'dune_q2',
        question: 'Complete the famous Bene Gesserit Litany: "I must not fear. Fear is the ______."',
        options: [
          'Path to weakness',
          'Mind-killer',
          'Curse of mortals',
          'Shadow of death'
        ],
        correctIndex: 1,
        explanation: '"Fear is the mind-killer. Fear is the little-death that brings total obliteration."'
      }
    ]
  },
  {
    id: 'cat_atomic_habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    year: 2018,
    pages: 320,
    genre: 'Personal Development',
    summary: 'A comprehensive framework for breaking bad habits and building good ones through tiny 1% daily compound improvements and identity shifts.',
    coverBg: 'from-emerald-700 to-zinc-950',
    tag: 'Behavioral Mastery',
    verificationQuestions: [
      {
        id: 'ah_q1',
        question: 'What are the four stages of the habit loop identified by James Clear?',
        options: [
          'Trigger, Routine, Reward, Belief',
          'Cue, Craving, Response, Reward',
          'Plan, Action, Feedback, Iteration',
          'Stimulus, Motivation, Execution, Satisfaction'
        ],
        correctIndex: 1,
        explanation: 'The four-step model is: Cue triggers a Craving, which motivates a Response, which delivers a Reward.'
      },
      {
        id: 'ah_q2',
        question: 'According to Clear, what is the most powerful layer of behavior change?',
        options: [
          'Outcome-based change (focusing on targets)',
          'Process-based change (focusing on systems)',
          'Identity-based change (focusing on who you wish to become)',
          'Accountability-based change (focusing on peer pressure)'
        ],
        correctIndex: 2,
        explanation: 'Clear teaches that true behavior change is identity change: when your actions align with who you believe you are, habits become permanent.'
      }
    ]
  },
  {
    id: 'cat_gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    pages: 180,
    genre: 'Classic American Literature',
    summary: 'A portrait of the Roaring Twenties exploring wealth, obsession, and the corruption of the American Dream through narrator Nick Carraway.',
    coverBg: 'from-blue-900 to-zinc-950',
    tag: 'American Classic',
    verificationQuestions: [
      {
        id: 'gg_q1',
        question: 'What symbol across the bay does Gatsby gaze at from his dock, representing his longing for Daisy?',
        options: [
          'A billboard of Doctor T.J. Eckleburg',
          'The green light at the end of Daisy’s dock',
          'The lighthouse of Manhattan',
          'A yellow automobile'
        ],
        correctIndex: 1,
        explanation: 'The green light represents Gatsby’s hopes and dreams for a future with Daisy Buchanan.'
      },
      {
        id: 'gg_q2',
        question: 'Who serves as the moral observer and primary narrator of the novel?',
        options: [
          'Jay Gatsby',
          'Tom Buchanan',
          'Nick Carraway',
          'Jordan Baker'
        ],
        correctIndex: 2,
        explanation: 'Nick Carraway narrates the entire tale, claiming to reserve all judgments while detailing Gatsby’s tragic rise and fall.'
      }
    ]
  },
  {
    id: 'cat_crime_punishment',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    year: 1866,
    pages: 545,
    genre: 'Russian Psychological Novel',
    summary: 'The anguish and moral dilemma of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg who murders an unscrupulous pawnbroker.',
    coverBg: 'from-zinc-800 to-stone-950',
    tag: 'Existential Classic',
    verificationQuestions: [
      {
        id: 'cp_q1',
        question: 'What philosophical theory does Raskolnikov formulate in his essay to rationalize his crime?',
        options: [
          'Radical Nihilism',
          'The "Extraordinary Man" theory (that exceptional individuals have the right to transgress moral laws for higher ends)',
          'Utilitarian Hedonism',
          'Social Contractarianism'
        ],
        correctIndex: 1,
        explanation: 'Raskolnikov believed that "extraordinary" men like Napoleon had the inner right to step over obstacles and conventional moral barriers.'
      },
      {
        id: 'cp_q2',
        question: 'Which character provides spiritual guidance and reads the story of Lazarus to Raskolnikov in his lowest moment?',
        options: [
          'Dounia (his sister)',
          'Sonya Marmeladov',
          'Porfiry Petrovich',
          'Razumikhin'
        ],
        correctIndex: 1,
        explanation: 'Sonya’s selfless Christian faith, sacrifice, and reading of the resurrection of Lazarus lead Raskolnikov toward confession and redemption.'
      }
    ]
  },
  {
    id: 'cat_art_of_war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    year: -500,
    pages: 112,
    genre: 'Military Strategy & Philosophy',
    summary: 'Ancient Chinese military treatise attributed to Sun Tzu, composed of 13 chapters dedicated to strategy, deception, and victory without battle.',
    coverBg: 'from-red-900 to-amber-950',
    tag: 'Strategic Treatise',
    verificationQuestions: [
      {
        id: 'aow_q1',
        question: 'According to Sun Tzu, what represents the supreme art of war?',
        options: [
          'Crushing the enemy army on the open battlefield',
          'Subduing the enemy without fighting',
          'Besieging walled fortresses with overwhelming numbers',
          'Constructing impenetrable mountain defenses'
        ],
        correctIndex: 1,
        explanation: 'Sun Tzu wrote: "Supreme excellence consists in breaking the enemy’s resistance without fighting."'
      },
      {
        id: 'aow_q2',
        question: 'Complete the maxim: "If you know the enemy and know yourself, you need not fear ______."',
        options: [
          'The judgment of the emperor',
          'The result of a hundred battles',
          'The severity of winter campaigns',
          'The betrayal of allies'
        ],
        correctIndex: 1,
        explanation: '"If you know the enemy and know yourself, you need not fear the result of a hundred battles."'
      }
    ]
  },
  {
    id: 'cat_man_meaning',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    year: 1946,
    pages: 165,
    genre: 'Existential Psychology & Memoir',
    summary: 'Chronicles Frankl’s experiences as an Auschwitz inmate and introduces logotherapy: human motivation driven by the pursuit of purpose.',
    coverBg: 'from-slate-700 to-zinc-950',
    tag: 'Psychology Classic',
    verificationQuestions: [
      {
        id: 'msm_q1',
        question: 'What school of psychotherapy did Viktor Frankl establish based on his experiences?',
        options: [
          'Rational Emotive Behavior Therapy (REBT)',
          'Logotherapy (healing through meaning)',
          'Classical Psychoanalysis',
          'Gestalt Phenomenology'
        ],
        correctIndex: 1,
        explanation: 'Logotherapy focuses on helping patients discover personal meaning as the primary human drive.'
      },
      {
        id: 'msm_q2',
        question: 'Frankl famously quoted Nietzsche: "He who has a why to live can bear almost any ______."',
        options: [
          'Pain',
          'How',
          'Loss',
          'Burden'
        ],
        correctIndex: 1,
        explanation: '"He who has a why to live can bear almost any how."'
      }
    ]
  },
  {
    id: 'cat_deep_work',
    title: 'Deep Work: Rules for Focused Success',
    author: 'Cal Newport',
    year: 2016,
    pages: 304,
    genre: 'Productivity & Cognitive Science',
    summary: 'Argues that the ability to focus without distraction on cognitively demanding tasks is becoming increasingly rare and valuable in modern economies.',
    coverBg: 'from-teal-800 to-zinc-950',
    tag: 'Focus & Intellect',
    verificationQuestions: [
      {
        id: 'dw_q1',
        question: 'How does Cal Newport define "Shallow Work"?',
        options: [
          'Academic research with insufficient mathematical proof',
          'Non-cognitively demanding, logistical tasks often performed while distracted',
          'Physical manual labor in manufacturing',
          'Work performed during early morning hours'
        ],
        correctIndex: 1,
        explanation: 'Shallow work includes logistical tasks like emails and slack messages that do not create new value and are easily replicated.'
      },
      {
        id: 'dw_q2',
        question: 'Which scheduling philosophy for Deep Work involves isolating yourself completely for extended periods like a monastery?',
        options: [
          'The Monastic Philosophy',
          'The Bimodal Philosophy',
          'The Rhythmic Philosophy',
          'The Journalistic Philosophy'
        ],
        correctIndex: 0,
        explanation: 'The Monastic approach eliminates shallow obligations completely by isolating the practitioner from distractions.'
      }
    ]
  },
  {
    id: 'cat_republic',
    title: 'The Republic',
    author: 'Plato',
    year: -375,
    pages: 416,
    genre: 'Political Philosophy',
    summary: 'Socratic dialogue exploring the nature of justice, the ideal city-state (Kallipolis), the tripartite soul, and the famous Allegory of the Cave.',
    coverBg: 'from-cyan-900 to-zinc-950',
    tag: 'Foundational Dialogue',
    verificationQuestions: [
      {
        id: 'rep_q1',
        question: 'In the Allegory of the Cave (Book VII), what do the shadows on the wall represent?',
        options: [
          'Pure geometric mathematical forms',
          'The illusory realm of sensory perceptions mistaken for ultimate reality',
          'The military strength of neighboring rivals',
          'The collective unconscious of the citizens'
        ],
        correctIndex: 1,
        explanation: 'The chained prisoners mistake the shifting shadows cast by statues for true reality, symbolizing humans trapped by sense experience.'
      },
      {
        id: 'rep_q2',
        question: 'Who does Socrates argue should rule the ideal city-state?',
        options: [
          'Wealthy merchant oligarchs',
          'Philosopher-Kings who possess knowledge of the Good',
          'Military warriors decorated in battle',
          'A direct democracy of every citizen'
        ],
        correctIndex: 1,
        explanation: 'Socrates argues that cities will have no rest from evils until philosophers become kings or kings genuinely philosophize.'
      }
    ]
  },
  {
    id: 'cat_principles',
    title: 'Principles: Life and Work',
    author: 'Ray Dalio',
    year: 2017,
    pages: 592,
    genre: 'Business & Systems Thinking',
    summary: 'Bridgewater Associates founder Ray Dalio shares unconventional principles for radical transparency, believable decisions, and algorithmic management.',
    coverBg: 'from-violet-900 to-zinc-950',
    tag: 'Systematic Reasoning',
    verificationQuestions: [
      {
        id: 'pri_q1',
        question: 'What is Ray Dalio’s core 5-step process for getting what you want out of life?',
        options: [
          'Goals → Problems → Diagnosis → Design → Doing',
          'Dream → Fund → Execute → Scale → Exit',
          'Learn → Test → Deploy → Monitor → Repeat',
          'Hypothesize → Experiment → Review → Publish → Monetize'
        ],
        correctIndex: 0,
        explanation: 'The 5-step loop is: 1) Have clear goals, 2) Identify problems, 3) Diagnose root causes, 4) Design plans, 5) Push through to completion.'
      },
      {
        id: 'pri_q2',
        question: 'What cultural norm at Bridgewater encourages open criticism and data-driven weighting of perspectives?',
        options: [
          'Radical Transparency and Idea Meritocracy (believability weighting)',
          'Strict military chain of command',
          'Consensus-based committee voting',
          'Anonymous suggestion boxes'
        ],
        correctIndex: 0,
        explanation: 'Dalio advocates an Idea Meritocracy powered by radical truth and believability-weighted decision making.'
      }
    ]
  },
  {
    id: 'cat_brief_history_time',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    year: 1988,
    pages: 256,
    genre: 'Astrophysics & Cosmology',
    summary: 'Landmark popular science book exploring the origins and fate of the universe, black holes, the arrow of time, and the quest for a theory of everything.',
    coverBg: 'from-purple-900 to-indigo-950',
    tag: 'Cosmic Science',
    verificationQuestions: [
      {
        id: 'bht_q1',
        question: 'What theoretical radiation, predicted by Hawking in 1974, causes black holes to slowly lose mass and eventually evaporate?',
        options: [
          'Synchrotron Emission',
          'Hawking Radiation (quantum vacuum fluctuation particle-antiparticle pairs near the event horizon)',
          'Cherenkov Radiation',
          'Cosmic Microwave Background'
        ],
        correctIndex: 1,
        explanation: 'Hawking radiation results from virtual particle pairs generated near the horizon where one falls in and the other escapes.'
      },
      {
        id: 'bht_q2',
        question: 'Why does Hawking state that the thermodynamic arrow of time must point in the same direction as the psychological arrow?',
        options: [
          'Because entropy must increase for the brain to form memories and process information',
          'Because the universe is actively contracting',
          'Because gravitational waves travel backwards in time',
          'Because light cones tilt inward toward the galactic core'
        ],
        correctIndex: 0,
        explanation: 'A computer or brain requires expending energy and increasing overall entropy to record memories, binding the psychological arrow to thermodynamics.'
      }
    ]
  },
  {
    id: 'cat_zero_to_one',
    title: 'Zero to One: Notes on Startups',
    author: 'Peter Thiel',
    year: 2014,
    pages: 224,
    genre: 'Technology & Entrepreneurship',
    summary: 'Explores how creating new things moves the world from 0 to 1 (vertical progress), building valuable monopolies, and discovering secrets.',
    coverBg: 'from-sky-800 to-zinc-950',
    tag: 'Innovation Theory',
    verificationQuestions: [
      {
        id: 'zto_q1',
        question: 'What interview question does Thiel famous pose to prospective founders to test contrarian thinking?',
        options: [
          '"What important truth do very few people agree with you on?"',
          '"How fast can you double revenue in 6 months?"',
          '"Why is your product 10% cheaper than competitors?"',
          '"What is your university GPA?"'
        ],
        correctIndex: 0,
        explanation: 'Thiel asks: "What important truth do very few people agree with you on?" to uncover contrarian insights.'
      },
      {
        id: 'zto_q2',
        question: 'According to Thiel, what kind of business should founders strive to build?',
        options: [
          'A perfectly competitive commodity business',
          'A creative monopoly that solves a unique problem and captures durable value',
          'A franchise with thousands of identical retail outlets',
          'A government contractor'
        ],
        correctIndex: 1,
        explanation: 'Thiel argues that competition destroys profits; true progress comes from creative monopolies that escape competition.'
      }
    ]
  },
  {
    id: 'cat_hobbit',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    pages: 310,
    genre: 'High Fantasy',
    summary: 'The journey of the comfort-loving hobbit Bilbo Baggins to reclaim the lost dwarf kingdom of Erebor from the dragon Smaug.',
    coverBg: 'from-emerald-800 to-amber-950',
    tag: 'Fantasy Classic',
    verificationQuestions: [
      {
        id: 'hob_q1',
        question: 'How does Bilbo win the contest of riddles against Gollum under the Misty Mountains?',
        options: [
          'By answering the riddle of wind',
          'By asking: "What have I got in my pocket?"',
          'By identifying the riddle of time',
          'By shining the light of Sting'
        ],
        correctIndex: 1,
        explanation: 'Flustered, Bilbo muttered "What have I got in my pocket?", which Gollum accepted as a riddle and failed to guess in three tries.'
      },
      {
        id: 'hob_q2',
        question: 'What precious jewel, the heart of the Mountain, does Bilbo find and secretly keep?',
        options: [
          'The Silmaril',
          'The Arkenstone of Thrain',
          'The Nauglamir',
          'The Star of Elendil'
        ],
        correctIndex: 1,
        explanation: 'Bilbo finds the luminous Arkenstone and later uses it as leverage to prevent war between elves, dwarves, and men.'
      }
    ]
  }
];

// Helper to find matching books for autocomplete
export function searchBookSuggestions(query: string): BookCatalogItem[] {
  if (!query || query.trim().length === 0) {
    return BOOK_CATALOG.slice(0, 6);
  }
  const clean = query.toLowerCase().trim();
  return BOOK_CATALOG.filter(b => 
    b.title.toLowerCase().includes(clean) ||
    b.author.toLowerCase().includes(clean) ||
    b.genre.toLowerCase().includes(clean)
  ).slice(0, 8);
}
