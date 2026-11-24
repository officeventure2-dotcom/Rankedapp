import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Ranked has two looks, Light and Dark; "System" picks one from the phone.
class AppTheme {
  static const amber = Color(0xFFF59E0B);

  static ThemeData build(Brightness b) {
    final dark = b == Brightness.dark;
    final base = ThemeData(brightness: b, useMaterial3: true);
    final body = GoogleFonts.figtreeTextTheme(base.textTheme);
    final text = body.copyWith(
      headlineSmall: GoogleFonts.bricolageGrotesque(textStyle: body.headlineSmall, fontWeight: FontWeight.w700),
      titleLarge: GoogleFonts.bricolageGrotesque(textStyle: body.titleLarge, fontWeight: FontWeight.w700),
      titleMedium: GoogleFonts.bricolageGrotesque(textStyle: body.titleMedium, fontWeight: FontWeight.w700),
    );
    return base.copyWith(
      scaffoldBackgroundColor: dark ? const Color(0xFF09090B) : const Color(0xFFFAFAFA),
      colorScheme: dark
          ? const ColorScheme.dark(primary: amber, secondary: Color(0xFF10B981), surface: Color(0xFF18181B))
          : const ColorScheme.light(primary: Color(0xFFD97706), secondary: Color(0xFF059669), surface: Colors.white),
      textTheme: text,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        titleTextStyle: text.titleLarge,
      ),
    );
  }
}
