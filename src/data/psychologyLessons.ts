import type { FactTopic } from '../utils/artwork';

/** How well the research behind a lesson holds up. Shown on every lesson. */
export type Evidence = 'strong' | 'moderate' | 'mixed' | 'practical';

export const EVIDENCE_LABEL: Record<Evidence, { label: string; hint: string }> = {
  strong: { label: 'Strong evidence', hint: 'Backed by many studies that have been repeated.' },
  moderate: { label: 'Good evidence', hint: 'Solid research, with some limits or caveats.' },
  mixed: { label: 'Mixed evidence', hint: 'Some well-known findings did not hold up when repeated.' },
  practical: { label: 'Practical advice', hint: 'Common, sensible coaching practice with limited direct research.' }
};

export interface PsychLesson {
  id: string;
  title: string;
  body: string[];
  points: string[];
  /** One small thing to do today. */
  action: string;
  evidence: Evidence;
  source: string;
}

export interface PsychCategory {
  id: string;
  title: string;
  tagline: string;
  /** Picks the picture style and colour for the category. */
  art: FactTopic;
  tile: string;
  /** Optional framing shown above the lessons. */
  note?: string;
  lessons: PsychLesson[];
}

export const PSYCH_CATEGORIES: PsychCategory[] = [
  {
    id: 'confidence',
    title: 'Confidence & Presence',
    tagline: 'The real science behind “being alpha”',
    art: 'earth',
    tile: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    lessons: [
      {
        id: 'conf-1',
        title: 'The “alpha” myth, and what actually works',
        body: [
          'The idea of the “alpha” comes from mid-century studies of captive wolves. The biologist who made the word famous, David Mech, spent decades correcting it: in the wild, a wolf pack is a family, and the so-called alpha is just a parent.',
          'Research on human status points to two different routes to influence. Dominance means winning through intimidation and control. Prestige means earning respect through skill, generosity and sharing what you know. Both can get people to follow you, but prestige makes you liked and trusted, and it lasts.',
          'So the useful question is not “how do I dominate the room?” but “how do I become someone people want around and want to learn from?”'
        ],
        points: [
          'Dominance gets compliance. Prestige gets admiration and loyalty.',
          'Status comes from competence plus warmth, not from volume.',
          'Calm, reliable and generous reads as strong almost everywhere.'
        ],
        action: 'Share something useful today, such as a tip, an introduction or credit for someone’s work, without asking for anything back.',
        evidence: 'strong',
        source: 'Cheng et al., 2013; Mech, 1999'
      },
      {
        id: 'conf-2',
        title: 'Body language that reads as confident',
        body: [
          'People form impressions of you within seconds, and a lot of it comes from posture, pace and eye contact rather than your words.',
          'Aim for an open, relaxed posture: shoulders down, chin level, hands visible. Look at people while they speak, hold it a little longer than feels natural, then look away softly. Slow your speech and let pauses happen. Rushing signals nerves.',
          'One caution about “power poses”: the claim that posing for two minutes changes your hormones did not hold up when other labs repeated it. Stand tall because it helps you breathe, steadies you and makes you look approachable, not because of testosterone.'
        ],
        points: [
          'Open posture, level chin, relaxed shoulders.',
          'Eye contact while you listen matters most.',
          'A slower pace and deliberate pauses sound composed.',
          'Do not expect a pose alone to change your biology.'
        ],
        action: 'In your next conversation, pause for one quiet beat before answering each question. Notice how it feels.',
        evidence: 'mixed',
        source: 'Ranehill et al., 2015 (power-pose replication). The rest is practical coaching.'
      },
      {
        id: 'conf-3',
        title: 'Build real confidence with small proofs',
        body: [
          'Confidence that lasts comes from evidence, not affirmations. Psychologists call it self-efficacy: your belief that you can handle a task. It is built mostly by doing things you were not sure you could do.',
          'Pick something just beyond your comfort zone, split it into steps small enough to finish, and finish them. Each success is proof. For social fears, build a ladder: ask a question in a meeting, then give an opinion, then lead a topic.',
          'Learn to say no kindly and clearly too. State what you will or will not do, give a short reason if you like, and do not over-apologise. Clear boundaries are part of confident behaviour.'
        ],
        points: [
          'Doing builds self-belief faster than pep talks.',
          'Climb a ladder of small, specific challenges.',
          'Assertive means clear and respectful, not aggressive.',
          'Say no without a long apology.'
        ],
        action: 'Write a five-step ladder for one thing that scares you, and do step one before tonight.',
        evidence: 'strong',
        source: 'Bandura, 1977'
      }
    ]
  },
  {
    id: 'partner',
    title: 'Finding Your Person',
    tagline: 'Soulmates, chemistry and how love really starts',
    art: 'body',
    tile: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    lessons: [
      {
        id: 'partner-1',
        title: 'Soulmate or growth? Your belief matters',
        body: [
          'Some people believe in destiny: there is one perfect person, and it should feel effortless. Others believe in growth: good relationships are built through effort and by working through problems. Researchers have studied both beliefs.',
          'Destiny believers often feel strong early sparks, but they tend to give up sooner when the first real disagreement arrives, because friction feels like proof that it is the wrong person. Growth believers tend to cope better with problems and stay longer.',
          'You can still look for chemistry and shared values. The upgrade is to treat compatibility as something you grow, not only something you find.'
        ],
        points: [
          'Chemistry opens the door. Habits keep the relationship alive.',
          'Conflict is normal. It is not proof of a mismatch.',
          'Look for “good match plus willing to work”, not “perfect”.'
        ],
        action: 'Finish this sentence honestly: “If I met someone great but we disagreed about something important, I would…”',
        evidence: 'moderate',
        source: 'Knee, 1998'
      },
      {
        id: 'partner-2',
        title: 'Where love actually starts',
        body: [
          'Most relationships begin with simple ingredients: seeing the same person repeatedly, shared interests, and a sense of being understood. The first is called proximity, or the mere-exposure effect: we tend to like what is familiar.',
          'So go where the same people turn up week after week: a class, a sports club, a volunteering group, a regular event. You get repeated, low-pressure contact with people who share your interests, which is how many friendships and romances grow.',
          'If you use dating apps, treat them as an introduction, not a verdict. Write a profile that sounds like you, keep a few chats going, and move to meeting in person within a week or two instead of texting for weeks.'
        ],
        points: [
          'Repeated contact builds liking.',
          'Choose activities you would enjoy even if you meet no one.',
          'Hobbies start conversations. Values and kindness sustain a relationship.',
          'Move from chat to a real meeting fairly soon.'
        ],
        action: 'Pick one regular activity you could join this month, and find its next date.',
        evidence: 'moderate',
        source: 'Festinger, Schachter & Back, 1950; Zajonc, 1968'
      },
      {
        id: 'partner-3',
        title: 'Know your attachment style',
        body: [
          'Attachment theory describes how early bonds shape what we expect from closeness. In adults it is often grouped as secure, anxious (a fear of being left) or avoidant (discomfort with closeness).',
          'Anxious styles tend to seek lots of reassurance. Avoidant styles tend to pull away when things get close. Put those two together and you can get a painful chase-and-retreat pattern. Securely attached people are generally comfortable with both closeness and independence.',
          'Styles are not fixed labels. Awareness, a responsive partner and sometimes therapy can move people toward security. Notice your pattern, tell a partner about it, and choose people who respond reliably when you need them.'
        ],
        points: [
          'Anxious: needs reassurance. Avoidant: needs space. Secure: flexible.',
          'Patterns can change with awareness and good relationships.',
          'Say what you need instead of testing the other person.'
        ],
        action: 'Think of your last two relationship stresses. Did you cling, withdraw or talk it through? Write what you needed at that moment.',
        evidence: 'moderate',
        source: 'Hazan & Shaver, 1987; Ainsworth et al., 1978'
      },
      {
        id: 'partner-4',
        title: 'Choose responsiveness, not just sparks',
        body: [
          'Perceived partner responsiveness is the feeling that your partner understands, values and cares for you. It is one of the strongest predictors of closeness and satisfaction in relationship research.',
          'Watch for it early on. Do they listen and remember? Are they kind to waiters and friends? Do they show interest when you share something good or hard? Do they respect a no?',
          'Green flags: curiosity, consistency, taking responsibility, kindness under stress. Red flags: contempt, controlling behaviour, pressure about your boundaries, or blaming you for their reactions. If someone controls who you see, what you wear or your money, that is a serious warning sign. Talk to a trusted friend or a local support service.'
        ],
        points: [
          'Responsiveness predicts lasting closeness.',
          'Watch how they treat people who cannot do anything for them.',
          'Control, contempt and pressure are red flags.'
        ],
        action: 'On your next meet-up, notice one moment that shows how they treat someone with nothing to offer them.',
        evidence: 'strong',
        source: 'Reis, Clark & Holmes, 2004'
      }
    ]
  },
  {
    id: 'romance',
    title: 'Romantic Relationships',
    tagline: 'Closeness, conflict and keeping love alive',
    art: 'mind',
    tile: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
    lessons: [
      {
        id: 'rom-1',
        title: 'Build closeness with real conversation',
        body: [
          'Closeness grows when two people take turns sharing something a little more personal each time, and the other responds with real interest. In a well-known experiment, pairs of strangers answered 36 increasingly personal questions together and felt much closer afterwards.',
          'You do not need the whole list. Try “what has been on your mind lately?”, “what were you like as a kid?” and “what are you looking forward to?” Share your own answer too. Closeness needs two-way sharing, not an interview.',
          'This builds closeness rather than guaranteeing love, but it is a solid foundation.'
        ],
        points: [
          'Share a little more each time, and respond with interest.',
          'Take turns. Reciprocity matters.',
          'Curiosity is attractive.'
        ],
        action: 'Ask your partner or a new friend one question you have never asked them, and share your own answer.',
        evidence: 'strong',
        source: 'Aron et al., 1997'
      },
      {
        id: 'rom-2',
        title: 'Small “bids” build big trust',
        body: [
          'All day long, partners make small bids for attention: “look at that bird”, a sigh, a joke, a hand reaching for yours. You can turn toward the bid, ignore it, or turn against it.',
          'In long-term studies of couples, those who stayed together and happy turned toward each other’s bids far more often. It is the tiny moments, not the grand gestures, that build trust.',
          'Researchers also find that stable couples keep a ratio of about five positive moments to every negative one during conflict. Warmth is the bank account you draw on when things get hard.'
        ],
        points: [
          'Notice bids: a comment, a look, a touch.',
          'Turn toward them, even briefly.',
          'Keep warmth far higher than criticism.'
        ],
        action: 'Today, notice three small bids from people close to you and answer each with eye contact and a few words.',
        evidence: 'strong',
        source: 'Gottman, 1994; Driver & Gottman, 2004'
      },
      {
        id: 'rom-3',
        title: 'How to argue without wrecking things',
        body: [
          'How a hard conversation starts usually predicts how it ends. Start softly: describe the situation and how you feel, then make a clear request. “I feel overwhelmed when the dishes pile up. Could we split them?” beats “You never help.”',
          'Watch for four danger signs: criticism, contempt (sneering, eye-rolling, mockery), defensiveness and stonewalling. Contempt is the most damaging. The antidotes are a gentle start, appreciation, taking responsibility and calming yourself.',
          'If your heart is racing and you cannot think, you are “flooded”. Say you need a break, take at least twenty minutes to settle, and come back to it. Pausing is not avoiding if you return.'
        ],
        points: [
          'Begin with “I feel… about… I need…”',
          'Avoid contempt above all.',
          'Take a 20-minute break when flooded, then come back.'
        ],
        action: 'Rewrite one complaint you have as: “I feel…, about…, and I need…”',
        evidence: 'strong',
        source: 'Gottman, 1994'
      },
      {
        id: 'rom-4',
        title: 'Keep it alive: novelty and celebrating wins',
        body: [
          'Couples who do new, slightly exciting things together report higher relationship quality. The idea, called self-expansion, is that relationships feel alive when they help us grow.',
          'Celebrate each other’s good news too. When your partner shares a win, respond actively and warmly (“That is amazing, tell me everything!”) instead of giving a flat “nice” or changing the subject. Researchers find this “capitalizing” strengthens relationships even more than support in bad times.',
          'Add gratitude: thank each other for specific small things. Appreciation counters the drift into taking each other for granted.'
        ],
        points: [
          'Do new things together, even small ones.',
          'Respond to good news with real enthusiasm.',
          'Thank each other for specific things.'
        ],
        action: 'Plan one thing neither of you has done before this week, such as a new walking route or a new recipe.',
        evidence: 'moderate',
        source: 'Aron et al., 2000; Gable et al., 2004'
      }
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership & Influence',
    tagline: 'Lead people so they want to follow',
    art: 'history',
    tile: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
    lessons: [
      {
        id: 'lead-1',
        title: 'Create psychological safety',
        body: [
          'In a large study of its own teams, Google found that psychological safety was the most important factor in team success. It is the shared belief that you can speak up, ask a question or admit a mistake without being punished or embarrassed. Harvard’s Amy Edmondson first described it.',
          'As a leader you create it by admitting your own mistakes, asking for input before giving yours, thanking people who bring bad news, and treating errors as information. When people hide problems, small issues become big ones.'
        ],
        points: [
          'People speak up when it is safe to be wrong.',
          'Go first: admit your own mistakes.',
          'Thank people who bring bad news.'
        ],
        action: 'Ask your team: “What is one thing I could do differently?” and thank the first honest answer.',
        evidence: 'strong',
        source: 'Edmondson, 1999; Google Project Aristotle, 2015'
      },
      {
        id: 'lead-2',
        title: 'Motivate with choice, challenge and connection',
        body: [
          'Self-determination theory says people are most motivated when they feel autonomy (some say over how they work), competence (they are getting better) and relatedness (they belong).',
          'Give specific, challenging goals instead of vague “do your best”, because clear goals with real feedback lift performance. Then let people choose how to reach them. Micromanaging removes autonomy and usually lowers motivation.',
          'Recognise progress and effort out loud, and link the work to why it matters to people.'
        ],
        points: [
          'Clear, challenging goals beat “do your best”.',
          'Let people choose the method.',
          'Recognise progress and connect work to purpose.'
        ],
        action: 'Take one task you are controlling closely and hand over the “how”, keeping a clear “what” and a date.',
        evidence: 'strong',
        source: 'Deci & Ryan, 2000; Locke & Latham, 2002'
      },
      {
        id: 'lead-3',
        title: 'Give feedback people can use',
        body: [
          'Good feedback is specific, timely and about behaviour, not character. “In the meeting you interrupted Sam twice” is something a person can act on. “You are rude” is not.',
          'A simple structure is situation, behaviour, impact, then ask. “In yesterday’s review (situation) you presented the numbers without a summary (behaviour), so we lost the room (impact). How do you see it?” Listen to their view, agree a next step, and follow up.',
          'Give praise the same way: specific and sincere. And ask for feedback yourself. It shows people what you expect from them.'
        ],
        points: [
          'Talk about behaviour, not personality.',
          'Situation, behaviour, impact, then ask.',
          'Praise specifically, and ask for feedback too.'
        ],
        action: 'Give one person specific praise today that names the exact thing they did and its effect.',
        evidence: 'practical',
        source: 'Situation-Behavior-Impact model (Center for Creative Leadership)'
      }
    ]
  },
  {
    id: 'communication',
    title: 'Communication & Social Skills',
    tagline: 'Be easier to talk to and easier to like',
    art: 'tech',
    tile: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    lessons: [
      {
        id: 'comm-1',
        title: 'Ask more questions, especially follow-ups',
        body: [
          'In a set of studies, people who asked more questions in a conversation were liked more by their partners, and follow-up questions had the strongest effect. In speed-dating, those who asked more questions were more likely to get second dates.',
          'A follow-up shows you listened: “What made you choose that?” or “How did that feel?” Keep it natural. Balance questions with sharing about yourself so it does not feel like an interview.'
        ],
        points: [
          'Questions show interest, and interest is liked.',
          'Follow-ups beat switching topics.',
          'Balance asking with sharing.'
        ],
        action: 'In your next conversation, ask at least two follow-up questions before changing the subject.',
        evidence: 'strong',
        source: 'Huang et al., 2017'
      },
      {
        id: 'comm-2',
        title: 'The liking gap: they like you more than you think',
        body: [
          'After a first conversation, people tend to underestimate how much the other person liked them. Researchers call this the liking gap. It showed up among strangers, workshop groups and new roommates, and it lasted for months.',
          'The reason is that we judge ourselves harshly and notice our own awkward moments, while the other person is mostly focused on their own side of the conversation.',
          'In practice: assume goodwill, send the follow-up message, and make the invitation. You are probably better received than your inner critic says.'
        ],
        points: [
          'We usually underestimate how liked we are.',
          'Your awkward moments are rarely noticed.',
          'Reach out. The other person likely wants to hear from you.'
        ],
        action: 'Message someone you enjoyed talking to and suggest meeting again.',
        evidence: 'strong',
        source: 'Boothby et al., 2018'
      },
      {
        id: 'comm-3',
        title: 'Listen so people feel heard',
        body: [
          'Most people wait for their turn to talk. Listening well is rarer, and people notice it.',
          'Put your phone away. Let them finish. Reflect back what you heard (“So you felt left out when…”) before you respond. Ask whether they want advice or just support, since the two are very different. Resist jumping in with your own story or a quick fix.',
          'When people feel understood, they relax, share more and trust you more.'
        ],
        points: [
          'Phone away, full attention.',
          'Reflect back before you respond.',
          'Ask: “Do you want advice or just support?”'
        ],
        action: 'Next time someone tells you a problem, summarise it back and ask “Do you want ideas, or do you just want me to listen?”',
        evidence: 'practical',
        source: 'Active listening (Rogers & Farson, 1957)'
      }
    ]
  },
  {
    id: 'habits',
    title: 'Habits & Mindset',
    tagline: 'Turn good intentions into daily routine',
    art: 'math',
    tile: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    lessons: [
      {
        id: 'habit-1',
        title: 'If-then plans beat willpower',
        body: [
          'Wanting to change is not enough. A simple trick called an implementation intention links a specific cue to a specific action: “If it is 7 a.m., then I put on my running shoes.”',
          'Across nearly a hundred studies, people who made if-then plans were far more likely to follow through on goals than people who only intended to. The plan hands the decision to the situation, so you do not have to rely on motivation in the moment.',
          'Make them concrete, and plan for obstacles too: “If I feel too tired, then I do just five minutes.”'
        ],
        points: [
          'Pick a clear cue, such as a time, a place or an event.',
          'Write it as “If X, then I will Y.”',
          'Plan for the obstacle in advance.'
        ],
        action: 'Write one if-then plan for a habit you want, and one for the main thing that usually stops you.',
        evidence: 'strong',
        source: 'Gollwitzer & Sheeran, 2006'
      },
      {
        id: 'habit-2',
        title: 'How long habits really take',
        body: [
          'The “21 days” rule is a myth. In a study that followed people building a new daily habit, it took a median of 66 days to feel automatic, and anywhere from 18 to 254 days depending on the person and the habit.',
          'The encouraging part: missing a single day did not ruin progress. What matters is getting back on the next day.',
          'Keep the habit tiny, tie it to something you already do, and expect it to take a couple of months. A good rule of thumb is to never miss twice.'
        ],
        points: [
          'Expect about two months, with big variation.',
          'One missed day does not break a habit.',
          'Start tiny and attach it to an existing routine.'
        ],
        action: 'Choose a habit that takes under two minutes and attach it to something you already do every day.',
        evidence: 'strong',
        source: 'Lally et al., 2010'
      },
      {
        id: 'habit-3',
        title: 'Growth mindset, honestly',
        body: [
          'Carol Dweck’s idea is that believing your abilities can grow helps you take on challenges and keep trying after setbacks. The idea is useful, but the research needs honest framing.',
          'Large studies find the average effect is small, though it is more helpful for students who are struggling and in settings that actually support effort and learning. Telling people to “just believe” is not enough.',
          'The practical version: focus on strategies and effort, use the word “yet” (“I can’t do this yet”), and treat mistakes as information about what to practise next.'
        ],
        points: [
          'Effort and strategy matter more than slogans.',
          '“Not yet” is a better sentence than “I can’t”.',
          'Effects are modest, so pair the mindset with real practice.'
        ],
        action: 'Think of something you say you are bad at, and rewrite it as “I have not learned X yet. The next step is…”',
        evidence: 'mixed',
        source: 'Sisk et al., 2018; Yeager et al., 2019'
      }
    ]
  },
  {
    id: 'emotions',
    title: 'Emotions & Stress',
    tagline: 'Understand and steady your inner world',
    art: 'chemistry',
    tile: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
    lessons: [
      {
        id: 'emo-1',
        title: 'Name it to tame it',
        body: [
          'Putting a feeling into words can turn its volume down. In brain-imaging studies, labelling an emotion (“I feel anxious”) reduced activity in the amygdala, a region involved in threat responses.',
          'Be as specific as you can. “Bad” is vague. Is it disappointed, embarrassed, overwhelmed, lonely? People who can tell emotions apart finer tend to handle them better.',
          'You can also reappraise: ask what else the situation might mean. A racing heart before a talk can be read as “I am ready” rather than “I am panicking”.'
        ],
        points: [
          'Naming a feeling helps settle it.',
          'Use precise words, not just “bad” or “stressed”.',
          'Reappraise: what else could this mean?'
        ],
        action: 'Three times today, pause and finish the sentence “Right now I feel…” with the most precise word you can find.',
        evidence: 'moderate',
        source: 'Lieberman et al., 2007; Gross, 2002'
      },
      {
        id: 'emo-2',
        title: 'Slow breathing that settles you',
        body: [
          'Breathing is one of the few body functions you can control that also affects your nervous system. Long, slow exhales tell your body it is safe.',
          'In a study of 108 people, five minutes a day of “cyclic sighing” improved mood more than mindfulness meditation did over a month. To do it: breathe in through the nose, take a second short sip of air on top, then breathe out slowly through the mouth for as long as is comfortable.',
          'It is not a medical treatment, but it is a free, quick tool for tense moments. If anxiety is constant or overwhelming, speak to a doctor or therapist.'
        ],
        points: [
          'Longer exhale than inhale.',
          'Double inhale through the nose, long exhale through the mouth.',
          'Five minutes a day was enough in the study.'
        ],
        action: 'Do two minutes of cyclic sighing now, and note how your body feels afterwards.',
        evidence: 'moderate',
        source: 'Balban et al., 2023'
      },
      {
        id: 'emo-3',
        title: 'Be kind to yourself, it works',
        body: [
          'Self-compassion has three parts: treating yourself kindly when you struggle, remembering that everyone struggles (common humanity), and noticing painful feelings without being swallowed by them.',
          'Research links it to greater resilience, less rumination and less anxiety. A common worry is that it makes you lazy, but studies suggest people who are kinder to themselves are more willing to admit mistakes and try again.',
          'A simple test: how would you talk to a close friend in the same situation? Say that to yourself.'
        ],
        points: [
          'Kind, not harsh, when you fail.',
          'Struggle is part of being human.',
          'Self-compassion supports accountability instead of replacing it.'
        ],
        action: 'Next time you criticise yourself, rewrite the thought the way you would say it to a friend.',
        evidence: 'moderate',
        source: 'Neff, 2003'
      }
    ]
  },
  {
    id: 'people',
    title: 'Reading People',
    tagline: 'Biases, first impressions and what body language can’t tell you',
    art: 'physics',
    tile: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    lessons: [
      {
        id: 'ppl-1',
        title: 'You can’t read minds from body language',
        body: [
          'Many books claim you can spot lies from a glance or a gesture. When researchers combined hundreds of studies, people were right only about 54% of the time when judging lies and truth, barely better than a coin flip. Trained professionals did little better.',
          'No single gesture, such as crossed arms or looking away, reliably means a person is lying or insecure. Those signs can simply mean someone is cold, shy or thinking.',
          'A better approach: notice changes from a person’s normal behaviour, consider the context, and then ask. Curiosity beats mind-reading.'
        ],
        points: [
          'Lie detection by gut feeling is close to chance.',
          'One gesture means very little on its own.',
          'Look for changes from their baseline, then ask.'
        ],
        action: 'When you catch yourself “reading” someone, write down one other explanation for what you saw.',
        evidence: 'strong',
        source: 'Bond & DePaulo, 2006'
      },
      {
        id: 'ppl-2',
        title: 'First impressions: fast but fallible',
        body: [
          'People form judgements about traits such as trustworthiness from a face in a tenth of a second, and those quick judgements tend to match what they decide after longer looks. That speed feels like insight, but it is not a good measure of the person.',
          'It also works on you: others form snap judgements about you. You can help by starting with warmth, a genuine smile and a clear greeting, which gives people a good first read to build on.',
          'When it matters, such as who to hire, trust or date, give impressions time and look at behaviour over weeks, not minutes.'
        ],
        points: [
          'Snap judgements happen in a fraction of a second.',
          'Fast is not the same as accurate.',
          'Judge people by behaviour over time.'
        ],
        action: 'Think of someone you misjudged at first. What did you notice later that changed your mind?',
        evidence: 'moderate',
        source: 'Willis & Todorov, 2006'
      },
      {
        id: 'ppl-3',
        title: 'Two biases that warp how you see others',
        body: [
          'Confirmation bias: once we hold a belief about someone, we notice what supports it and miss what does not. If you decide a coworker is lazy, you will remember every late report and forget the times they stayed late.',
          'Fundamental attribution error: we explain other people’s behaviour by their character (“he is rude”) but our own by circumstances (“I was stressed”). We rarely give others the same context we give ourselves.',
          'The fix is a habit of curiosity: ask “what else could explain this?” and “what would I think if a friend did it?”. It makes you fairer and easier to work with.'
        ],
        points: [
          'We collect evidence for what we already believe.',
          'We excuse ourselves and judge others’ character.',
          'Ask for the other explanation.'
        ],
        action: 'Think of someone who irritates you. List two circumstances that might explain what they do.',
        evidence: 'strong',
        source: 'Nickerson, 1998; Ross, 1977'
      }
    ]
  },
  {
    id: 'dark',
    title: 'Dark Psychology',
    tagline: 'Spot manipulation and protect yourself',
    art: 'space',
    tile: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    note: 'These lessons are about recognising and resisting manipulation, so it cannot be used on you. They are not a guide to using it on others.',
    lessons: [
      {
        id: 'dark-1',
        title: 'What “dark psychology” really means',
        body: [
          'Dark psychology is the study of how people influence others in ways that serve themselves at the other person’s expense. Influence on its own is normal and often healthy. Manipulation is influence that works by getting around your free, informed choice: through pressure, deception, guilt or fear.',
          'Researchers group three personality traits as the “Dark Triad”: narcissism (entitlement and a need for admiration), Machiavellianism (strategic, cynical use of others) and psychopathy (low empathy and impulsiveness). Everyone has some of these traits to a degree. It is a spectrum, not a club of villains.',
          'You do not need to diagnose anyone. Labels are unreliable, and amateur diagnosis often goes wrong. Focus on patterns of behaviour instead: does this person respect your “no”, own their mistakes and treat you the same in private as in public?'
        ],
        points: [
          'Manipulation bypasses your informed choice. Healthy influence respects it.',
          'Traits exist on a spectrum, so avoid snap diagnoses.',
          'Judge repeated behaviour, not labels.'
        ],
        action: 'Think of someone you trust. List two behaviours that show they respect your choices, so you know what the healthy version looks like.',
        evidence: 'moderate',
        source: 'Paulhus & Williams, 2002'
      },
      {
        id: 'dark-2',
        title: 'Influence tricks, and how they get misused',
        body: [
          'Robert Cialdini identified a handful of powerful shortcuts in how people decide: reciprocity (we repay favours), commitment (we stay consistent with what we have said), social proof (we follow the crowd), authority, liking and scarcity. Used honestly, they help people make good choices. Used manipulatively, they push you into bad ones.',
          'Common misuses: a “free gift” that creates a sense of debt; a tiny request that is followed by bigger ones once you have said yes (the foot-in-the-door effect); a huge request you refuse, followed by a smaller one that now feels reasonable (door-in-the-face); fake countdown timers and “only 2 left”; and fake testimonials or fake experts.',
          'The defence is to slow down. Ask: “Would I choose this if there were no pressure, no deadline and no one watching?” If the answer is no, the pressure is doing the persuading, not the offer.'
        ],
        points: [
          'The six levers: reciprocity, commitment, social proof, authority, liking, scarcity.',
          'Urgency and small first steps are classic pressure tools.',
          'Delay the decision and check the facts on your own.'
        ],
        action: 'The next time you feel rushed to decide, say: “I will let you know tomorrow.” Notice how the person reacts.',
        evidence: 'strong',
        source: 'Cialdini, 1984; Freedman & Fraser, 1966; Cialdini et al., 1975'
      },
      {
        id: 'dark-3',
        title: 'Gaslighting: when you are made to doubt yourself',
        body: [
          'The word comes from a 1944 film in which a husband dims the gas lights and insists his wife is imagining it. Today it describes a pattern in which someone repeatedly denies or rewrites what happened so that you doubt your memory, perception or sanity: “That never happened”, “You are too sensitive”, “You are imagining things”.',
          'Everyone misremembers things now and then, and honest disagreements are not gaslighting. The warning sign is a pattern: denial plus blame, especially when it happens in a relationship with a power imbalance and when it leaves you more isolated and less sure of yourself.',
          'Protect your reality: keep brief notes or messages about important events, check your memory with a trusted friend, and notice if you are apologising constantly for things you did not do. If it is serious or ongoing, a counsellor can help you see the pattern clearly.'
        ],
        points: [
          'A pattern of denying and blaming, not a one-off disagreement.',
          'It often leaves you doubting yourself and more isolated.',
          'Keep records and reality-check with people you trust.'
        ],
        action: 'If something important keeps being “remembered” differently, write down what was said and when, in a private note.',
        evidence: 'practical',
        source: 'Sweet, 2019 (The Sociology of Gaslighting)'
      },
      {
        id: 'dark-4',
        title: 'Love bombing and the hot-cold cycle',
        body: [
          'Love bombing is an overwhelming rush of attention and affection at the very start: constant messages, big gifts, “you are my soulmate” within days, and pressure to commit fast. It feels wonderful, and that is the point. It creates attachment before you have had time to see who the person really is.',
          'It is often followed by a shift: the warmth becomes unpredictable, criticism appears, and you find yourself working to win back the early attention. That mix of high rewards and sudden withdrawal is powerfully hooking, much like a slot machine.',
          'Fast and intense is not automatically sinister, since plenty of people are just enthusiastic. What matters is whether the person respects your pace and stays consistent. Healthy love can handle “let us slow down” without punishing you for it.'
        ],
        points: [
          'Too much, too fast is worth noticing.',
          'Watch for the switch from warmth to criticism or withdrawal.',
          'Test the pace: a safe person respects “slow down”.'
        ],
        action: 'If you are dating someone intense, say “I would like to take this a bit slower” and watch whether they respect it.',
        evidence: 'practical',
        source: 'Clinical and coercive-control literature. Direct research is still limited.'
      },
      {
        id: 'dark-5',
        title: 'Coercive control and isolation',
        body: [
          'Sociologist Evan Stark described coercive control as an ongoing pattern of domination in a relationship, rather than a series of separate incidents. It can include monitoring your phone and movements, controlling money, dictating what you wear or who you see, constant criticism, and threats.',
          'A key feature is isolation. Step by step, the person may criticise your friends and family, make visits difficult or create drama until it feels easier to stop seeing them. As your support shrinks, their control grows. Physical violence is not required for it to be abuse.',
          'If this sounds familiar: keep or rebuild contact with people you trust, tell someone what is happening, and keep important documents and some money somewhere safe. Contact a local domestic abuse helpline or support service, or emergency services if you are in danger. Leaving can be the riskiest time, so get advice on planning it safely.'
        ],
        points: [
          'It is a pattern of control, not just arguments.',
          'Isolation from friends and family is a major warning sign.',
          'Reach out to a trusted person or a local support service.'
        ],
        action: 'Check in with a friend or family member you have not spoken to for a while. Keeping your connections strong protects you.',
        evidence: 'moderate',
        source: 'Stark, 2007 (Coercive Control)'
      },
      {
        id: 'dark-6',
        title: 'Guilt, fear and obligation: emotional blackmail',
        body: [
          'Therapist Susan Forward described emotional blackmail as threats, spoken or implied, that you will be punished if you do not comply. It often runs on three levers, nicknamed FOG: fear (of anger, loss or consequences), obligation (“after everything I have done for you”) and guilt (“you are so selfish”).',
          'Typical forms include the silent treatment, threats to leave, playing the victim, or bringing up your past mistakes to win the current argument. It works because most of us care about being good and about the relationship.',
          'When you notice it, pause and name it in your head: “This is pressure, not a request.” You can show care without giving in: “I can see you are upset, and I am not going to decide while we are like this. Let us talk again tomorrow.” Stay calm, repeat your position, and do not negotiate against threats.'
        ],
        points: [
          'FOG: fear, obligation and guilt.',
          'Silent treatment and threats are pressure tactics.',
          'Pause, name it, and repeat your boundary calmly.'
        ],
        action: 'Practise one calm sentence you can use to postpone a decision under pressure, such as: “I will think about it and get back to you.”',
        evidence: 'practical',
        source: 'Forward & Frazier, 1997'
      },
      {
        id: 'dark-7',
        title: 'Dark patterns and online persuasion',
        body: [
          'Some apps and websites are designed to trick you: “dark patterns” such as hidden unsubscribe buttons, pre-ticked boxes that sign you up for extras, fake scarcity (“3 people are looking at this”), guilt-trip wording (“No thanks, I do not like saving money”), and endless feeds with no natural stopping point.',
          'Repetition works on us too. In studies, statements we have heard many times feel more true, even when they are false, a phenomenon called the illusory truth effect. Outrage-driven posts spread quickly for similar reasons: strong emotion grabs attention and shares.',
          'Defences: slow down before you click or share, read the small print, check whether a claim comes from a source you can verify, and be suspicious of anything designed to make you feel rushed, angry or afraid. Turning off non-essential notifications also removes many nudges.'
        ],
        points: [
          'Hidden options, fake scarcity and guilt wording are dark patterns.',
          'Repeated claims feel true even when they are not.',
          'Pause before you click, buy or share.'
        ],
        action: 'Turn off notifications for one app that interrupts you, and cancel one subscription you no longer use.',
        evidence: 'moderate',
        source: 'Gray et al., 2018; Hasher, Goldstein & Toppino, 1977'
      },
      {
        id: 'dark-8',
        title: 'Your defence toolkit',
        body: [
          'You cannot prevent every attempt to manipulate you, but a few habits make you much harder to push around.',
          'Notice: your body often knows first, with a tight chest, a rush, or a feeling of being cornered. Name the tactic: urgency, flattery, guilt, an isolating comment. Delay: use the 24-hour rule for big decisions, because manipulation depends on speed. Verify: check claims independently and ask for things in writing. Set boundaries: say what you will and will not do, and calmly repeat it. Build support: people who know your situation are your best protection.',
          'Finally, hold yourself to the same standard. A simple transparency test for your own influence: “Would I be comfortable if this person saw exactly how and why I am doing this?” If not, you have crossed from persuasion into manipulation.'
        ],
        points: [
          'Notice, name, delay, verify, set boundaries and build support.',
          'Speed and pressure are the manipulator’s friends.',
          'Use the transparency test on your own behaviour too.'
        ],
        action: 'Write your own rule for big decisions, such as “I do not agree to anything important on the same day it is asked.”',
        evidence: 'practical',
        source: 'Synthesis of the lessons above; common practice in coaching and counselling'
      }
    ]
  }
];

/** Rough reading time in minutes for a lesson. */
export function readMinutes(lesson: PsychLesson): number {
  const words = [...lesson.body, ...lesson.points, lesson.action].join(' ').split(/\s+/).length;
  return Math.max(1, Math.round(words / 190));
}

export function lessonCount(): number {
  return PSYCH_CATEGORIES.reduce((n, c) => n + c.lessons.length, 0);
}
