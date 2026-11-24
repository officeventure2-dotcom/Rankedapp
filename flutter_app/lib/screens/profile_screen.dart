import 'package:flutter/material.dart';

import '../data/sample_posts.dart';
import 'overview_screen.dart';

enum _Section { social, info, leaderboard, messages, badges }

const _labels = {
  _Section.social: 'Social Feed',
  _Section.info: 'Info & Pillars',
  _Section.leaderboard: 'Leaderboard',
  _Section.messages: 'Direct Messages',
  _Section.badges: 'Badges Catalog',
};

/// Opens on the Social Feed; every other section is in the three-dot menu.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  _Section _section = _Section.social;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 8, 8),
          child: Row(children: [
            Expanded(child: Text('Profile', style: theme.textTheme.headlineSmall)),
            PopupMenuButton<_Section>(
              tooltip: 'More sections',
              icon: const Icon(Icons.more_vert),
              initialValue: _section,
              onSelected: (s) => setState(() => _section = s),
              itemBuilder: (_) => [
                for (final s in _Section.values) PopupMenuItem(value: s, height: 48, child: Text(_labels[s]!)),
              ],
            ),
          ]),
        ),
        Expanded(child: _body()),
      ]),
    );
  }

  Widget _body() {
    switch (_section) {
      case _Section.social:
        return const _Feed();
      case _Section.info:
        return const OverviewScreen();
      default:
        return Center(child: Text('${_labels[_section]} is still being moved to the Flutter app.'));
    }
  }
}

class _Feed extends StatelessWidget {
  const _Feed();
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 120),
      itemCount: samplePosts.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, i) {
        final p = samplePosts[i];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: theme.dividerColor),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(p.author, style: theme.textTheme.titleMedium),
            Text(p.handle, style: theme.textTheme.bodySmall),
            const SizedBox(height: 12),
            Text(p.title, style: theme.textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(p.body),
            const SizedBox(height: 12),
            Row(children: [
              Text('+${p.xp} XP verified',
                  style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.w700)),
              const Spacer(),
              const Icon(Icons.favorite, size: 18, color: Colors.redAccent),
              const SizedBox(width: 4),
              Text('${p.likes}'),
              const SizedBox(width: 12),
              const Icon(Icons.chat_bubble_outline, size: 18),
              const SizedBox(width: 4),
              Text('${p.comments}'),
            ]),
          ]),
        );
      },
    );
  }
}
