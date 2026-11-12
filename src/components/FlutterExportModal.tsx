import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Download, Sparkles, Smartphone } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface FlutterExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FLUTTER_FILES: Array<{
  filename: string;
  path: string;
  description: string;
  code: string;
}> = [
  {
    filename: 'pubspec.yaml',
    path: 'flutter_app/pubspec.yaml',
    description: 'Dependencies, assets, and Flutter SDK configuration',
    code: `name: ranked_app
description: "Ranked: Polymath Life Mastery RPG (Levels 1-1000) for Android and iOS"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  google_fonts: ^6.2.1
  lucide_icons: ^0.252.0
  google_maps_flutter: ^2.6.0
  provider: ^6.1.2
  confetti: ^0.7.0
  shared_preferences: ^2.2.3
  flutter_vibrate: ^1.3.0

flutter:
  uses-material-design: true`,
  },
  {
    filename: 'main.dart',
    path: 'flutter_app/lib/main.dart',
    description: 'Application entrypoint, dark Material 3 theme & scaffold',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'models/user_profile.dart';
import 'widgets/bottom_nav_bar.dart';
import 'screens/overview_screen.dart';
import 'screens/challenges_screen.dart';
import 'screens/map_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF09090B),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const RankedFlutterApp());
}

class RankedFlutterApp extends StatelessWidget {
  const RankedFlutterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<UserProfile>(
      create: (_) => UserProfile.initial(),
      child: MaterialApp(
        title: 'Ranked: Polymath RPG',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF09090B),
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFFF59E0B),
            secondary: Color(0xFF10B981),
            surface: Color(0xFF18181B),
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
        ),
        home: const MainScaffold(),
      ),
    );
  }
}`,
  },
  {
    filename: 'level_math.dart',
    path: 'flutter_app/lib/models/level_math.dart',
    description: '25,000,000 XP polynomial formula & 1,000 level tiers',
    code: `import 'dart:math' as math;

class LevelMath {
  static const int maxLevel = 1000;
  static const int maxTotalXp = 25000000;

  static int getCumulativeXpForLevel(int level) {
    if (level <= 1) return 0;
    if (level >= maxLevel) return maxTotalXp;

    final double t = (level - 1) / (maxLevel - 1);
    final double rawXp = maxTotalXp * (0.15 * t + 0.60 * math.pow(t, 2.2) + 0.25 * math.pow(t, 3.5));
    return rawXp.round();
  }

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
}`,
  },
  {
    filename: 'bottom_nav_bar.dart',
    path: 'flutter_app/lib/widgets/bottom_nav_bar.dart',
    description: 'Jakob\'s Law glassmorphic bottom bar with Android haptics',
    code: `import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons/lucide_icons.dart';

class GlassBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const GlassBottomNav({super.key, required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final items = [
      {'icon': LucideIcons.home, 'label': 'Home'},
      {'icon': LucideIcons.swords, 'label': 'Arena'},
      {'icon': LucideIcons.compass, 'label': 'Radar'},
      {'icon': LucideIcons.bookOpen, 'label': 'Codex'},
      {'icon': LucideIcons.trophy, 'label': 'Ranks'},
    ];

    return Padding(
      padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            height: 68,
            decoration: BoxDecoration(
              color: const Color(0xFF18181B).withOpacity(0.80),
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Colors.white.withOpacity(0.12)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(items.length, (index) {
                final isSelected = currentIndex == index;
                final item = items[index];

                return GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    onTap(index);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFF59E0B).withOpacity(0.15) : Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(item['icon'] as IconData, size: 22, color: isSelected ? const Color(0xFFF59E0B) : const Color(0xFFA1A1AA)),
                        Text(item['label'] as String, style: TextStyle(fontSize: 10, color: isSelected ? const Color(0xFFF59E0B) : const Color(0xFF71717A))),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}`,
  },
  {
    filename: 'daily_streak_modal.dart',
    path: 'flutter_app/lib/widgets/daily_streak_modal.dart',
    description: 'Exponential streak counter & attendance claim dialog',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/user_profile.dart';

class DailyStreakDialog extends StatelessWidget {
  const DailyStreakDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProfile>(context);
    final int streakBonus = 500 + (user.streakDays * 50);

    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF09090B),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: const Color(0xFF27272A)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.flame, color: Color(0xFFF97316), size: 36),
            const SizedBox(height: 12),
            Text('\${user.streakDays} Day Streak!', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF59E0B), foregroundColor: Colors.black),
              onPressed: user.streakClaimedToday ? null : () {
                HapticFeedback.heavyImpact();
                user.claimStreakBonus(streakBonus);
                Navigator.of(context).pop();
              },
              child: Text(user.streakClaimedToday ? 'Claimed Today ✓' : 'Claim +\$streakBonus XP'),
            ),
          ],
        ),
      ),
    );
  }
}`,
  },
];

export const FlutterExportModal: React.FC<FlutterExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = FLUTTER_FILES[selectedFileIdx];

  const handleCopyCode = () => {
    haptics.tap();
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100 pb-safe">
        
        {/* Mobile Pull Affordance */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mt-2 sm:hidden shrink-0" />
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit'] font-bold text-lg text-white">
                  Flutter App Architecture
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Dart 3.2+ / Android & iOS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Native Flutter project code located at <code className="text-amber-400 font-mono">/flutter_app/</code>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              haptics.tap();
              onClose();
            }}
            aria-label="Close"
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setup command bar */}
        <div className="px-6 py-2.5 bg-zinc-900/40 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-zinc-300">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-zinc-500">Run in terminal:</span>
            <span className="bg-black/60 px-2.5 py-1 rounded-md text-amber-300 select-all border border-zinc-800">
              cd flutter_app && flutter run
            </span>
          </div>
          <span className="text-zinc-400 text-[11px]">
            Compatible with Android Studio & VS Code Flutter extension
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-900/30 p-3 space-y-1 overflow-y-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-3 py-1 block">
              Project Files
            </span>
            {FLUTTER_FILES.map((file, idx) => {
              const active = idx === selectedFileIdx;
              return (
                <button
                  key={file.filename}
                  onClick={() => {
                    haptics.tap();
                    setSelectedFileIdx(idx);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                    active
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden bg-black/50">
            <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-900/50">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-amber-400 font-semibold">
                  {currentFile.path}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {currentFile.description}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy File'}</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-zinc-300">
              <pre className="whitespace-pre">{currentFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>All 6 Flutter source files are present in the app codebase under <code className="text-zinc-200 font-mono">/flutter_app</code></span>
          <button
            onClick={() => {
              haptics.tap();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
