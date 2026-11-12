import { LanguageGoal, CEFRLevel, LanguageExercise, AlphabetChar, PhonicsWord } from '../types';

export interface SupportedLanguage {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  localeCode: string;
  family: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  description: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    family: 'Romance',
    difficulty: 'Easy',
    description: 'Second most spoken native language worldwide; rich literary and philosophical tradition.'
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    family: 'Romance',
    difficulty: 'Moderate',
    description: 'Language of diplomacy, Enlightenment philosophy, existentialism, and culinary arts.'
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    family: 'Germanic',
    difficulty: 'Moderate',
    description: 'The tongue of Goethe, Kant, Einstein, and European scientific innovation.'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    localeCode: 'ja-JP',
    family: 'Japonic',
    difficulty: 'Challenging',
    description: 'Features three writing systems (Kanji, Hiragana, Katakana) and nuanced levels of politeness.'
  },
  {
    id: 'mandarin',
    name: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    localeCode: 'zh-CN',
    family: 'Sino-Tibetan',
    difficulty: 'Expert',
    description: 'Tonal language with millennia of classical literature, poetry, and strategic wisdom.'
  },
  {
    id: 'italian',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    localeCode: 'it-IT',
    family: 'Romance',
    difficulty: 'Easy',
    description: 'The expressive language of the Renaissance, opera, architecture, and Dante.'
  },
  {
    id: 'russian',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    localeCode: 'ru-RU',
    family: 'Slavic',
    difficulty: 'Challenging',
    description: 'Cyrillic script with six grammatical cases and monumental literary titans (Tolstoy, Dostoevsky).'
  },
  {
    id: 'arabic',
    name: 'Modern Standard Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    localeCode: 'ar-SA',
    family: 'Semitic',
    difficulty: 'Expert',
    description: 'Right-to-left abjad script, root-and-pattern morphology, and the language of classical science.'
  },
  {
    id: 'portuguese',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    localeCode: 'pt-BR',
    family: 'Romance',
    difficulty: 'Easy',
    description: 'Global language spanning Brazil, Portugal, and Africa with rich phonetic rhythm.'
  },
  {
    id: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    localeCode: 'ko-KR',
    family: 'Koreanic',
    difficulty: 'Challenging',
    description: 'Engineered Hangul alphabet designed in 1443 for maximum phonetic scientific precision.'
  }
];

export interface LevelInfo {
  level: CEFRLevel;
  title: string;
  badge: string;
  targetVocab: string;
  description: string;
  defaultXp: number;
}

export const CEFR_LEVELS_META: LevelInfo[] = [
  {
    level: 'A0',
    title: 'Absolute Beginner / Alphabets & Phonics',
    badge: 'A0 Novice',
    targetVocab: 'Alphabet & Phonics',
    description: 'Master the alphabet script, character phonetics, syllable blending, and how to read basic words aloud.',
    defaultXp: 250
  },
  {
    level: 'A1',
    title: 'Beginner / Breakthrough',
    badge: 'A1 Explorer',
    targetVocab: '500+ words',
    description: 'Basic survival phrases, introductions, numbers, and foundational sentence structure.',
    defaultXp: 350
  },
  {
    level: 'A2',
    title: 'Elementary / Waystage',
    badge: 'A2 Practitioner',
    targetVocab: '1,200+ words',
    description: 'Simple routine tasks, past & future events, travel, and personal background.',
    defaultXp: 450
  },
  {
    level: 'B1',
    title: 'Intermediate / Threshold',
    badge: 'B1 Conversationalist',
    targetVocab: '2,500+ words',
    description: 'Express feelings, describe dreams & ambitions, brief reasons, and independent travel.',
    defaultXp: 600
  },
  {
    level: 'B2',
    title: 'Upper Intermediate / Vantage',
    badge: 'B2 Fluency',
    targetVocab: '4,500+ words',
    description: 'Spontaneous interaction with native speakers, technical discussions, and nuanced grammar.',
    defaultXp: 750
  },
  {
    level: 'C1',
    title: 'Advanced / Effective Operational',
    badge: 'C1 Scholar',
    targetVocab: '8,000+ words',
    description: 'Demanding longer texts, implicit meaning, flexible rhetorical and academic discourse.',
    defaultXp: 950
  },
  {
    level: 'C2',
    title: 'Mastery / Polymath Apex',
    badge: 'C2 Grandmaster',
    targetVocab: '12,000+ words',
    description: 'Effortless native-level comprehension, classical idioms, philosophical subtlety, and stylistic mastery.',
    defaultXp: 1300
  }
];

