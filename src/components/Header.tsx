import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { getTierForLevel, getTierColor } from '../utils/levelMath';
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Bell,
  Check,
  SlidersHorizontal,
  Flame,
  Smartphone,
  Palette,
  MoreVertical,
  X,
  ChevronRight,
  User,
  Shield,
  Layers
} from 'lucide-react';
import { haptics } from '../utils/haptics';
import { Avatar } from './Avatar';

export const Header: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    setWearablesModalOpen,
    setNotificationsModalOpen,
    setStreakModalOpen,
    setAndroidModalOpen,
    setFlutterModalOpen,
    switchProfile
  } = useRanked();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tier = getTierForLevel(user.level);
  const tierStyle = getTierColor(tier);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Brand Wordmark & Level Badge (Smartphone Touch Ergonomics) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('overview');
            }}
            className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg group p-1 -ml-1 min-h-[44px] min-w-[44px]"
            aria-label="Home Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold font-['Outfit'] text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight font-['Outfit'] text-zinc-900 dark:text-zinc-50 whitespace-nowrap leading-none">
                Ranked
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
                POLYMATH RPG
              </span>
            </div>
          </button>

          {/* Quick Active Tier Pill (Visible on both mobile & desktop) */}
          <div className="flex items-center pl-2 sm:pl-3 border-l border-zinc-200 dark:border-zinc-800">
            <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold border ${tierStyle.badgeBorder} ${tierStyle.badgeBg} ${tierStyle.badgeText}`}>
              Lv.{user.level} <span className="hidden xs:inline">· {tier.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Sovereign Curve Indicator (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-100/70 dark:bg-zinc-900/60 px-3 py-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px]">25M XP Sovereign Curve Active</span>
        </div>

        {/* Zone 3: Primary Actions & User Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Daily Login Streak Counter & Attendance Reward Button */}
          <button
            onClick={() => {
              haptics.bump();
              setStreakModalOpen(true);
            }}
            title={`Daily Login Streak: ${user.streakDays} Days Unbroken. ${user.streakClaimedToday ? 'Bonus Claimed Today ✓' : 'Daily Attendance Bonus Available! 🎁'}`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all min-h-[38px] sm:min-h-[40px] ${
              !user.streakClaimedToday
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400 shadow-sm animate-pulse'
                : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${!user.streakClaimedToday ? 'text-orange-500 fill-orange-500' : 'text-zinc-400'}`} />
            <span>{user.streakDays}d</span>
            {!user.streakClaimedToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          {/* Theme Palette Gallery Trigger */}
          <button
            onClick={() => {
              haptics.tap();
              setWearablesModalOpen(true);
            }}
            aria-label="Theme & Appearance Settings"
            title={`Active Theme: ${theme.toUpperCase()} (Click to open Theme Gallery & Settings)`}
            className="p-2 text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
          </button>

          {/* DESKTOP ONLY: Extended Action Buttons (Hidden on Mobile for Clean Ergonomics) */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {/* Quick Audio Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
              title={soundEnabled ? 'Audio Chimes Enabled' : 'Audio Muted'}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
            </button>

            {/* Quick Light/Dark Switch */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Quick Toggle: Switch to Light Mode' : 'Quick Toggle: Switch to Dark Mode'}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Android App & Studio Project Hub */}
            <button
              onClick={() => {
                haptics.tap();
                setAndroidModalOpen(true);
              }}
              title="Ranked for Android: Studio Project (/android) & APK"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors shrink-0"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Studio</span>
            </button>

            {/* Flutter Mobile App Hub */}
            <button
              onClick={() => {
                haptics.tap();
                setFlutterModalOpen(true);
              }}
              title="Ranked in Flutter: Complete Dart source code"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-colors shrink-0"
            >
              <span className="font-mono text-cyan-400 font-bold">F</span>
              <span>Flutter</span>
            </button>

            {/* Settings & Connected Apps Hub CTA */}
            <button
              onClick={() => setWearablesModalOpen(true)}
              title="Settings: Sync Reading Apps (Goodreads/Kindle), Movie Apps (Letterboxd) & Fitness Wearables"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Settings</span>
            </button>

            {/* Push Notifications Hub CTA */}
            <button
              onClick={() => setNotificationsModalOpen(true)}
              aria-label="Push notifications settings"
              title="Goal reminders & push notifications"
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            </button>
          </div>

          {/* SMARTPHONE ONLY: Consolidated Quick Controls Sheet Trigger */}
          <button
            onClick={() => {
              haptics.tap();
              setMobileMenuOpen(true);
            }}
            aria-label="Open mobile quick settings"
            className="md:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center relative"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* User Profile Pill & Quick Account Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                haptics.tap();
                setProfileDropdownOpen(prev => !prev);
              }}
              className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-2.5 sm:py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors bg-zinc-50 dark:bg-zinc-900/80 min-h-[38px] min-w-[38px]"
              aria-label="User Account"
            >
              <Avatar src={user.avatar} name={user.name} className="w-7 h-7 rounded-lg object-cover" />
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  Lvl {user.level}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {tier}
                </span>
              </div>
            </button>

            {/* Desktop Profile / Account Switcher Dropdown */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{user.handle} · Level {user.level} {tier}</p>
                  <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
                    {user.xp.toLocaleString()} Total XP
                  </p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                    Switch Active Persona:
                  </p>

                  <button
                    onClick={() => switchProfile('usr_me')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">Alex Hunter</p>
                      <p className="text-[10px] text-zinc-500">Level 342 · Expert</p>
                    </div>
                    {user.id === 'usr_me' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>

                  <button
                    onClick={() => switchProfile('usr_elena')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">Elena Rostova</p>
                      <p className="text-[10px] text-zinc-500">Level 742 · Grandmaster (Ultra Runner)</p>
                    </div>
                    {user.id === 'usr_elena' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>

                  <button
                    onClick={() => switchProfile('usr_marcus')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">Dr. Marcus Vance</p>
                      <p className="text-[10px] text-zinc-500">Level 989 · Mythic (10 Years Mastery)</p>
                    </div>
                    {user.id === 'usr_marcus' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ==========================================================================
          SMARTPHONE QUICK ACTION DRAWER / BOTTOM SHEET
          ========================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-2xl pb-safe animate-in slide-in-from-bottom duration-250">
            
            {/* Grab handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700/80 mx-auto -mt-1 mb-2" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-['Outfit']">
                    Mobile Quick Controls
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    System toggles, app exports, & persona options
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick System Toggles Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  haptics.tap();
                  toggleSound();
                }}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Audio Chimes</p>
                    <p className="text-[10px] text-zinc-400">{soundEnabled ? 'Enabled' : 'Muted'}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  haptics.tap();
                  toggleTheme();
                }}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Theme Mode</p>
                    <p className="text-[10px] text-zinc-400">{theme.toUpperCase()}</p>
                  </div>
                </div>
              </button>
            </div>

            {/* App Packages & Hubs */}
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  haptics.tap();
                  setMobileMenuOpen(false);
                  setAndroidModalOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-bold text-xs text-emerald-400">Android Studio Project (/android)</p>
                    <p className="text-[10px] text-zinc-400">Kotlin source code, Gradle setup, and APK build guide</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  haptics.tap();
                  setMobileMenuOpen(false);
                  setFlutterModalOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-cyan-400 font-bold text-sm">F</span>
                  <div>
                    <p className="font-bold text-xs text-cyan-400">Flutter Mobile App Source</p>
                    <p className="text-[10px] text-zinc-400">Dart entrypoint, Material 3, and pubspec.yaml</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => {
                  haptics.tap();
                  setMobileMenuOpen(false);
                  setWearablesModalOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Settings & Life Trackers</p>
                    <p className="text-[10px] text-zinc-400">Sync Strava, Apple Watch, Kindle, Goodreads, & Letterboxd</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                onClick={() => {
                  haptics.tap();
                  setMobileMenuOpen(false);
                  setNotificationsModalOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Goal Push Notifications</p>
                    <p className="text-[10px] text-zinc-400">Daily streak reminders and level up notifications</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Persona Switcher Strip */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Active Account Persona:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'usr_me', name: 'Alex H.', lvl: 342 },
                  { id: 'usr_elena', name: 'Elena R.', lvl: 742 },
                  { id: 'usr_marcus', name: 'Dr. Marcus', lvl: 989 }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      haptics.tap();
                      switchProfile(p.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      user.id === p.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs block leading-tight">{p.name}</span>
                    <span className="text-[10px] font-mono opacity-70">Lv.{p.lvl}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
