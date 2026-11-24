import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/sample_posts.dart';
import '../state/settings.dart';

/// Home: a feed that builds lazily as you scroll, plus the appearance setting.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
        itemCount: 1 + 200,
        itemBuilder: (_, i) {
          if (i == 0) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(children: [
                Expanded(child: Text('Ranked', style: theme.textTheme.headlineSmall)),
                IconButton(
                  tooltip: 'Appearance',
                  icon: const Icon(Icons.tune),
                  onPressed: () => showModalBottomSheet<void>(context: context, builder: (_) => const _AppearanceSheet()),
                ),
              ]),
            );
          }
          final p = samplePosts[(i - 1) % samplePosts.length];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              title: Text(p.title, style: theme.textTheme.titleMedium),
              subtitle: Padding(padding: const EdgeInsets.only(top: 6), child: Text(p.body)),
            ),
          );
        },
      ),
    );
  }
}

class _AppearanceSheet extends StatelessWidget {
  const _AppearanceSheet();
  @override
  Widget build(BuildContext context) {
    final s = context.watch<Settings>();
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Appearance', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 4),
        const Text('System follows your phone\'s setting.'),
        const SizedBox(height: 16),
        SegmentedButton<ThemeMode>(
          segments: const [
            ButtonSegment(value: ThemeMode.system, label: Text('System'), icon: Icon(Icons.brightness_auto)),
            ButtonSegment(value: ThemeMode.light, label: Text('Light'), icon: Icon(Icons.light_mode)),
            ButtonSegment(value: ThemeMode.dark, label: Text('Dark'), icon: Icon(Icons.dark_mode)),
          ],
          selected: {s.themeMode},
          onSelectionChanged: (v) => s.setThemeMode(v.first),
        ),
      ]),
    );
  }
}