export const LANGUAGE_EXERCISES_DATABASE: LanguageExercise[] = [
  // --- SPANISH (ES) ---
  {
    id: 'es_learn_a1_1',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Core Greetings & Essential Verbs',
    prompt: 'How do you say "Nice to meet you, where are you from?" in Spanish?',
    taskPhrase: 'Mucho gusto, ¿de dónde ______ tú?',
    phonetic: 'MOO-choh GOO-stoh, deh DOHN-deh EH-rehs too?',
    grammarNote: 'The verb "ser" (to be) expresses origin, nationality, and permanent identity. Second person singular (tú) is "eres".',
    options: ['eres', 'estás', 'tienes', 'vives'],
    correctIndex: 0,
    explanation: 'Correct! "De dónde eres" uses the present tense of "ser" (to be) for origin.',
    xpReward: 350
  },
  {
    id: 'es_learn_a1_2',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Everyday Needs & Requests',
    prompt: 'Choose the polite phrasing for "Could you bring me the bill, please?"',
    taskPhrase: '¿Me puede traer la ______, por favor?',
    phonetic: 'meh PWEH-deh trah-EHR lah KWEN-tah, pohr fah-VOHR?',
    grammarNote: '"La cuenta" is feminine singular meaning the bill or account in a restaurant.',
    options: ['cuenta', 'comida', 'propina', 'mesa'],
    correctIndex: 0,
    explanation: 'Correct! "La cuenta" is the standard term for the bill in Spanish restaurants.',
    xpReward: 350
  },
  {
    id: 'es_learn_a2_1',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'learn',
    level: 'A2',
    levelLabel: 'A2 Elementary',
    topic: 'Past Tense: Preterite vs Imperfect',
    prompt: 'Choose the correct preterite form for completed action: "Yesterday I arrived late."',
    taskPhrase: 'Ayer yo ______ tarde al trabajo por la lluvia.',
    phonetic: 'ah-YEHR yoh yeh-GAY TAHR-deh ahl trah-BAH-hoh',
    grammarNote: 'Regular -ar verbs in preterite take -é for first person singular (yo). LLegar has a spelling change: llegué.',
    options: ['llegué', 'llegaba', 'llego', 'llegaré'],
    correctIndex: 0,
    explanation: 'Correct! "Llegué" is the first-person preterite of llegar, indicating a specific completed past event.',
    xpReward: 450
  },
  {
    id: 'es_improve_b1_1',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'B1 Intermediate',
    topic: 'Direct & Indirect Object Pronoun Fusion',
    prompt: 'Replace the nouns with double object pronouns: "I gave the book to Maria."',
    taskPhrase: 'Le di el libro a María → Yo ______ di ayer.',
    phonetic: 'yoh seh loh DEE ah-YEHR',
    grammarNote: 'When indirect pronoun "le" precedes direct pronoun "lo", "le" changes to "se" to avoid harsh alliteration ("se lo di").',
    options: ['se lo', 'le lo', 'me lo', 'te lo'],
    correctIndex: 0,
    explanation: 'Correct! In Spanish, "le lo" becomes "se lo" automatically (la regla de la eufonía).',
    xpReward: 600
  },
  {
    id: 'es_improve_b2_1',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'B2 Upper Intermediate',
    topic: 'Subjunctive Mood in Expressions of Doubt',
    prompt: 'Select the correct present subjunctive verb for expressing uncertainty:',
    taskPhrase: 'Dudo mucho que los científicos ______ una cura definitiva este año.',
    phonetic: 'DOO-doh MOO-choh keh lohs syen-TEE-fee-kohs ehn-KWEN-trehn...',
    grammarNote: 'Verbs of doubt (dudar) trigger the subjunctive mood in the subordinate clause. Encontrar stem-changes to o → ue (encuentren).',
    options: ['encuentren', 'encuentran', 'encontrarán', 'encontraron'],
    correctIndex: 0,
    explanation: 'Correct! "Dudo que" triggers the subjunctive, so "encuentren" is required.',
    xpReward: 750
  },
  {
    id: 'es_improve_c1_1',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'improve',
    level: 'C1',
    levelLabel: 'C1 Advanced',
    topic: 'Imperfect Subjunctive & Contrary-to-Fact Conditionals',
    prompt: 'Complete the hypothetical conditional with the imperfect subjunctive:',
    taskPhrase: 'Si yo ______ más tiempo disponible, habría escrito una tesis doctoral sobre Borges.',
    phonetic: 'see yoh too-VYEH-rah mahs TYEHM-poh...',
    grammarNote: 'The counterfactual conditional "Si + imperfect subjunctive (tuviera), + conditional perfect (habría escrito)" denotes unreal past conditions.',
    options: ['tuviera', 'tendría', 'tuviese sido', 'tenga'],
    correctIndex: 0,
    explanation: 'Correct! "Si tuviera / tuviese" is the classic hypothetical imperfect subjunctive conditional.',
    xpReward: 950
  },
  {
    id: 'es_improve_c2_1',
    languageId: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    goal: 'improve',
    level: 'C2',
    levelLabel: 'C2 Mastery',
    topic: 'Classical Rhetoric & Literary Subtlety',
    prompt: 'Identify the exact poetic term describing an understatement that affirms an idea by denying its contrary (e.g., "no es poco sabio"):',
    taskPhrase: 'La figura retórica consistente en atenuar lo que se afirma negando lo contrario se denomina ______.',
    phonetic: 'lee-TOH-teh oh ah-teh-nwah-SYOHN',
    grammarNote: 'Lítotes (litotes) is a classical Greek-derived figure of speech in Spanish rhetoric where affirmation is expressed via negative negation.',
    options: ['lítote o lítotes', 'hipérbaton', 'sinécdoque', 'anáfora'],
    correctIndex: 0,
    explanation: 'Correct! Lítote is the high-register rhetorical device for affirming through negation.',
    xpReward: 1300
  },

  // --- FRENCH (FR) ---
  {
    id: 'fr_learn_a1_1',
    languageId: 'french',
    languageName: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Basic Introductions & Articles',
    prompt: 'Choose the correct form of "être" (to be) for: "I am a student at the university."',
    taskPhrase: 'Je ______ étudiant à l\'université de la Sorbonne.',
    phonetic: 'zhuh swee ay-tew-dyahn ah lew-nee-vehr-see-tay',
    grammarNote: 'The present tense of "être" for "je" is "suis" (silent s).',
    options: ['suis', 'es', 'est', 'sommes'],
    correctIndex: 0,
    explanation: 'Correct! "Je suis" is the foundational first-person singular of être.',
    xpReward: 350
  },
  {
    id: 'fr_learn_a2_1',
    languageId: 'french',
    languageName: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    goal: 'learn',
    level: 'A2',
    levelLabel: 'A2 Elementary',
    topic: 'Passé Composé with Auxiliary Être',
    prompt: 'Select the past participle agreement: "She went to Paris yesterday."',
    taskPhrase: 'Elle est ______ à Paris hier matin pour ses examens.',
    phonetic: 'ehl ay ahl-lay ah pah-ree yeh mah-tahn',
    grammarNote: 'Verbs conjugated with "être" in passé composé must agree in gender and number with the subject (Elle = feminine singular → allée).',
    options: ['allée', 'allé', 'allés', 'aller'],
    correctIndex: 0,
    explanation: 'Correct! With être auxiliary, feminine subject "elle" requires feminine agreement "-ée".',
    xpReward: 450
  },
  {
    id: 'fr_improve_b1_1',
    languageId: 'french',
    languageName: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'B1 Intermediate',
    topic: 'Pronouns "Y" and "En"',
    prompt: 'Which adverbial pronoun correctly replaces the prepositional phrase "de cette situation"?',
    taskPhrase: 'Nous parlons souvent de cette situation → Nous ______ parlons souvent.',
    phonetic: 'noo zahn pahr-lohn soo-vahn',
    grammarNote: 'The pronoun "en" replaces phrases introduced by the preposition "de" (quantity, origin, or verbs with "parler de").',
    options: ['en', 'y', 'le', 'lui'],
    correctIndex: 0,
    explanation: 'Correct! "En" replaces "de + noun" ("parler de quelque chose").',
    xpReward: 600
  },
  {
    id: 'fr_improve_b2_1',
    languageId: 'french',
    languageName: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'B2 Upper Intermediate',
    topic: 'Subjunctive Mood with Conjunctions',
    prompt: 'Choose the correct subjunctive conjugation after "bien que" (although):',
    taskPhrase: 'Bien qu\'il ______ tard, nous continuons notre recherche philosophique.',
    phonetic: 'byahn keel swah tahr, noo kohn-teen-wohn...',
    grammarNote: 'The concessive conjunction "bien que" always takes the subjunctive mood. The 3rd person singular subjunctive of être is "soit".',
    options: ['soit', 'est', 'sera', 'était'],
    correctIndex: 0,
    explanation: 'Correct! "Bien que" mandates the subjunctive mood ("soit").',
    xpReward: 750
  },
  {
    id: 'fr_improve_c1_1',
    languageId: 'french',
    languageName: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    localeCode: 'fr-FR',
    goal: 'improve',
    level: 'C1',
    levelLabel: 'C1 Advanced',
    topic: 'Subjonctif Passé & Literary Nuance',
    prompt: 'Complete with the past subjunctive for prior necessity:',
    taskPhrase: 'Il est regrettable que vous n\'______ pas pu assister au colloque sur Descartes.',
    phonetic: 'eel ay ruh-greh-tahbl kuh voo nay-yay pah pew...',
    grammarNote: 'The subjonctif passé uses the subjunctive auxiliary (ayez) + past participle (pu) for an action prior to the main clause.',
    options: ['ayez', 'avez', 'auriez', 'eussiez'],
    correctIndex: 0,
    explanation: 'Correct! "Ayez pu" is the appropriate past subjunctive auxiliary for "vous".',
    xpReward: 950
  },

  // --- GERMAN (DE) ---
  {
    id: 'de_learn_a1_1',
    languageId: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Gender & Definite Articles in Nominative',
    prompt: 'Which article correctly marks the masculine noun "Apfel" (apple) in the nominative subject position?',
    taskPhrase: '______ Apfel ist frisch und rot.',
    phonetic: 'dehr AHP-fuhl ist frish oont roht',
    grammarNote: 'German nouns have three genders: der (masculine), die (feminine), das (neuter). Apfel is masculine.',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctIndex: 0,
    explanation: 'Correct! "Der Apfel" is masculine nominative.',
    xpReward: 350
  },
  {
    id: 'de_learn_a2_1',
    languageId: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    goal: 'learn',
    level: 'A2',
    levelLabel: 'A2 Elementary',
    topic: 'Modal Verbs in Present Tense',
    prompt: 'Choose the correct conjugation of "können" (can/able to): "We can solve this problem together."',
    taskPhrase: 'Wir ______ dieses Problem gemeinsam lösen.',
    phonetic: 'veer KUHN-nen DEE-zuhs proh-blaym guh-MYN-zahm LUH-zuhn',
    grammarNote: 'Modal verbs send the infinitive main verb ("lösen") to the absolute end of the clause (Verb-Klammer).',
    options: ['können', 'kann', 'könnt', 'konnten'],
    correctIndex: 0,
    explanation: 'Correct! "Wir können" matches 1st person plural and frames the sentence with the infinitive at the end.',
    xpReward: 450
  },
  {
    id: 'de_improve_b1_1',
    languageId: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'B1 Intermediate',
    topic: 'Subordinate Clauses & Verb-Final Order (weil / dass)',
    prompt: 'Select the sentence with correct verb-final placement after the conjunction "weil" (because):',
    taskPhrase: 'Ich lerne Deutsch, weil ich in Berlin studieren ______.',
    phonetic: 'ikh LEHR-nuh DOYTCH, vyl ikh in behr-LEEN shtoo-DEE-ruhn VIL',
    grammarNote: 'Subordinating conjunctions (weil, dass, obwohl, wenn) force the conjugated finite verb to the very end of the subordinate clause.',
    options: ['will', 'will ich', 'werde wollen', 'wollte ich'],
    correctIndex: 0,
    explanation: 'Correct! The conjugated modal "will" is placed at the very end: "...in Berlin studieren will."',
    xpReward: 600
  },
  {
    id: 'de_improve_b2_1',
    languageId: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'B2 Upper Intermediate',
    topic: 'Konjunktiv II for Politeness & Hypotheticals',
    prompt: 'Choose the subjunctive II form of "wissen" for: "If I knew that, I would tell you."',
    taskPhrase: 'Wenn ich die Antwort ______, würde ich es dir sofort sagen.',
    phonetic: 'vehn ikh dee AHNT-vohrt VUSS-tuh...',
    grammarNote: 'The Konjunktiv II of wissen is "wüsste" (with umlaut and subjunctive ending).',
    options: ['wüsste', 'weiß', 'wusste', 'gewusst hätte'],
    correctIndex: 0,
    explanation: 'Correct! "Wenn ich wüsste..." is the present hypothetical form in German.',
    xpReward: 750
  },
  {
    id: 'de_improve_c1_1',
    languageId: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    localeCode: 'de-DE',
    goal: 'improve',
    level: 'C1',
    levelLabel: 'C1 Advanced',
    topic: 'Passiv-Ersatzformen (Zustandspassiv & Gerundivum)',
    prompt: 'Identify the sophisticated academic construction equivalent to "kann gelöst werden":',
    taskPhrase: 'Diese mathematische Gleichung ist durch einfaches Integrieren ______.',
    phonetic: 'dee-zuh mah-tay-mah-tee-shuh... ist tsoo LUH-zuhn',
    grammarNote: 'The construction "sein + zu + Infinitive" functions as a formal modal passive expressing possibility or necessity.',
    options: ['zu lösen', 'lösend', 'gelöst worden', 'lösbar sein'],
    correctIndex: 0,
    explanation: 'Correct! "ist zu lösen" is the standard academic passive alternative meaning "can / must be solved".',
    xpReward: 950
  },

  // --- JAPANESE (JA) ---
  {
    id: 'ja_learn_a1_1',
    languageId: 'japanese',
    languageName: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    localeCode: 'ja-JP',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'JLPT N5 / A1',
    topic: 'Topic Marker Particle は (wa) & Copula です',
    prompt: 'Which particle indicates the topic of the sentence: "As for me, I am a student"?',
    taskPhrase: '私 ______ 学生です。(Watashi ______ gakusei desu.)',
    phonetic: 'wah-TAH-shee WAH gahk-say DEHS',
    grammarNote: 'The particle は (pronounced "wa" when functioning as a particle) marks the grammatical topic of the clause.',
    options: ['は (wa)', 'が (ga)', 'を (wo)', 'に (ni)'],
    correctIndex: 0,
    explanation: 'Correct! は (wa) is the fundamental topic marker particle in Japanese.',
    xpReward: 350
  },
  {
    id: 'ja_learn_a2_1',
    languageId: 'japanese',
    languageName: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    localeCode: 'ja-JP',
    goal: 'learn',
    level: 'A2',
    levelLabel: 'JLPT N4 / A2',
    topic: 'Te-Form for Sequential Action & Requests',
    prompt: 'Select the polite request: "Please read this book."',
    taskPhrase: 'この本を ______ ください。(Kono hon o ______ kudasai.)',
    phonetic: 'KOH-noh HOHN oh yohn-deh koo-dah-sigh',
    grammarNote: 'Verbs ending in む (mu) like 読む (yomu) undergo onbin sound shift to んで (nde): 読んで (yonde).',
    options: ['読んで (yonde)', '読みて (yomite)', '読まないで (yomanaide)', '読むで (yomude)'],
    correctIndex: 0,
    explanation: 'Correct! 読む (yomu) becomes 読んで (yonde) + ください (kudasai) for polite requests.',
    xpReward: 450
  },
  {
    id: 'ja_improve_b1_1',
    languageId: 'japanese',
    languageName: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    localeCode: 'ja-JP',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'JLPT N3 / B1',
    topic: 'Expressing Objective Cause: ので vs から',
    prompt: 'Choose the soft, polite particle used to state an objective reason for an apology or excuse:',
    taskPhrase: '電車が遅れた ______、会議に遅刻しました。(Densha ga okureta ______, kaigi ni chikoku shimashita.)',
    phonetic: 'dehn-shah gah oh-koo-reh-tah NOH-deh...',
    grammarNote: 'ので (node) presents the reason as an objective circumstance or natural cause, making it standard for polite excuses.',
    options: ['ので (node)', 'のに (noni)', 'でも (demo)', 'より (yori)'],
    correctIndex: 0,
    explanation: 'Correct! ので (node) introduces objective reasoning in courteous business discourse.',
    xpReward: 600
  },
  {
    id: 'ja_improve_b2_1',
    languageId: 'japanese',
    languageName: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    localeCode: 'ja-JP',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'JLPT N2 / B2',
    topic: 'Keigo: Kenjougo (Humble) vs Sonkeigo (Honorific)',
    prompt: 'Select the humble verb (Kenjougo) used when describing your own visit to a professor\'s office:',
    taskPhrase: '明日、先生の教授室に ______ 予定です。(Ashita, sensei no kyoujushitsu ni ______ yotei desu.)',
    phonetic: 'oo-kah-gah-oo yoh-tay dehs',
    grammarNote: '伺う (ukagau) is the humble equivalent (kenjougo) of 行く (to go) and 聞く (to ask), lowering the speaker to elevate the listener.',
    options: ['伺う (ukagau)', 'いらっしゃる (irassharu)', 'おいでになる (oideninaru)', '参られる (mairareru)'],
    correctIndex: 0,
    explanation: 'Correct! 伺う (ukagau) is the proper humble verb for visiting a superior.',
    xpReward: 750
  },

  // --- MANDARIN CHINESE (ZH) ---
  {
    id: 'zh_learn_a1_1',
    languageId: 'mandarin',
    languageName: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    localeCode: 'zh-CN',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'HSK 1 / A1',
    topic: 'Question Particle 吗 (ma) & Pronouns',
    prompt: 'Turn the statement "You are a teacher" into the question "Are you a teacher?":',
    taskPhrase: '你是老师 ______？(Nǐ shì lǎoshī ______?)',
    phonetic: 'nee shrr laow-shrr MAH?',
    grammarNote: 'The neutral tone particle 吗 (ma) at the end of any declarative sentence converts it into a yes/no question without word order change.',
    options: ['吗 (ma)', '呢 (ne)', '吧 (ba)', '啊 (a)'],
    correctIndex: 0,
    explanation: 'Correct! 吗 (ma) creates a standard yes/no question in Chinese.',
    xpReward: 350
  },
  {
    id: 'zh_learn_a2_1',
    languageId: 'mandarin',
    languageName: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    localeCode: 'zh-CN',
    goal: 'learn',
    level: 'A2',
    levelLabel: 'HSK 2 / A2',
    topic: 'Measure Words (Classifiers) 量词',
    prompt: 'Choose the correct classifier for counting books or bound volumes:',
    taskPhrase: '我想买两 ______ 关于中国哲学的书。(Wǒ xiǎng mǎi liǎng ______ guānyú Zhōngguó zhéxué de shū.)',
    phonetic: 'waw shyahng my lyahng BUHN...',
    grammarNote: '本 (běn) is the dedicated measure word for bound literature (books, magazines, dictionaries).',
    options: ['本 (běn)', '个 (gè)', '张 (zhāng)', '支 (zhī)'],
    correctIndex: 0,
    explanation: 'Correct! 本 (běn) is used for books, while 个 (gè) is generic.',
    xpReward: 450
  },
  {
    id: 'zh_improve_b1_1',
    languageId: 'mandarin',
    languageName: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    localeCode: 'zh-CN',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'HSK 3-4 / B1',
    topic: 'Disposal Construction with 把 (bǎ)',
    prompt: 'Complete the sentence emphasizing the disposal/manipulation of the object:',
    taskPhrase: '请你把这份文件 ______ 经理的办公室。(Qǐng nǐ bǎ zhè fèn wénjiàn ______ jīnglǐ de bàngōngshì.)',
    phonetic: 'chyng nee bah juh fuhn wuhn-jyehn SAHNG-DOW...',
    grammarNote: 'In 把 constructions: Subject + 把 + Object + Verb + Complement / Result. "送到" means "deliver to".',
    options: ['送到 (sòng dào)', '送 (sòng)', '在送 (zài sòng)', '想送 (xiǎng sòng)'],
    correctIndex: 0,
    explanation: 'Correct! A 把 construction requires a verb followed by a resultative complement like 到 (dào).',
    xpReward: 600
  },
  {
    id: 'zh_improve_b2_1',
    languageId: 'mandarin',
    languageName: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    localeCode: 'zh-CN',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'HSK 5 / B2',
    topic: 'Four-Character Idioms (Chengyu 成语)',
    prompt: 'Which chengyu means "doing something that ruins the whole enterprise by adding unnecessary details" (literally drawing legs on a snake)?',
    taskPhrase: '这个设计已经完美了，再修改就是 ______ 了。(Zhège shèjì yǐjīng wánměi le, zài xiūgǎi jiùshì ______ le.)',
    phonetic: 'hwah shuh tyehn zoo',
    grammarNote: '画蛇添足 (huà shé tiān zú) originates from the Han dynasty story of painters racing to depict a serpent.',
    options: ['画蛇添足 (huà shé tiān zú)', '守株待兔 (shǒu zhū dài tù)', '掩耳盗铃 (yǎn ěr dào líng)', '盲人摸象 (máng rén mō xiàng)'],
    correctIndex: 0,
    explanation: 'Correct! 画蛇添足 describes ruining an outcome by over-embellishing.',
    xpReward: 750
  },

  // --- ITALIAN (IT) ---
  {
    id: 'it_learn_a1_1',
    languageId: 'italian',
    languageName: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    localeCode: 'it-IT',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Verbo Avere (To have) & Expressions',
    prompt: 'How do you say "I am hungry" in Italian using the idiom with "avere" (to have)?',
    taskPhrase: 'Dopo una lunga camminata, io ______ molta fame.',
    phonetic: 'doh-poh oo-nah loon-gah kahm-mee-nah-tah, yoh OH mohl-tah FAH-meh',
    grammarNote: 'Italian uses "avere fame" (literally to have hunger). First person of avere is "ho" (silent h).',
    options: ['ho', 'sono', 'faccio', 'prendo'],
    correctIndex: 0,
    explanation: 'Correct! "Avere fame" is the idiomatic expression for being hungry.',
    xpReward: 350
  },
  {
    id: 'it_improve_b2_1',
    languageId: 'italian',
    languageName: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    localeCode: 'it-IT',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'B2 Upper Intermediate',
    topic: 'Congiuntivo Presente con Verbi di Opinione',
    prompt: 'Choose the correct subjunctive form: "I think that this book is extraordinary."',
    taskPhrase: 'Penso che questo romanzo di Calvino ______ straordinario.',
    phonetic: 'PEHN-soh keh KWEH-stoh roh-MAHN-zoh see-ah strah-or-dee-NAH-ryoh',
    grammarNote: 'Verbs of thinking and personal opinion (pensare, credere) trigger the congiuntivo. Present subjunctive 3rd person of essere is "sia".',
    options: ['sia', 'è', 'fosse', 'sarà'],
    correctIndex: 0,
    explanation: 'Correct! "Penso che" requires the present subjunctive "sia".',
    xpReward: 750
  },

  // --- RUSSIAN (RU) ---
  {
    id: 'ru_learn_a1_1',
    languageId: 'russian',
    languageName: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    localeCode: 'ru-RU',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Possession with У меня есть (I have)',
    prompt: 'Which construction means "I have a book" in Russian?',
    taskPhrase: '______ есть интересная книга по астрономии.',
    phonetic: 'oo mee-NYA yehst een-tye-REHS-nah-yah KNEE-gah',
    grammarNote: 'Russian expresses possession via the genitive: "У + Genitive (меня) + есть + Nominative subject".',
    options: ['У меня', 'Я имею', 'Мне', 'Обо мне'],
    correctIndex: 0,
    explanation: 'Correct! "У меня есть" is the standard idiomatic construction for possession.',
    xpReward: 350
  },
  {
    id: 'ru_improve_b1_1',
    languageId: 'russian',
    languageName: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    localeCode: 'ru-RU',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'B1 Intermediate',
    topic: 'Verbs of Motion: Unidirectional (идти) vs Multidirectional (ходить)',
    prompt: 'Choose the correct verb for a single journey happening right now in one direction:',
    taskPhrase: 'Сейчас я ______ в университет на лекцию по квантовой физике.',
    phonetic: 'see-CHAHS yah ee-DOO v oo-nee-vehr-see-TYEHT',
    grammarNote: 'Идти denotes current, unidirectional motion on foot. Ходить denotes habitual, round-trip, or multidirectional movement.',
    options: ['иду', 'хожу', 'пошёл', 'езжу'],
    correctIndex: 0,
    explanation: 'Correct! "Иду" is 1st person singular of the unidirectional verb идти.',
    xpReward: 600
  },

  // --- ARABIC (AR) ---
  {
    id: 'ar_learn_a1_1',
    languageId: 'arabic',
    languageName: 'Modern Standard Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    localeCode: 'ar-SA',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Nominal Sentence (الجملة الاسمية) & Greetings',
    prompt: 'How do you say "Welcome, my friend" (to a male friend) in Modern Standard Arabic?',
    taskPhrase: '______ يا صديقي العزيز.',
    phonetic: 'ahlan wa sahlan ya sadeeqi al-aziz',
    grammarNote: 'أهلاً وسهلاً (ahlan wa sahlan) is the universal polite welcome originating from nomad hospitality ("come to family and plain ground").',
    options: ['أهلاً وسهلاً (Ahlan wa Sahlan)', 'مع السلامة (Ma\'a as-Salama)', 'شكراً جزيلاً (Shukran Jazeelan)', 'صباح الخير (Sabah al-Khair)'],
    correctIndex: 0,
    explanation: 'Correct! أهلاً وسهلاً is the standard formal greeting of welcome.',
    xpReward: 350
  },
  {
    id: 'ar_improve_b1_1',
    languageId: 'arabic',
    languageName: 'Modern Standard Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    localeCode: 'ar-SA',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'B1 Intermediate',
    topic: 'The Idafa (الإضافة) Construct for Possession',
    prompt: 'Which phrase correctly forms the possessive Idafa "The director\'s office"?',
    taskPhrase: 'اجتمعنا اليوم في ______ لنتناقش حول المشروع.',
    phonetic: 'fee maktabi al-mudeer',
    grammarNote: 'In an Idafa (genitive construct), the first noun (Muḍāf) drops its definite article "al-" and nunation, while the second noun (Muḍāf ilayh) is definite in the genitive.',
    options: ['مكتبِ المديرِ (Maktabi al-Mudeer)', 'المكتب المدير (Al-Maktab Al-Mudeer)', 'مكتب لمدير (Maktab li-Mudeer)', 'المدير مكتب (Al-Mudeer Maktab)'],
    correctIndex: 0,
    explanation: 'Correct! "مكتب المدير" is the grammatically precise Idafa construction.',
    xpReward: 600
  },

  // --- PORTUGUESE (PT) ---
  {
    id: 'pt_learn_a1_1',
    languageId: 'portuguese',
    languageName: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    localeCode: 'pt-BR',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'A1 Beginner',
    topic: 'Verb Ser vs Estar & Greetings',
    prompt: 'Choose the correct form for expressing temporary state: "How are you today?"',
    taskPhrase: 'Olá, como você ______ hoje?',
    phonetic: 'oh-LAH, KOH-moo voh-SAY ess-TAH OY-zhee?',
    grammarNote: '"Estar" represents temporary physical or emotional conditions, while "ser" marks permanent attributes.',
    options: ['está', 'é', 'tem', 'fica'],
    correctIndex: 0,
    explanation: 'Correct! "Estar" is used for transient conditions like how someone is feeling.',
    xpReward: 350
  },
  {
    id: 'pt_improve_b2_1',
    languageId: 'portuguese',
    languageName: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    localeCode: 'pt-BR',
    goal: 'improve',
    level: 'B2',
    levelLabel: 'B2 Upper Intermediate',
    topic: 'Future Subjunctive (Futuro do Subjuntivo)',
    prompt: 'Select the unique Portuguese future subjunctive form of "fazer" (to do/make): "When you do this..."',
    taskPhrase: 'Quando você ______ esta tarefa, avise a equipe.',
    phonetic: 'KWAHN-doo voh-SAY fee-ZEHR EH-stah tah-REH-fah',
    grammarNote: 'Portuguese uniquely retains the synthetic future subjunctive, conjugated from the preterite stem: fizer, fizeres, fizer.',
    options: ['fizer', 'faz', 'faria', 'tenha feito'],
    correctIndex: 0,
    explanation: 'Correct! "Fizer" is the future subjunctive of fazer.',
    xpReward: 750
  },

  // --- KOREAN (KO) ---
  {
    id: 'ko_learn_a1_1',
    languageId: 'korean',
    languageName: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    localeCode: 'ko-KR',
    goal: 'learn',
    level: 'A1',
    levelLabel: 'TOPIK I / A1',
    topic: 'Polite Informal Ending -아요/어요 and Topic Marker',
    prompt: 'Which polite informal form means "I study Korean every day"?',
    taskPhrase: '저는 매일 한국어를 ______。(Jeoneun maeil hangugeo-reul ______.)',
    phonetic: 'juh-neun may-eel hahn-goo-guh-reul gong-boo-hay-yoh',
    grammarNote: '하다 (hada) verbs take -여요 which contracts to 해요 (haeyo) in present polite informal speech.',
    options: ['공부해요 (gongbuhaeyo)', '공부합니다 (gongbuhamnida)', '공부했어 (gongbuhaesseo)', '공부할래 (gongbuhallae)'],
    correctIndex: 0,
    explanation: 'Correct! 공부해요 is the standard polite informal present tense.',
    xpReward: 350
  },
  {
    id: 'ko_improve_b1_1',
    languageId: 'korean',
    languageName: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    localeCode: 'ko-KR',
    goal: 'improve',
    level: 'B1',
    levelLabel: 'TOPIK II / B1',
    topic: 'Concession & Contrast Connector -는데 / -은데',
    prompt: 'Choose the background connector indicating contrast: "It is raining, but I must go out."',
    taskPhrase: '비가 ______ 외출해야 합니다。(Biga ______ oechulhaeya hamnida.)',
    phonetic: 'bee-gah oh-neun-day way-chool-hay-yah hahm-nee-dah',
    grammarNote: 'Action verbs in present tense attach -는데 to provide background information or contrast before the main clause.',
    options: ['오는데 (oneunde)', '오니까 (onikka)', '와서 (waseo)', '오면 (omyeon)'],
    correctIndex: 0,
    explanation: 'Correct! -는데 sets up the background clause with contrast.',
    xpReward: 600
  }
];

