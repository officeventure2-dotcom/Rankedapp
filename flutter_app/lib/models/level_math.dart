import 'dart:math' as math;

/// Hardcore Mathematical Curve implementation for Ranked Flutter
/// Max Level: 1,000 | Total XP: 25,000,000
class LevelMath {
  static const int maxLevel = 1000;
  static const int maxTotalXp = 25000000;

  /// Calculate cumulative XP required to reach a specific level
  static int getCumulativeXpForLevel(int level) {
    if (level <= 1) return 0;
    if (level >= maxLevel) return maxTotalXp;

    final double t = (level - 1) / (maxLevel - 1);
    // Compound cubic polynomial with exponential tail
    final double rawXp = maxTotalXp * (0.15 * t + 0.60 * math.pow(t, 2.2) + 0.25 * math.pow(t, 3.5));
    return rawXp.round();
  }

  /// Calculate current level given total cumulative XP
  static int getLevelFromXp(int xp) {
    if (xp <= 0) return 1;
    if (xp >= maxTotalXp) return maxLevel;

    int low = 1;
    int high = maxLevel;

    while (low <= high) {
      final int mid = (low + high) ~/ 2;
      final int xpForMid = getCumulativeXpForLevel(mid);
      final int xpForNext = getCumulativeXpForLevel(mid + 1);

      if (xp >= xpForMid && xp < xpForNext) {
        return mid;
      } else if (xp < xpForMid) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return maxLevel;
  }

  /// Get Tier Name based on level
  static String getTierForLevel(int level) {
    if (level >= 950) return 'Apex';
    if (level >= 800) return 'Mythic';
    if (level >= 650) return 'Grandmaster';
    if (level >= 500) return 'Master';
    if (level >= 350) return 'Diamond';
    if (level >= 200) return 'Platinum';
    if (level >= 100) return 'Gold';
    if (level >= 40) return 'Silver';
    if (level >= 15) return 'Bronze';
    return 'Novice';
  }
}
