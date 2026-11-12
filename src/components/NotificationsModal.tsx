import React from 'react';
import { useRanked } from '../context/RankedContext';
import { Bell, X, Check, Clock, AlertTriangle } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    notificationsModalOpen,
    setNotificationsModalOpen,
    notificationsSettings,
    toggleNotificationSetting,
    requestPushPermissions,
    showToast
  } = useRanked();

  if (!notificationsModalOpen) return null;

  const triggerTestNotification = () => {
    showToast('Ranked Push: "Your 48-day streak is waiting! Solve today’s IQ puzzle before midnight."');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Ranked Goal Reminder', {
        body: 'Keep your 48-day study streak alive! Complete your daily cognitive matrix.',
        icon: '/src/assets/images/ranked_hero_crest_1792934617606.jpg'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Push Notifications & Goal Reminders
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Never lose your study streak or milestone momentum.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission Request Banner */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Browser Web Push Permission
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Receive background alerts even when the Ranked tab is closed.
            </p>
          </div>
          <button
            onClick={requestPushPermissions}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 whitespace-nowrap shrink-0"
          >
            Enable Push
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          {notificationsSettings.map(setting => (
            <div
              key={setting.id}
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {setting.label}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  {setting.description}
                </p>
              </div>

              <button
                onClick={() => toggleNotificationSetting(setting.id)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  setting.enabled ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    setting.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Test Trigger */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={triggerTestNotification}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Send Test Push Notification
          </button>
          <button
            onClick={() => setNotificationsModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