export interface LanguageGrammarTip {
  title: string;
  rule: string;
  example: string;
  translation: string;
}

export const LANGUAGE_CHEATSHEETS: Record<string, LanguageGrammarTip[]> = {
  spanish: [
    {
      title: 'Ser vs. Estar',
      rule: 'Use SER for permanent traits, origin, and identity. Use ESTAR for temporary states, emotions, and locations.',
      example: 'Ella es médica en Madrid (Ser) / Ella está cansada hoy (Estar).',
      translation: 'She is a doctor in Madrid / She is tired today.'
    },
    {
      title: 'Por vs. Para',
      rule: 'POR denotes cause, duration, exchange, or agent. PARA marks destination, deadline, recipient, or purpose.',
      example: 'Estudio para aprender (Purpose) / Gracias por la ayuda (Cause).',
      translation: 'I study in order to learn / Thank you for the help.'
    },
    {
      title: 'Subjunctive Trigger: WEIRDO',
      rule: 'Wishes, Emotions, Impersonal observations, Recommendations, Doubt, Ojalá trigger the subjunctive mood in subordinate clauses.',
      example: 'Quiero que vengas temprano.',
      translation: 'I want you to come early.'
    }
  ],
  french: [
    {
      title: 'Passé Composé vs Imparfait',
      rule: 'Passé composé marks completed pinpoint actions. Imparfait describes ongoing background states, habits, or weather.',
      example: 'Il pleuvait (imparfait) quand je suis sorti (passé composé).',
      translation: 'It was raining when I went outside.'
    },
    {
      title: 'Pronoun "Y" vs "EN"',
      rule: 'Y replaces "à + noun" or location. EN replaces "de + noun" or unspecified quantities.',
      example: 'J\'y vais (I\'m going there) / J\'en veux (I want some of it).',
      translation: 'Going to a place vs. having part of a quantity.'
    }
  ],
  german: [
    {
      title: 'The 4 Cases (Kasus)',
      rule: 'Nominativ (Subject), Akkusativ (Direct object), Dativ (Indirect object / receiver), Genitiv (Possession).',
      example: 'Der Mann (Nom) gibt dem Kind (Dat) den Ball (Akk).',
      translation: 'The man gives the child the ball.'
    },
    {
      title: 'Verb Positions',
      rule: 'Main clause: conjugated verb is second position. Subordinate clause (weil/dass/obwohl): conjugated verb is final.',
      example: 'Ich weiß, dass er heute kommt.',
      translation: 'I know that he is coming today.'
    }
  ],
  japanese: [
    {
      title: 'Topic (は) vs Subject (が)',
      rule: 'は (wa) introduces the shared contextual topic ("As for X..."). が (ga) highlights new or focused subject information.',
      example: '私は猫が好きです (Watashi wa neko ga suki desu).',
      translation: 'As for me, cats are pleasing.'
    },
    {
      title: 'Word Order: SOV',
      rule: 'Subject - Object - Verb. The verb must always conclude the clause in Japanese.',
      example: '学生が本を読みます (Gakusei ga hon o yomimasu).',
      translation: 'The student reads the book.'
    }
  ],
  mandarin: [
    {
      title: 'Four Tones Matter',
      rule: 'Tone 1: High flat (mā). Tone 2: Rising (má). Tone 3: Dipping (mǎ). Tone 4: Sharp drop (mà).',
      example: '妈 (mother) vs 麻 (hemp) vs 马 (horse) vs 骂 (scold).',
      translation: 'Different pitches alter meaning completely.'
    },
    {
      title: 'Measure Words (量词)',
      rule: 'Every noun counted by a numeral requires an intermediary classifier.',
      example: '三本书 (3 books), 两张票 (2 tickets), 一辆车 (1 car).',
      translation: 'Numeral + Measure Word + Noun.'
    }
  ]
};

