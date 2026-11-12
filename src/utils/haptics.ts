/**
 * Android Native Haptics Utility
 * Provides subtle tactile feedback on Android touch devices using the Web Vibration API.
 */

export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if user disabled vibration or platform restricts it
    }
  }
};

export const haptics = {
  /** Crisp subtle tap (navigation, tab switch, filter toggle) */
  tap: () => triggerHaptic(12),
  
  /** Medium tactile bump (button press, question answer) */
  bump: () => triggerHaptic(22),
  
  /** Double pulse for rewards, streak claiming, and level ups */
  success: () => triggerHaptic([15, 45, 25]),
  
  /** Alert vibration for error or timer warning */
  alert: () => triggerHaptic([30, 40, 30]),
};
