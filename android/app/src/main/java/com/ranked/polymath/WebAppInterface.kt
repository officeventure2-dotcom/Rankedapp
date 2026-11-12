package com.ranked.polymath

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * JavaScript interface exposed to the WebView under 'window.AndroidNative'
 * Bridges Android native capabilities: vibration haptics, system share sheet, toasts, and telemetry.
 */
class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun triggerHaptic(type: String) {
        val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        if (vibrator != null && vibrator.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val effect = when (type.lowercase()) {
                    "bump" -> VibrationEffect.createOneShot(25, VibrationEffect.DEFAULT_AMPLITUDE)
                    "success" -> VibrationEffect.createWaveform(longArrayOf(0, 15, 40, 25), -1)
                    "alert" -> VibrationEffect.createWaveform(longArrayOf(0, 30, 50, 30), -1)
                    else -> VibrationEffect.createOneShot(12, 100) // tap
                }
                vibrator.vibrate(effect)
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(20)
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
            putExtra(Intent.EXTRA_TEXT, "$text\n$url")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        val chooser = Intent.createChooser(intent, "Share Ranked App")
        chooser.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.startActivity(chooser)
    }

    @JavascriptInterface
    fun isAndroidNativeApp(): Boolean = true

    @JavascriptInterface
    fun getAppVersion(): String = "2.4.0 (Build 1000)"
}
