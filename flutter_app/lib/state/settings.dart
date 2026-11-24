import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Theme choice and "what the player opens most", both saved on the device.
class Settings extends ChangeNotifier {
  ThemeMode themeMode = ThemeMode.dark;
  final Map<String, Map<String, int>> _plays = {};
  final _rng = Random();

  static Future<Settings> load() async {
    final s = Settings();
    final prefs = await SharedPreferences.getInstance();
    switch (prefs.getString('ranked_theme')) {
      case 'light':
        s.themeMode = ThemeMode.light;
      case 'system':
        s.themeMode = ThemeMode.system;
      default:
        s.themeMode = ThemeMode.dark;
    }
    for (final hub in ['challenges', 'knowledge']) {
      final raw = prefs.getString('ranked.picks.$hub');
      if (raw == null) continue;
      try {
        s._plays[hub] = (jsonDecode(raw) as Map<String, dynamic>).map((k, v) => MapEntry(k, v as int));
      } catch (_) {
        // corrupt value: start with no history
      }
    }
    return s;
  }

  Future<void> setThemeMode(ThemeMode m) async {
    themeMode = m;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ranked_theme', m.name);
  }

  int playsOf(String hub, String id) => _plays[hub]?[id] ?? 0;

  Future<void> recordPlay(String hub, String id) async {
    final m = _plays.putIfAbsent(hub, () => {});
    m[id] = (m[id] ?? 0) + 1;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ranked.picks.$hub', jsonEncode(m));
  }

  /// Weighted pick: items opened often are likelier, every item keeps a chance.
  String suggest(String hub, List<String> ids, {String? skip}) {
    final pool = ids.length > 1 ? ids.where((i) => i != skip).toList() : ids;
    final weights = pool.map((i) => 1 + 3 * playsOf(hub, i)).toList();
    var r = _rng.nextInt(weights.reduce((a, b) => a + b));
    for (var k = 0; k < pool.length; k++) {
      r -= weights[k];
      if (r < 0) return pool[k];
    }
    return pool.last;
  }
}
