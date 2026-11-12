import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { haptics } from '../utils/haptics';
import {
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Wifi,
  Sparkles,
  X,
  Copy,
  Check,
  Terminal,
  FolderGit2,
  FileCode,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AndroidModalTab = 'studio' | 'pwa';

const ANDROID_STUDIO_FILES: Array<{
  filename: string;
  path: string;
  description: string;
  code: string;
}> = [
  {
    filename: 'MainActivity.kt',
    path: 'android/app/src/main/java/com/ranked/polymath/MainActivity.kt',
    description: 'Kotlin Activity: WebView, Edge-to-Edge HUD, Pull-to-refresh & Geolocation permissions',
    code: `package com.ranked.polymath

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var swipeRefresh: SwipeRefreshLayout

    private val appUrl = "https://ais-dev-3aacztixsi5ls55y6djjav-6916843679.europe-west2.run.app"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        swipeRefresh = findViewById(R.id.swipeRefresh)

        configureWebView()
        setupSwipeRefresh()
        setupBackNavigation()

        webView.loadUrl(appUrl)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.setGeolocationEnabled(true)
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true

        // Register Native JavaScript Bridge for Haptics & System Share
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidNative")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility = View.VISIBLE
            }
            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
                webView.evaluateJavascript("window.isAndroidStudioNative = true;", null)
            }
        }
    }

    private fun setupSwipeRefresh() {
        swipeRefresh.setOnRefreshListener { webView.reload() }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })
    }
}`,
  },
  {
    filename: 'WebAppInterface.kt',
    path: 'android/app/src/main/java/com/ranked/polymath/WebAppInterface.kt',
    description: 'Hardware Bridge: Native vibration haptics and Android system share intent',
    code: `package com.ranked.polymath

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast

class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun triggerHaptic(type: String) {
        val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vm?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        if (vibrator != null && vibrator.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val effect = when (type.lowercase()) {
                    "bump" -> VibrationEffect.createOneShot(25, VibrationEffect.DEFAULT_AMPLITUDE)
                    "success" -> VibrationEffect.createWaveform(longArrayOf(0, 15, 40, 25), -1)
                    else -> VibrationEffect.createOneShot(12, 100)
                }
                vibrator.vibrate(effect)
            }
        }
    }

    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun share(title: String, text: String, url: String) {
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, title)
            putExtra(Intent.EXTRA_TEXT, "$text\\n$url")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(Intent.createChooser(intent, "Share Ranked App").apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        })
    }
}`,
  },
  {
    filename: 'AndroidManifest.xml',
    path: 'android/app/src/main/AndroidManifest.xml',
    description: 'App Manifest: Hardware acceleration, GPS permissions & launcher intent',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Ranked"
        android:hardwareAccelerated="true"
        tools:targetApi="34">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.Ranked.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  },
  {
    filename: 'app/build.gradle',
    path: 'android/app/build.gradle',
    description: 'Android Module: compileSdk 34, AndroidX, Material 3, and SwipeRefreshLayout',
    code: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.ranked.polymath'
    compileSdk 34

    defaultConfig {
        applicationId "com.ranked.polymath"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "2.4.0"
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}`,
  },
  {
    filename: 'settings.gradle',
    path: 'android/settings.gradle',
    description: 'Settings Gradle declaring the :app module and Google Maven repositories',
    code: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "RankedPolymath"
include ':app'`,
  }
];

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isStandalone, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<AndroidModalTab>('studio');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_STUDIO_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    haptics.tap();
    navigator.clipboard.writeText(currentFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    haptics.tap();
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleInstallClick = async () => {
    haptics.bump();
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      haptics.success();
      onClose();
    }
  };

  const handleShareClick = async () => {
    haptics.tap();
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Ranked — Polymath Life RPG (Levels 1–1000)',
          text: 'Compete in the hardcore 1,000-level polymath life RPG. Global GPS map, mind games, and 25M XP mastery curve!',
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden text-zinc-100 flex flex-col relative pb-safe"
        role="dialog"
        aria-modal="true"
      >
        {/* Android Ambient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500" />

        {/* Mobile Pull Affordance */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mt-2 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-zinc-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit'] font-bold text-lg leading-tight text-white">
                  Ranked for Android
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Android Studio Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Native Android Studio Project (Kotlin/Gradle) & Instant Mobile App
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              haptics.tap();
              onClose();
            }}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-1 flex items-center gap-2 border-b border-zinc-800/60 bg-zinc-900/40">
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('studio');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
              activeTab === 'studio'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Android Studio Project (/android)</span>
          </button>

          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('pwa');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
              activeTab === 'pwa'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Install on Phone (PWA APK)</span>
          </button>
        </div>

        {/* Tab 1: Android Studio Project Hub */}
        {activeTab === 'studio' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
            {/* Quick Open Guide */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="font-bold text-white text-sm font-['Outfit']">
                    How to Read & Run in Android Studio
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">SDK 34 · Kotlin 1.9</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300">
                <li>
                  Open <strong>Android Studio</strong> on your computer.
                </li>
                <li>
                  Click <strong>File &gt; Open...</strong> and select the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono">/android</code> directory from this workspace.
                </li>
                <li>
                  Android Studio will automatically detect Gradle, sync dependencies, and index the project.
                </li>
                <li>
                  Click the green <strong>Run ▶</strong> button to build and launch on your phone or emulator!
                </li>
              </ol>

              {/* Terminal command quick copy */}
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
                <div className="flex items-center gap-2 text-zinc-300 truncate">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-zinc-500">$</span>
                  <span className="truncate">cd android && ./gradlew assembleDebug</span>
                </div>
                <button
                  onClick={() => handleCopyCommand('cd android && ./gradlew assembleDebug')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-sans font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {copiedCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Android Studio File Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                  Source Files in /android/
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile ? 'Code Copied!' : 'Copy File Content'}</span>
                </button>
              </div>

              {/* File Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {ANDROID_STUDIO_FILES.map((f, idx) => (
                  <button
                    key={f.filename}
                    onClick={() => {
                      haptics.tap();
                      setSelectedFileIndex(idx);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedFileIndex === idx
                        ? 'bg-zinc-100 text-zinc-900 font-bold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>{f.filename}</span>
                  </button>
                ))}
              </div>

              {/* File Path & Description */}
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="text-[11px] font-mono text-emerald-400 block truncate">{currentFile.path}</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{currentFile.description}</p>
                </div>
              </div>

              {/* Code Box */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 overflow-hidden">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-56 scrollbar-none leading-relaxed">
                  <code>{currentFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PWA / Immediate Mobile Install */}
        {activeTab === 'pwa' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
            {/* App Card Preview */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4">
              <img
                src="/icon.svg"
                alt="Ranked App Icon"
                className="w-16 h-16 rounded-2xl shadow-lg border border-amber-500/30 bg-zinc-950 p-1"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-base truncate">Ranked Polymath RPG</h4>
                <p className="text-xs text-zinc-400">Android PWA & Native APK Package</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Standalone Mode Enabled</span>
                </div>
              </div>
            </div>

            {/* Android Native Features Matrix */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/70 flex items-start gap-2.5">
                <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-zinc-200">Offline Caching</p>
                  <p className="text-[11px] text-zinc-400 leading-snug">Service worker precached for zero latency</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/70 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-zinc-200">Android Haptics</p>
                  <p className="text-[11px] text-zinc-400 leading-snug">Tactile vibration on level ups & buttons</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/70 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-zinc-200">Zero App Store Bloat</p>
                  <p className="text-[11px] text-zinc-400 leading-snug">No 500MB updates, instant home screen launch</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/70 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-zinc-200">Full Immersion</p>
                  <p className="text-[11px] text-zinc-400 leading-snug">Edge-to-edge standalone UI with glass HUD</p>
                </div>
              </div>
            </div>

            {/* Installation Action */}
            {isStandalone || isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                <div className="text-xs">
                  <p className="font-bold text-sm text-emerald-200">App Is Installed</p>
                  <p className="text-emerald-400/80">
                    You are running Ranked in standalone Android app mode.
                  </p>
                </div>
              </div>
            ) : isInstallable ? (
              <div className="space-y-2">
                <button
                  onClick={handleInstallClick}
                  disabled={installing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold font-['Outfit'] text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{installing ? 'Launching Installer...' : 'Install on Android Device'}</span>
                </button>
                <p className="text-[11px] text-center text-zinc-500 font-mono">
                  Adds Ranked icon directly to your Android launcher and app drawer
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs">
                <div className="font-bold text-zinc-200 flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>How to Install on Android Chrome:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Tap the <strong className="text-zinc-200">three dots (⋮)</strong> at top right of Chrome.</li>
                  <li>Select <strong className="text-zinc-200">"Install app"</strong> or <strong className="text-zinc-200">"Add to Home screen"</strong>.</li>
                  <li>Tap <strong className="text-zinc-200">"Install"</strong> to add the Ranked launcher icon.</li>
                </ol>
              </div>
            )}

            {/* Android Share Option */}
            <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
              <span className="text-xs text-zinc-400">Challenge Android friends:</span>
              <button
                onClick={handleShareClick}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-xs font-semibold flex items-center gap-2 active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{shareSuccess ? 'Link Shared! ✓' : 'Share Android App'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Target: Android Studio Hedgehog+ (SDK 34)</span>
          </div>
          <button
            onClick={() => {
              haptics.tap();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
