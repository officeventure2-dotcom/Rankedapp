import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'models/user_profile.dart';
import 'screens/hub_screens.dart';
import 'screens/home_screen.dart';
import 'screens/map_screen.dart';
import 'screens/profile_screen.dart';
import 'state/settings.dart';
import 'theme/app_theme.dart';
import 'widgets/bottom_nav_bar.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final settings = await Settings.load();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<Settings>.value(value: settings),
        ChangeNotifierProvider<UserProfile>(create: (_) => UserProfile.initial()),
      ],
      child: const RankedFlutterApp(),
    ),
  );
}

class RankedFlutterApp extends StatelessWidget {
  const RankedFlutterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ranked',
      debugShowCheckedModeBanner: false,
      themeMode: context.watch<Settings>().themeMode,
      theme: AppTheme.build(Brightness.light),
      darkTheme: AppTheme.build(Brightness.dark),
      home: const MainScaffold(),
    );
  }
}

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

  static const _screens = <Widget>[
    HomeScreen(),
    ChallengesHub(),
    MapScreen(),
    KnowledgeHub(),
    ProfileScreen(), // opens on the Social Feed
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(index: _currentIndex, children: _screens),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: GlassBottomNav(
              currentIndex: _currentIndex,
              onTap: (index) => setState(() => _currentIndex = index),
            ),
          ),
        ],
      ),
    );
  }
}
