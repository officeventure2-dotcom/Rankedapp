# Ranked Polymath RPG — Android Studio Project

This directory contains the complete, native **Android Studio** project for **Ranked: Polymath Life Mastery RPG (Levels 1–1,000)**.

---

## 🚀 How to Open in Android Studio

1. **Launch Android Studio** (Hedgehog, Iguana, Jellyfish, Koala, or newer).
2. Click **File** > **Open...**
3. Navigate to this repository and select the **`android`** folder (or the repository root).
4. Click **OK**.
5. Android Studio will automatically:
   - Detect the Gradle project.
   - Sync Gradle dependencies (Android SDK 34, AndroidX, Kotlin 1.9.22).
   - Index the source files.

---

## 📱 How to Run on an Emulator or Real Device

1. Connect your physical Android phone (with **USB Debugging** enabled) or select an **Android Virtual Device (AVD)** emulator from the device dropdown.
2. Click the green **Run ▶** button (or press `Shift + F10`).
3. The app will compile and install on your device.

---

## 📦 How to Build an APK or Android App Bundle (AAB)

### Option A: Via Android Studio Menu
1. Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. When finished, click **locate** to find your compiled `app-debug.apk`.

### Option B: Via Terminal / Command Line
Inside the `android/` directory:

```bash
# On Linux / macOS:
./gradlew assembleDebug

# On Windows:
gradlew.bat assembleDebug
```

The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🛠 Project Architecture & Features

- **Namespace:** `com.ranked.polymath`
- **Minimum SDK:** 24 (Android 7.0 Nougat+)
- **Target SDK:** 34 (Android 14 UpsideDownCake)
- **Language:** Kotlin 1.9.22 + Java 17
- **Key Files:**
  - `MainActivity.kt`: Hardware accelerated WebView with Edge-to-Edge display, SwipeRefreshLayout, Geolocation permission requests, and deep link routing.
  - `WebAppInterface.kt`: Native JavaScript bridge exposing Android haptic feedback (`VibratorManager`), Android system share sheet, and native alerts directly to the web view (`window.AndroidNative`).
  - `AndroidManifest.xml`: Declares permissions for GPS Geolocation Radar, Vibrations, and Network state.
  - `themes.xml` & `colors.xml`: Implements the dark polymath UI motif matching Android Material 3 DayNight specs.