export const LANGUAGE_ALPHABETS: Record<string, AlphabetChar[]> = {
  japanese: [
    { char: 'あ', transliteration: 'a', name: 'Hiragana A', phoneticSound: '[a] as in father', exampleWord: 'ありがとう', exampleMeaning: 'Thank you' },
    { char: 'い', transliteration: 'i', name: 'Hiragana I', phoneticSound: '[i] as in machine', exampleWord: 'いぬ (inu)', exampleMeaning: 'Dog' },
    { char: 'う', transliteration: 'u', name: 'Hiragana U', phoneticSound: '[u] as in flute', exampleWord: 'うみ (umi)', exampleMeaning: 'Sea' },
    { char: 'え', transliteration: 'e', name: 'Hiragana E', phoneticSound: '[e] as in pet', exampleWord: 'えき (eki)', exampleMeaning: 'Train station' },
    { char: 'お', transliteration: 'o', name: 'Hiragana O', phoneticSound: '[o] as in boat', exampleWord: 'お茶 (ocha)', exampleMeaning: 'Tea' },
    { char: 'か', transliteration: 'ka', name: 'Hiragana Ka', phoneticSound: '[ka] sharp k', exampleWord: 'かわ (kawa)', exampleMeaning: 'River' },
    { char: 'き', transliteration: 'ki', name: 'Hiragana Ki', phoneticSound: '[ki] as in key', exampleWord: 'きょう (kyou)', exampleMeaning: 'Today' },
    { char: 'く', transliteration: 'ku', name: 'Hiragana Ku', phoneticSound: '[ku] as in cook', exampleWord: 'くるま (kuruma)', exampleMeaning: 'Car' },
    { char: 'け', transliteration: 'ke', name: 'Hiragana Ke', phoneticSound: '[ke] as in kettle', exampleWord: 'けさ (kesa)', exampleMeaning: 'This morning' },
    { char: 'こ', transliteration: 'ko', name: 'Hiragana Ko', phoneticSound: '[ko] as in core', exampleWord: 'ことば (kotoba)', exampleMeaning: 'Word/Language' },
    { char: 'さ', transliteration: 'sa', name: 'Hiragana Sa', phoneticSound: '[sa] as in salsa', exampleWord: 'さくら (sakura)', exampleMeaning: 'Cherry blossom' },
    { char: 'し', transliteration: 'shi', name: 'Hiragana Shi', phoneticSound: '[ʃi] as in she', exampleWord: 'しろ (shiro)', exampleMeaning: 'White' },
    { char: 'す', transliteration: 'su', name: 'Hiragana Su', phoneticSound: '[su] soft u', exampleWord: 'すし (sushi)', exampleMeaning: 'Sushi' },
    { char: 'せ', transliteration: 'se', name: 'Hiragana Se', phoneticSound: '[se] as in set', exampleWord: 'せんせい (sensei)', exampleMeaning: 'Teacher' },
    { char: 'そ', transliteration: 'so', name: 'Hiragana So', phoneticSound: '[so] as in solar', exampleWord: 'そら (sora)', exampleMeaning: 'Sky' },
    { char: 'た', transliteration: 'ta', name: 'Hiragana Ta', phoneticSound: '[ta] as in target', exampleWord: 'たべる (taberu)', exampleMeaning: 'To eat' },
    { char: 'ち', transliteration: 'chi', name: 'Hiragana Chi', phoneticSound: '[tʃi] as in cheese', exampleWord: 'ちず (chizu)', exampleMeaning: 'Map' },
    { char: 'つ', transliteration: 'tsu', name: 'Hiragana Tsu', phoneticSound: '[tsu] as in tsunami', exampleWord: 'つき (tsuki)', exampleMeaning: 'Moon' },
    { char: 'て', transliteration: 'te', name: 'Hiragana Te', phoneticSound: '[te] as in tennis', exampleWord: 'て (te)', exampleMeaning: 'Hand' },
    { char: 'と', transliteration: 'to', name: 'Hiragana To', phoneticSound: '[to] as in toast', exampleWord: 'ともだち (tomodachi)', exampleMeaning: 'Friend' },
    { char: 'な', transliteration: 'na', name: 'Hiragana Na', phoneticSound: '[na] nasal', exampleWord: 'なつ (natsu)', exampleMeaning: 'Summer' },
    { char: 'に', transliteration: 'ni', name: 'Hiragana Ni', phoneticSound: '[ni] as in knee', exampleWord: 'にほん (nihon)', exampleMeaning: 'Japan' },
    { char: 'は', transliteration: 'ha', name: 'Hiragana Ha', phoneticSound: '[ha] breathy', exampleWord: 'はな (hana)', exampleMeaning: 'Flower' },
    { char: 'ま', transliteration: 'ma', name: 'Hiragana Ma', phoneticSound: '[ma] as in mama', exampleWord: 'まち (machi)', exampleMeaning: 'Town' },
    { char: 'や', transliteration: 'ya', name: 'Hiragana Ya', phoneticSound: '[ya] glide', exampleWord: 'やま (yama)', exampleMeaning: 'Mountain' },
    { char: 'ら', transliteration: 'ra', name: 'Hiragana Ra', phoneticSound: '[ɾa] tapped flap', exampleWord: 'らいげつ (raigetsu)', exampleMeaning: 'Next month' },
    { char: 'わ', transliteration: 'wa', name: 'Hiragana Wa', phoneticSound: '[wa] open', exampleWord: 'わたし (watashi)', exampleMeaning: 'I / Me' },
    { char: 'ん', transliteration: 'n', name: 'Hiragana N', phoneticSound: '[n/ŋ] nasal coda', exampleWord: 'ほん (hon)', exampleMeaning: 'Book' }
  ],
  korean: [
    { char: 'ㄱ', transliteration: 'g / k', name: 'Giyeok (기역)', phoneticSound: 'Voiced g initially, soft k at end', exampleWord: '가방 (gabang)', exampleMeaning: 'Bag' },
    { char: 'ㄴ', transliteration: 'n', name: 'Nieun (니은)', phoneticSound: '[n] tongue to alveolar ridge', exampleWord: '나무 (namu)', exampleMeaning: 'Tree' },
    { char: 'ㄷ', transliteration: 'd / t', name: 'Digeut (디귿)', phoneticSound: 'Soft d or t', exampleWord: '도시 (dosi)', exampleMeaning: 'City' },
    { char: 'ㄹ', transliteration: 'r / l', name: 'Rieul (리을)', phoneticSound: 'Tapped r between vowels, l at end', exampleWord: '라면 (ramyeon)', exampleMeaning: 'Ramen' },
    { char: 'ㅁ', transliteration: 'm', name: 'Mieum (미음)', phoneticSound: '[m] lips closed', exampleWord: '마음 (maeum)', exampleMeaning: 'Heart/Mind' },
    { char: 'ㅂ', transliteration: 'b / p', name: 'Bieup (비읍)', phoneticSound: 'Bilabial b or p', exampleWord: '바다 (bada)', exampleMeaning: 'Ocean' },
    { char: 'ㅅ', transliteration: 's', name: 'Siot (시옷)', phoneticSound: '[s] before a/o/u, [sh] before i/y', exampleWord: '사람 (saram)', exampleMeaning: 'Person' },
    { char: 'ㅇ', transliteration: 'silent / ng', name: 'Ieung (이응)', phoneticSound: 'Silent before vowels, [ŋ] in final position', exampleWord: '아이 (ai)', exampleMeaning: 'Child' },
    { char: 'ㅈ', transliteration: 'j / ch', name: 'Jieut (지읒)', phoneticSound: 'Soft j or ch', exampleWord: '지도 (jido)', exampleMeaning: 'Map' },
    { char: 'ㅎ', transliteration: 'h', name: 'Hieut (히읗)', phoneticSound: 'Breathy h sound', exampleWord: '하늘 (haneul)', exampleMeaning: 'Sky' },
    { char: 'ㅏ', transliteration: 'a', name: 'Vowel A (아)', phoneticSound: '[a] as in father', exampleWord: '바람 (baram)', exampleMeaning: 'Wind' },
    { char: 'ㅓ', transliteration: 'eo', name: 'Vowel Eo (어)', phoneticSound: '[ʌ] open unrounded', exampleWord: '어머니 (eomeoni)', exampleMeaning: 'Mother' },
    { char: 'ㅗ', transliteration: 'o', name: 'Vowel O (오)', phoneticSound: '[o] rounded lips', exampleWord: '오늘 (oneul)', exampleMeaning: 'Today' },
    { char: 'ㅜ', transliteration: 'u', name: 'Vowel U (우)', phoneticSound: '[u] as in rule', exampleWord: '우유 (uyu)', exampleMeaning: 'Milk' },
    { char: 'ㅡ', transliteration: 'eu', name: 'Vowel Eu (으)', phoneticSound: '[ɯ] smile vowel', exampleWord: '음악 (eum-ak)', exampleMeaning: 'Music' },
    { char: 'ㅣ', transliteration: 'i', name: 'Vowel I (이)', phoneticSound: '[i] as in see', exampleWord: '이야기 (iyagi)', exampleMeaning: 'Story' }
  ],
  russian: [
    { char: 'А а', transliteration: 'a', name: 'A', phoneticSound: '[a] as in father', exampleWord: 'Астра (Astra)', exampleMeaning: 'Star / Aster' },
    { char: 'Б б', transliteration: 'b', name: 'Be', phoneticSound: '[b] as in book', exampleWord: 'Брат (Brat)', exampleMeaning: 'Brother' },
    { char: 'В в', transliteration: 'v', name: 'Ve', phoneticSound: '[v] as in voice', exampleWord: 'Вода (Voda)', exampleMeaning: 'Water' },
    { char: 'Г г', transliteration: 'g', name: 'Ge', phoneticSound: '[g] as in go', exampleWord: 'Город (Gorod)', exampleMeaning: 'City' },
    { char: 'Д д', transliteration: 'd', name: 'De', phoneticSound: '[d] dental d', exampleWord: 'Друг (Drug)', exampleMeaning: 'Friend' },
    { char: 'Е е', transliteration: 'ye / e', name: 'Ye', phoneticSound: '[je] as in yes', exampleWord: 'Если (Yesli)', exampleMeaning: 'If' },
    { char: 'Ё ё', transliteration: 'yo', name: 'Yo', phoneticSound: '[jo] as in yogurt', exampleWord: 'Ёлка (Yolka)', exampleMeaning: 'Fir tree' },
    { char: 'Ж ж', transliteration: 'zh', name: 'Zhe', phoneticSound: '[ʒ] as in measure', exampleWord: 'Жизнь (Zhizn)', exampleMeaning: 'Life' },
    { char: 'З з', transliteration: 'z', name: 'Ze', phoneticSound: '[z] as in zebra', exampleWord: 'Звезда (Zvezda)', exampleMeaning: 'Star' },
    { char: 'И и', transliteration: 'i', name: 'I', phoneticSound: '[i] as in machine', exampleWord: 'Идея (Ideya)', exampleMeaning: 'Idea' },
    { char: 'К к', transliteration: 'k', name: 'Ka', phoneticSound: '[k] crisp k', exampleWord: 'Книга (Kniga)', exampleMeaning: 'Book' },
    { char: 'Л л', transliteration: 'l', name: 'El', phoneticSound: '[l] hard Russian l', exampleWord: 'Луна (Luna)', exampleMeaning: 'Moon' },
    { char: 'М м', transliteration: 'm', name: 'Em', phoneticSound: '[m] as in mother', exampleWord: 'Мир (Mir)', exampleMeaning: 'Peace / World' },
    { char: 'П п', transliteration: 'p', name: 'Pe', phoneticSound: '[p] unaspirated', exampleWord: 'Правда (Pravda)', exampleMeaning: 'Truth' },
    { char: 'Р р', transliteration: 'r', name: 'Er', phoneticSound: '[r] rolled trill', exampleWord: 'Россия (Rossiya)', exampleMeaning: 'Russia' },
    { char: 'С с', transliteration: 's', name: 'Es', phoneticSound: '[s] always crisp s', exampleWord: 'Слово (Slovo)', exampleMeaning: 'Word' },
    { char: 'Т т', transliteration: 't', name: 'Te', phoneticSound: '[t] dental t', exampleWord: 'Теория (Teoriya)', exampleMeaning: 'Theory' },
    { char: 'Ф ф', transliteration: 'f', name: 'Ef', phoneticSound: '[f] as in philosophy', exampleWord: 'Физика (Fizika)', exampleMeaning: 'Physics' },
    { char: 'Х х', transliteration: 'kh / h', name: 'Kha', phoneticSound: '[x] guttural ch as in Bach', exampleWord: 'Хорошо (Khorosho)', exampleMeaning: 'Good' },
    { char: 'Я я', transliteration: 'ya', name: 'Ya', phoneticSound: '[ja] as in yard', exampleWord: 'Я (Ya)', exampleMeaning: 'I / Me' }
  ],
  arabic: [
    { char: 'ا', transliteration: 'alif', name: 'Alif', phoneticSound: 'Long [aː] or glottal carrier', exampleWord: 'أمل (Amal)', exampleMeaning: 'Hope' },
    { char: 'ب', transliteration: 'b', name: 'Baa', phoneticSound: '[b] with single dot below', exampleWord: 'باب (Bab)', exampleMeaning: 'Door' },
    { char: 'ت', transliteration: 't', name: 'Taa', phoneticSound: '[t] with two dots above', exampleWord: 'تمر (Tamr)', exampleMeaning: 'Dates' },
    { char: 'ث', transliteration: 'th', name: 'Thaa', phoneticSound: '[θ] as in think (3 dots)', exampleWord: 'ثورة (Thawra)', exampleMeaning: 'Revolution' },
    { char: 'ج', transliteration: 'j', name: 'Jeem', phoneticSound: '[dʒ] as in joy', exampleWord: 'جامعة (Jami\'ah)', exampleMeaning: 'University' },
    { char: 'ح', transliteration: 'ḥ', name: 'Ḥaa', phoneticSound: '[ħ] pharyngeal unvoiced friction', exampleWord: 'حكمة (Hikma)', exampleMeaning: 'Wisdom' },
    { char: 'خ', transliteration: 'kh', name: 'Khaa', phoneticSound: '[x] velar fricative as in Bach', exampleWord: 'خير (Khair)', exampleMeaning: 'Goodness' },
    { char: 'د', transliteration: 'd', name: 'Daal', phoneticSound: '[d] non-connecting to left', exampleWord: 'دار (Dar)', exampleMeaning: 'House' },
    { char: 'ر', transliteration: 'r', name: 'Raa', phoneticSound: '[r] rolled tapped r', exampleWord: 'روح (Rooh)', exampleMeaning: 'Soul' },
    { char: 'س', transliteration: 's', name: 'Seen', phoneticSound: '[s] three teeth', exampleWord: 'سلام (Salam)', exampleMeaning: 'Peace' },
    { char: 'ش', transliteration: 'sh', name: 'Sheen', phoneticSound: '[ʃ] as in shine', exampleWord: 'شمس (Shams)', exampleMeaning: 'Sun' },
    { char: 'ع', transliteration: '‘', name: 'Ayn', phoneticSound: '[ʕ] deep voiced pharyngeal', exampleWord: 'علم (Ilm)', exampleMeaning: 'Knowledge/Science' },
    { char: 'ق', transliteration: 'q', name: 'Qaaf', phoneticSound: '[q] uvular deep k', exampleWord: 'قلم (Qalam)', exampleMeaning: 'Pen' },
    { char: 'ك', transliteration: 'k', name: 'Kaaf', phoneticSound: '[k] front k', exampleWord: 'كتاب (Kitab)', exampleMeaning: 'Book' },
    { char: 'م', transliteration: 'm', name: 'Meem', phoneticSound: '[m] loop consonant', exampleWord: 'مدينة (Madina)', exampleMeaning: 'City' },
    { char: 'ن', transliteration: 'n', name: 'Noon', phoneticSound: '[n] bowl with dot above', exampleWord: 'نور (Noor)', exampleMeaning: 'Light' }
  ],
  spanish: [
    { char: 'A a', transliteration: 'a', name: 'A', phoneticSound: '[a] open bright ah', exampleWord: 'Agua', exampleMeaning: 'Water' },
    { char: 'B / V', transliteration: 'b / v', name: 'Be / Ve', phoneticSound: 'Soft bilabial fricative [β]', exampleWord: 'Vida / Bien', exampleMeaning: 'Life / Well' },
    { char: 'C c', transliteration: 'c', name: 'Ce', phoneticSound: '[k] before a/o/u; [s] or [θ] before e/i', exampleWord: 'Cielo / Casa', exampleMeaning: 'Sky / House' },
    { char: 'CH ch', transliteration: 'ch', name: 'Che', phoneticSound: '[tʃ] as in chocolate', exampleWord: 'Chocolate', exampleMeaning: 'Chocolate' },
    { char: 'G g', transliteration: 'g', name: 'Ge', phoneticSound: 'Hard [g] before a/o/u; harsh [x] before e/i', exampleWord: 'Gato / Gente', exampleMeaning: 'Cat / People' },
    { char: 'H h', transliteration: 'h', name: 'Hache', phoneticSound: 'Completely silent in Spanish', exampleWord: 'Hola', exampleMeaning: 'Hello' },
    { char: 'J j', transliteration: 'j', name: 'Jota', phoneticSound: '[x] throat rasp like Scottish loch', exampleWord: 'Jardín', exampleMeaning: 'Garden' },
    { char: 'LL ll', transliteration: 'll', name: 'Doble ele', phoneticSound: '[ʝ] or [y] sound as in yellow', exampleWord: 'Lluvia', exampleMeaning: 'Rain' },
    { char: 'Ñ ñ', transliteration: 'ñ', name: 'Eñe', phoneticSound: '[ɲ] nasal ny as in canyon', exampleWord: 'Niño', exampleMeaning: 'Child' },
    { char: 'RR rr', transliteration: 'rr', name: 'Doble erre', phoneticSound: '[r] vibrating rolled tongue trill', exampleWord: 'Perro', exampleMeaning: 'Dog' }
  ],
  french: [
    { char: 'É é', transliteration: 'é', name: 'E accent aigu', phoneticSound: '[e] closed bright ay as in café', exampleWord: 'Étoile', exampleMeaning: 'Star' },
    { char: 'È è', transliteration: 'è', name: 'E accent grave', phoneticSound: '[ɛ] open eh as in bed', exampleWord: 'Père', exampleMeaning: 'Father' },
    { char: 'Ç ç', transliteration: 'ç', name: 'C cédille', phoneticSound: '[s] softens c before a, o, u', exampleWord: 'Français', exampleMeaning: 'French' },
    { char: 'OI', transliteration: 'oi', name: 'Digraph OI', phoneticSound: '[wa] pronounced wah', exampleWord: 'Oiseau', exampleMeaning: 'Bird' },
    { char: 'OU', transliteration: 'ou', name: 'Digraph OU', phoneticSound: '[u] deep oo as in soup', exampleWord: 'Bonjour', exampleMeaning: 'Good day' },
    { char: 'AU / EAU', transliteration: 'eau', name: 'Trigraph EAU', phoneticSound: '[o] pure rounded oh', exampleWord: 'Château', exampleMeaning: 'Castle' },
    { char: 'R r', transliteration: 'r', name: 'R guttural', phoneticSound: '[ʁ] uvular back of throat vibration', exampleWord: 'Raison', exampleMeaning: 'Reason' }
  ],
  german: [
    { char: 'Ä ä', transliteration: 'ä / ae', name: 'A-Umlaut', phoneticSound: '[ɛː] open broad eh', exampleWord: 'Käse', exampleMeaning: 'Cheese' },
    { char: 'Ö ö', transliteration: 'ö / oe', name: 'O-Umlaut', phoneticSound: '[øː] lips rounded in O while saying E', exampleWord: 'Schön', exampleMeaning: 'Beautiful' },
    { char: 'Ü ü', transliteration: 'ü / ue', name: 'U-Umlaut', phoneticSound: '[yː] lips pursed in U while saying EE', exampleWord: 'Über', exampleMeaning: 'Over / Above' },
    { char: 'ß', transliteration: 'ss', name: 'Eszett (Scharfes S)', phoneticSound: '[s] sharp unvoiced double s', exampleWord: 'Straße', exampleMeaning: 'Street' },
    { char: 'CH ch', transliteration: 'ch', name: 'Ich / Ach Laut', phoneticSound: '[ç] soft hiss after e/i; [x] back throat after a/o/u', exampleWord: 'Licht / Nacht', exampleMeaning: 'Light / Night' },
    { char: 'EI ei', transliteration: 'ei', name: 'Diphthong EI', phoneticSound: '[aɪ] eye sound', exampleWord: 'Freiheit', exampleMeaning: 'Freedom' },
    { char: 'EU eu', transliteration: 'eu', name: 'Diphthong EU', phoneticSound: '[ɔʏ] oy sound as in toy', exampleWord: 'Freund', exampleMeaning: 'Friend' }
  ]
};

