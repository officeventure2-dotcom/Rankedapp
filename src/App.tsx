/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RankedProvider, useRanked } from './context/RankedContext';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { ChallengesView } from './components/ChallengesView';
import { LeaderboardView } from './components/LeaderboardView';
import { SocialFeedView } from './components/SocialFeedView';
import { ChatView } from './components/ChatView';
import { BadgesView } from './components/BadgesView';
import { WearablesModal } from './components/WearablesModal';
import { NotificationsModal } from './components/NotificationsModal';
import { LevelUpModal } from './components/LevelUpModal';
import { OnlineLibraryView } from './components/OnlineLibraryView';
import { EducationalVideosView } from './components/EducationalVideosView';
import { UserProfileModal } from './components/UserProfileModal';
import { OnlineReaderModal } from './components/OnlineReaderModal';
import { ScienceCodexView } from './components/ScienceCodexView';
import { PlayersMapView } from './components/PlayersMapView';
import { DailyStreakModal } from './components/DailyStreakModal';
import { BottomNavBanner } from './components/BottomNavBanner';
import { SubSectionNav } from './components/SubSectionNav';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { FlutterExportModal } from './components/FlutterExportModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    toast,
    androidModalOpen,
    setAndroidModalOpen,
    flutterModalOpen,
    setFlutterModalOpen,
    streakModalOpen,
    setStreakModalOpen,
    wearablesModalOpen,
    setWearablesModalOpen,
    notificationsModalOpen,
    setNotificationsModalOpen,
    inspectingUser,
    closeUserProfile,
    activeBookForReading,
    closeReader
  } = useRanked();

  // Android Back Gesture & Hardware Key handling
  React.useEffect(() => {
    const handlePopState = () => {
      if (flutterModalOpen) {
        setFlutterModalOpen(false);
      } else if (androidModalOpen) {
        setAndroidModalOpen(false);
      } else if (streakModalOpen) {
        setStreakModalOpen(false);
      } else if (wearablesModalOpen) {
        setWearablesModalOpen(false);
      } else if (notificationsModalOpen) {
        setNotificationsModalOpen(false);
      } else if (inspectingUser) {
        closeUserProfile();
      } else if (activeBookForReading) {
        closeReader();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    flutterModalOpen,
    androidModalOpen,
    streakModalOpen,
    wearablesModalOpen,
    notificationsModalOpen,
    inspectingUser,
    activeBookForReading
  ]);

  const isMapTab = activeTab === 'map';

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-zinc-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500/20 selection:text-amber-500 relative isolate transition-colors duration-250">
      {/* Soft coloured light behind the glass surfaces (see liquid-glass.css) */}
      <div className="lg-backdrop" aria-hidden="true"><span /></div>
      
      {/* Top Bar Navigation (Jakob's Law clean header) */}
      <Header />

      {/* Main Content Area */}
      {isMapTab ? (
        <main className="flex-1 w-full relative">
          <PlayersMapView />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-32 sm:pb-28">
          <SubSectionNav />
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'challenges' && <ChallengesView />}
          {activeTab === 'library' && <OnlineLibraryView />}
          {activeTab === 'academy' && <EducationalVideosView />}
          {activeTab === 'science' && <ScienceCodexView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'social' && <SocialFeedView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'badges' && <BadgesView />}
        </main>
      )}

      {/* Floating Transparent Glass Bottom Navigation Bar (Jakob's Law) */}
      <BottomNavBanner />

      {/* Floating Toast Notification (Above bottom navigation on mobile) */}
      {toast && (
        <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-zinc-900/95 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-2xl border border-zinc-700/50 dark:border-zinc-300 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <WearablesModal />
      <NotificationsModal />
      <DailyStreakModal />
      <LevelUpModal />
      <UserProfileModal />
      <OnlineReaderModal />
      <AndroidInstallModal isOpen={androidModalOpen} onClose={() => setAndroidModalOpen(false)} />
      <FlutterExportModal isOpen={flutterModalOpen} onClose={() => setFlutterModalOpen(false)} />

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Ranked &copy; 2026 · Multidisciplinary Life Mastery System (Levels 1–1,000)</span>
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
            <span>Trivia</span>
            <span>·</span>
            <span>Languages</span>
            <span>·</span>
            <span>Literature</span>
            <span>·</span>
            <span>Cinema</span>
            <span>·</span>
            <span>Fitness</span>
            <span>·</span>
            <span>Academics</span>
            <span>·</span>
            <span>IQ</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <RankedProvider>
      <AppContent />
    </RankedProvider>
  );
}
