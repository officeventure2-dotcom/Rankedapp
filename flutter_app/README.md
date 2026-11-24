# Ranked: Polymath Life RPG (Flutter Mobile App)

This is the full **Flutter & Dart** native implementation of **Ranked**, configured for **Android** (APK/AAB) and **iOS**.

## Features Included
- **Hardcore Mathematical Curve**: Level 1 to 1,000 scaling to 25,000,000 XP using polynomial progression (`lib/models/level_math.dart`).
- **Glassmorphic Bottom Navigation**: Floating bottom bar following Jakob's Law with Android haptics (`lib/widgets/bottom_nav_bar.dart`).
- **Daily Attendance Streak**: Exponential consecutive day attendance rewards and level progression (`lib/widgets/daily_streak_modal.dart`).
- **7 Polymath Mastery Pillars**: Real-time progress bars for Trivia, Languages, Books, Cinema, Fitness, Academics, and IQ.
- **Mind Games Arena**: Interactive quiz engine with real-time XP gains.
- **Radar Map HUD**: Edge-to-edge GPS map layout.

---

## How to Run in Android Studio

1. **Install Flutter**: Make sure Flutter SDK is installed (`flutter doctor`).
2. **Open in Android Studio**:
   - Open Android Studio.
   - Choose **File > Open** and select the `flutter_app` folder.
   - Install the **Flutter** and **Dart** plugins if prompted.
3. **Get Dependencies**:
   ```bash
   cd flutter_app
   flutter pub get
   ```
4. **Run on Android Emulator or Device**:
   ```bash
   flutter run
   ```
5. **Build APK for Android**:
   ```bash
   flutter build apk --release
   ```
   The generated APK will be at `build/app/outputs/flutter-apk/app-release.apk`.


## Port status (web app -> Flutter)
Done in this slice: Light/Dark/System theme, Figtree + Bricolage Grotesque fonts, 5-tab bottom nav, lazy Home feed,
Challenges and Knowledge icon hubs with "Pick for me", Profile opening on the Social Feed with a three-dot menu.
Not ported yet: games, books/store, rooms, Daily Rate, direct messages, login. These still live in the React app
and the Cloudflare Worker (`worker/`); there is no Dart backend yet. Old screens (Overview, Map, Trivia) are still dark-only.
This code has not been compiled: run `flutter pub get && flutter analyze` first.
