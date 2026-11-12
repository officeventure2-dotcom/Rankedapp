import 'package:flutter/foundation.dart';
import 'level_math.dart';

class UserProfile with ChangeNotifier {
  String id;
  String name;
  String handle;
  int xp;
  int streakDays;
  bool streakClaimedToday;
  Map<String, int> pillarMastery;

  UserProfile({
    required this.id,
    required this.name,
    required this.handle,
    required this.xp,
    required this.streakDays,
    required this.streakClaimedToday,
    required this.pillarMastery,
  });

  int get level => LevelMath.getLevelFromXp(xp);
  String get tier => LevelMath.getTierForLevel(level);

  int get currentLevelBaseXp => LevelMath.getCumulativeXpForLevel(level);
  int get nextLevelTargetXp => LevelMath.getCumulativeXpForLevel(level + 1);

  double get levelProgress {
    final int base = currentLevelBaseXp;
    final int next = nextLevelTargetXp;
    if (next <= base) return 1.0;
    return ((xp - base) / (next - base)).clamp(0.0, 1.0);
  }

  void gainXp(int amount, String pillar) {
    xp += amount;
    if (pillarMastery.containsKey(pillar)) {
      pillarMastery[pillar] = ((pillarMastery[pillar] ?? 50) + 2).clamp(0, 100);
    }
    notifyListeners();
  }

  void claimStreakBonus(int bonusXp) {
    if (!streakClaimedToday) {
      streakClaimedToday = true;
      gainXp(bonusXp, 'fitness');
      notifyListeners();
    }
  }

  static UserProfile initial() {
    return UserProfile(
      id: 'usr_me',
      name: 'Alex Hunter',
      handle: '@alexhunter',
      xp: 142500,
      streakDays: 42,
      streakClaimedToday: false,
      pillarMastery: {
        'trivia': 78,
        'languages': 64,
        'reading': 85,
        'cinema': 70,
        'fitness': 92,
        'academics': 60,
        'iq': 88,
      },
    );
  }
}
