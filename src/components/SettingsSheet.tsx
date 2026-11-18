import React, { useEffect } from 'react';
import {
  Bell,
  LogOut,
  ChevronRight,
  Moon,
  Palette,
  SlidersHorizontal,
  Smartphone,
  Sun,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { getTierForLevel } from '../utils/levelMath';
import { haptics } from '../utils/haptics';
import { Avatar } from './Avatar';
import { useAuth } from '../auth/AuthGate';

const PERSONAS = [
  { id: 'usr_me', name: 'Alex H.', lvl: 342 },
  { id: 'usr_elena', name: 'Elena R.', lvl: 742 },
  { id: 'usr_marcus', name: 'Dr. Marcus', lvl: 989 }
];

const row =
  'w-full min-h-touch p-3 rounded-2xl border flex items-center justify-between gap-3 text-left cursor-pointer';
const neutralRow = `${row} bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800`;

/** Quick settings, opened from the top of Home. A bottom sheet on phones, a centred panel on larger screens. */
export const SettingsSheet: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    settingsSheetOpen,
    setSettingsSheetOpen,
    setWearablesModalOpen,
    setNotificationsModalOpen,
    setAndroidModalOpen,
    setFlutterModalOpen,
    switchProfile
  } = useRanked();

  const { user: authUser, signOut } = useAuth();
  const close = () => setSettingsSheetOpen(false);

  useEffect(() => {
    if (!settingsSheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsSheetOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsSheetOpen, setSettingsSheetOpen]);

  if (!settingsSheetOpen) return null;

  const go = (open: (v: boolean) => void) => {
    haptics.tap();
    close();
    open(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick settings"
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-md max-h-[92dvh] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200"
      >
        <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700/80 mx-auto -mt-1 md:hidden" />

        <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={user.avatar} name={user.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-['Outfit'] truncate">
                {user.name}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                Level {user.level} · {getTierForLevel(user.level)} · {user.xp.toLocaleString()} XP
              </p>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close settings"
            className="min-h-touch min-w-touch flex items-center justify-center rounded-full text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              haptics.tap();
              toggleSound();
            }}
            className={neutralRow}
            aria-pressed={soundEnabled}
          >
            <span className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
              <span>
                <span className="block font-semibold text-zinc-900 dark:text-zinc-100">Audio chimes</span>
                <span className="block text-[10px] text-zinc-400">{soundEnabled ? 'On' : 'Muted'}</span>
              </span>
            </span>
          </button>
          <button
            onClick={() => {
              haptics.tap();
              toggleTheme();
            }}
            className={neutralRow}
          >
            <span className="flex items-center gap-2">
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-cyan-400" />}
              <span>
                <span className="block font-semibold text-zinc-900 dark:text-zinc-100">Light / dark</span>
                <span className="block text-[10px] text-zinc-400">{theme.toUpperCase()}</span>
              </span>
            </span>
          </button>
        </div>

        <div className="space-y-1.5">
          <button onClick={() => go(setWearablesModalOpen)} className={neutralRow}>
            <span className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>
                <span className="block font-semibold text-xs text-zinc-900 dark:text-zinc-100">Themes & life trackers</span>
                <span className="block text-[10px] text-zinc-400">Pick a theme, sync Strava, Kindle, Goodreads, Letterboxd</span>
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
          </button>

          <button onClick={() => go(setNotificationsModalOpen)} className={neutralRow}>
            <span className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>
                <span className="block font-semibold text-xs text-zinc-900 dark:text-zinc-100">Goal notifications</span>
                <span className="block text-[10px] text-zinc-400">Daily streak reminders and level-up alerts</span>
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
          </button>

          <button onClick={() => { close(); void signOut(); }} className={neutralRow}>
            <span className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>
                <span className="block font-semibold text-xs text-zinc-900 dark:text-zinc-100">Sign out</span>
                <span className="block text-[10px] text-zinc-400">{authUser ? `Signed in as ${authUser.email}` : 'End this session'}</span>
              </span>
            </span>
          </button>

          <button onClick={() => go(setAndroidModalOpen)} className={`${row} bg-emerald-500/10 border-emerald-500/30`}>
            <span className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>
                <span className="block font-bold text-xs text-emerald-600 dark:text-emerald-400">Android Studio project</span>
                <span className="block text-[10px] text-zinc-400">Kotlin source, Gradle setup and APK guide</span>
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
          </button>

          <button onClick={() => go(setFlutterModalOpen)} className={`${row} bg-cyan-500/10 border-cyan-500/30`}>
            <span className="flex items-center gap-2.5">
              <span className="font-mono text-cyan-500 font-bold text-sm w-4 text-center">F</span>
              <span>
                <span className="block font-bold text-xs text-cyan-600 dark:text-cyan-400">Flutter app source</span>
                <span className="block text-[10px] text-zinc-400">Dart entrypoint, Material 3 and pubspec.yaml</span>
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0" />
          </button>
        </div>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3" aria-hidden="true" /> Switch persona
          </p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Active persona">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                role="radio"
                aria-checked={user.id === p.id}
                onClick={() => {
                  haptics.tap();
                  switchProfile(p.id);
                  close();
                }}
                className={`min-h-touch p-2 rounded-xl border text-center cursor-pointer ${
                  user.id === p.id
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <span className="text-xs block leading-tight">{p.name}</span>
                <span className="text-[10px] font-mono opacity-70">Lv.{p.lvl}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
