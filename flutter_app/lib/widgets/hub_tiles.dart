import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../state/settings.dart';

class HubItem {
  const HubItem(this.id, this.label, this.blurb, this.icon, this.color);
  final String id;
  final String label;
  final String blurb;
  final IconData icon;
  final Color color;
}

/// Large icon tiles with a "Pick for me" card on top.
class HubTiles extends StatefulWidget {
  const HubTiles({
    super.key,
    required this.hub,
    required this.title,
    required this.pickTitle,
    required this.items,
    required this.onOpen,
  });
  final String hub;
  final String title;
  final String pickTitle;
  final List<HubItem> items;
  final void Function(HubItem item) onOpen;

  @override
  State<HubTiles> createState() => _HubTilesState();
}

class _HubTilesState extends State<HubTiles> {
  late String _pickId;

  List<String> get _ids => widget.items.map((e) => e.id).toList();

  @override
  void initState() {
    super.initState();
    _pickId = context.read<Settings>().suggest(widget.hub, _ids);
  }

  void _open(HubItem item) {
    HapticFeedback.lightImpact();
    context.read<Settings>().recordPlay(widget.hub, item.id);
    widget.onOpen(item);
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<Settings>();
    final theme = Theme.of(context);
    final pick = widget.items.firstWhere((e) => e.id == _pickId);
    final played = settings.playsOf(widget.hub, pick.id) > 0;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
      children: [
        Text(widget.title, style: theme.textTheme.headlineSmall),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.10),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
          ),
          child: Row(children: [
            Icon(pick.icon, color: pick.color, size: 28),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${widget.pickTitle}: ${pick.label}',
                    maxLines: 1, overflow: TextOverflow.ellipsis, style: theme.textTheme.titleMedium),
                Text(played ? 'Based on what you open most' : 'Something different to try',
                    style: theme.textTheme.bodySmall),
              ]),
            ),
            IconButton(
              tooltip: 'Suggest another',
              icon: const Icon(Icons.shuffle),
              onPressed: () => setState(() => _pickId = settings.suggest(widget.hub, _ids, skip: _pickId)),
            ),
            FilledButton.icon(
              onPressed: () => _open(pick),
              icon: const Icon(Icons.play_arrow),
              label: const Text('Play'),
            ),
          ]),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 0.95,
          children: [for (final item in widget.items) _Tile(item: item, onTap: () => _open(item))],
        ),
      ],
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({required this.item, required this.onTap});
  final HubItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Material(
      color: theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: theme.dividerColor),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: item.color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(item.icon, color: item.color, size: 30),
            ),
            const Spacer(),
            Text(item.label, style: theme.textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(item.blurb, maxLines: 3, overflow: TextOverflow.ellipsis, style: theme.textTheme.bodySmall),
          ]),
        ),
      ),
    );
  }
}
