import 'package:flutter/material.dart';

import '../widgets/hub_tiles.dart';
import 'challenges_screen.dart';

const _challengeItems = [
  HubItem('mind', '1v1 & Solo Mind Games', 'Chess, Connect 4, Sudoku, puzzles', Icons.sports_esports, Color(0xFFF59E0B)),
  HubItem('gut', 'Gut Check', 'Perception tests: count, track, angle, tempo', Icons.visibility, Color(0xFFD946EF)),
  HubItem('rooms', 'Rooms & Streaks', 'Daily quiz with friends', Icons.local_fire_department, Color(0xFFF97316)),
  HubItem('trivia', 'Trivia Arena', 'Test your general knowledge', Icons.auto_awesome, Color(0xFF06B6D4)),
  HubItem('iq', 'IQ & Logic', 'Pattern and reasoning drills', Icons.psychology, Color(0xFF8B5CF6)),
];

const _knowledgeItems = [
  HubItem('academy', 'Video Masterclasses', 'Learn from the best lectures', Icons.smart_display, Color(0xFFEF4444)),
  HubItem('science', 'Science Codex', 'Fact cards across the sciences', Icons.science, Color(0xFF06B6D4)),
  HubItem('language', 'Language Lab', 'Practise and track a language', Icons.language, Color(0xFF10B981)),
  HubItem('books', 'Books', 'Your reading log, classics, and a store', Icons.menu_book, Color(0xFFF59E0B)),
  HubItem('memory', 'Memory', 'Train recall and focus', Icons.memory, Color(0xFF8B5CF6)),
  HubItem('psychology', 'Psychology', 'Understand how minds work', Icons.favorite, Color(0xFFEC4899)),
  HubItem('quran', 'Quran', 'Read and listen', Icons.auto_stories, Color(0xFF14B8A6)),
];

void _openSection(BuildContext context, HubItem item) {
  final Widget page = item.id == 'trivia'
      ? const ChallengesScreen()
      : _ComingSoon(item: item);
  Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => page));
}

class ChallengesHub extends StatelessWidget {
  const ChallengesHub({super.key});
  @override
  Widget build(BuildContext context) => SafeArea(
        child: HubTiles(
          hub: 'challenges',
          title: 'Challenges',
          pickTitle: 'Play',
          items: _challengeItems,
          onOpen: (i) => _openSection(context, i),
        ),
      );
}

class KnowledgeHub extends StatelessWidget {
  const KnowledgeHub({super.key});
  @override
  Widget build(BuildContext context) => SafeArea(
        child: HubTiles(
          hub: 'knowledge',
          title: 'Knowledge',
          pickTitle: 'Learn',
          items: _knowledgeItems,
          onOpen: (i) => _openSection(context, i),
        ),
      );
}

/// Sections not yet ported from the web app.
class _ComingSoon extends StatelessWidget {
  const _ComingSoon({required this.item});
  final HubItem item;
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: Text(item.label)),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Icon(item.icon, size: 56, color: item.color),
              const SizedBox(height: 16),
              Text('${item.label} is still being moved to the Flutter app.',
                  textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleMedium),
            ]),
          ),
        ),
      );
}