export const LANGUAGE_PHONICS_WORDS: Record<string, PhonicsWord[]> = {
  japanese: [
    {
      word: 'こんにちは',
      phonetic: 'ko-n-ni-chi-wa',
      syllables: ['こ (ko)', 'ん (n)', 'に (ni)', 'ち (chi)', 'は (wa)'],
      meaning: 'Good afternoon / Hello',
      readingTip: 'The final topic particle は is uniquely pronounced "wa" rather than "ha"!'
    },
    {
      word: 'ありがとう',
      phonetic: 'a-ri-ga-to-u',
      syllables: ['あ (a)', 'り (ri)', 'が (ga)', 'と (to)', 'う (u)'],
      meaning: 'Thank you',
      readingTip: 'The ending と + う forms a prolonged long vowel "tō".'
    },
    {
      word: 'さようなら',
      phonetic: 'sa-yo-u-na-ra',
      syllables: ['さ (sa)', 'よ (yo)', 'う (u)', 'な (na)', 'ら (ra)'],
      meaning: 'Goodbye',
      readingTip: 'Blend よ and う into a smooth long "yō".'
    },
    {
      word: 'ともだち',
      phonetic: 'to-mo-da-chi',
      syllables: ['と (to)', 'も (mo)', 'だ (da)', 'ち (chi)'],
      meaning: 'Friend',
      readingTip: 'Even pitch accent across all 4 morae.'
    }
  ],
  korean: [
    {
      word: '안녕하세요',
      phonetic: 'an-nyeong-ha-se-yo',
      syllables: ['안 (an)', '녕 (nyeong)', '하 (ha)', '세 (se)', '요 (yo)'],
      meaning: 'Hello / Are you at peace?',
      readingTip: 'Batchim (bottom consonant) in 녕 makes a resonant [ŋ] nasal finish before 하!'
    },
    {
      word: '감사합니다',
      phonetic: 'gam-sa-ham-ni-da',
      syllables: ['감 (gam)', '사 (sa)', '합 (hap → ham)', '니 (ni)', '다 (da)'],
      meaning: 'Thank you (Formal)',
      readingTip: 'Nasal assimilation rule: the ㅂ in 합 sounds like [m] when followed by ㄴ in 니!'
    },
    {
      word: '한글',
      phonetic: 'han-geul',
      syllables: ['한 (han)', '글 (geul)'],
      meaning: 'Hangul (The Korean Script)',
      readingTip: '한 = ㅎ + ㅏ + ㄴ (han); 글 = ㄱ + ㅡ + ㄹ (geul). Pure phonetic building blocks!'
    }
  ],
  russian: [
    {
      word: 'Спасибо',
      phonetic: 'spa-SEE-ba',
      syllables: ['Спа (spa)', 'си (see)', 'бо (ba)'],
      meaning: 'Thank you',
      readingTip: 'Vowel reduction (Akan\'ye): Unstressed "о" at the end turns into soft [a]!'
    },
    {
      word: 'Здравствуйте',
      phonetic: 'ZDRAV-stvuy-tye',
      syllables: ['Здрав (zdrav)', 'ствуй (stvuy)', 'те (tye)'],
      meaning: 'Hello (Formal / Polite)',
      readingTip: 'The first "в" in "здрав" is silent in natural spoken Russian!'
    },
    {
      word: 'Хорошо',
      phonetic: 'kha-ra-SHO',
      syllables: ['Хо (kha)', 'ро (ra)', 'шо (sho)'],
      meaning: 'Good / Well',
      readingTip: 'Only the final "о" is stressed; the first two "о" are pronounced like [a]!'
    }
  ],
  arabic: [
    {
      word: 'مَرْحَباً',
      phonetic: 'mar-ha-ban',
      syllables: ['مَرْ (mar)', 'حَ (ha)', 'باً (ban)'],
      meaning: 'Welcome / Hello',
      readingTip: 'Read right to left: Meem with Fatha + Raa Sukun (Mar) + Haa (ha) + Baa with Tanween Fath (ban).'
    },
    {
      word: 'شُكْراً',
      phonetic: 'shuk-ran',
      syllables: ['شُكْ (shuk)', 'راً (ran)'],
      meaning: 'Thank you',
      readingTip: 'Sheen with Damma [u] + Kaaf with Sukun [k] = Shuk; Raa with Tanween = ran.'
    },
    {
      word: 'كِتَابٌ',
      phonetic: 'ki-taa-bun',
      syllables: ['كِ (ki)', 'تَا (taa)', 'بٌ (bun)'],
      meaning: 'A book',
      readingTip: 'The Alif lengthens the vowel after Taa into a prolonged "taa"!'
    }
  ],
  spanish: [
    {
      word: 'Buenos días',
      phonetic: 'BWEH-nohs DEE-ahs',
      syllables: ['Bue (bwe)', 'nos (nos)', 'dí (dee)', 'as (as)'],
      meaning: 'Good morning',
      readingTip: 'The acute accent on "dí-as" breaks the diphthong into two distinct syllables.'
    },
    {
      word: 'Biblioteca',
      phonetic: 'bee-blyoh-TEH-kah',
      syllables: ['bi (bee)', 'blio (blyoh)', 'te (teh)', 'ca (kah)'],
      meaning: 'Library',
      readingTip: 'Every Spanish vowel (a, e, i, o, u) is pure, never diphthongized into a lazy schwa!'
    }
  ],
  french: [
    {
      word: 'Bonjour',
      phonetic: 'bohn-ZHOOR',
      syllables: ['Bon (bohn)', 'jour (zhoor)'],
      meaning: 'Hello / Good day',
      readingTip: '"On" is a rounded nasal vowel; the final "r" is a gentle uvular friction.'
    },
    {
      word: 'S\'il vous plaît',
      phonetic: 'seel voo pleh',
      syllables: ['S\'il (seel)', 'vous (voo)', 'plaît (pleh)'],
      meaning: 'Please (polite)',
      readingTip: 'Final consonants "s" and "t" are silent; "ai" makes a clean [ɛ] sound.'
    }
  ],
  german: [
    {
      word: 'Guten Tag',
      phonetic: 'GOO-tuhn TAHK',
      syllables: ['Gu (goo)', 'ten (tuhn)', 'Tag (tahk)'],
      meaning: 'Good day / Hello',
      readingTip: 'Terminal devoicing: the final "g" in "Tag" hardens into a crisp [k] sound!'
    },
    {
      word: 'Dankeschön',
      phonetic: 'DAHN-kuh-shurn',
      syllables: ['Dan (dahn)', 'ke (kuh)', 'schön (shurn)'],
      meaning: 'Thank you very much',
      readingTip: 'The "ö" requires rounding your lips in an O while pronouncing an E sound!'
    }
  ]
};

