import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/user_profile.dart';

class ChallengesScreen extends StatefulWidget {
  const ChallengesScreen({super.key});

  @override
  State<ChallengesScreen> createState() => _ChallengesScreenState();
}

class _ChallengesScreenState extends State<ChallengesScreen> {
  int _selectedAnswer = -1;
  bool _answered = false;

  final question = "What is the maximum number of pieces a circular pizza can be cut into with 6 straight cuts?";
  final options = ["16", "22", "21", "24"];
  final correctIndex = 1; // Lazy caterer's sequence: n(n+1)/2 + 1 = 6*7/2 + 1 = 22

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProfile>(context, listen: false);

    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF09090B),
        elevation: 0,
        title: const Text('1v1 & Solo Mind Games', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF18181B),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF27272A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(LucideIcons.brain, color: Color(0xFFF59E0B), size: 18),
                      const SizedBox(width: 8),
                      Text('MATHEMATICAL COMBINATORICS', style: TextStyle(color: Colors.amber[400], fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(question, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 20),
                  ...List.generate(options.length, (idx) {
                    final isCorrect = idx == correctIndex;
                    final isChosen = idx == _selectedAnswer;

                    Color bg = const Color(0xFF27272A);
                    Color border = Colors.transparent;

                    if (_answered) {
                      if (isCorrect) {
                        bg = const Color(0xFF10B981).withOpacity(0.2);
                        border = const Color(0xFF10B981);
                      } else if (isChosen) {
                        bg = const Color(0xFFEF4444).withOpacity(0.2);
                        border = const Color(0xFFEF4444);
                      }
                    }

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: InkWell(
                        onTap: _answered ? null : () {
                          setState(() {
                            _selectedAnswer = idx;
                            _answered = true;
                          });
                          if (idx == correctIndex) {
                            user.gainXp(1200, 'iq');
                          }
                        },
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: bg,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: border),
                          ),
                          child: Text(options[idx], style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                        ),
                      ),
                    );
                  }),
                  if (_answered) ...[
                    const SizedBox(height: 12),
                    Text(
                      _selectedAnswer == correctIndex
                          ? '🎉 Correct! Lazy Caterer sequence: n(n+1)/2 + 1 = 22 (+1,200 XP)'
                          : 'Incorrect. The formula gives 22 maximum slices.',
                      style: TextStyle(
                        color: _selectedAnswer == correctIndex ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
