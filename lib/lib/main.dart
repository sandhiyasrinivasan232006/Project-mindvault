import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'splash_screen.dart';
import 'login_screen.dart';
import 'signup_screen.dart';
import 'dashboard_screen.dart';
import 'teacher_dashboard_screen.dart';

void main() => runApp(const LearnWellApp());

class LearnWellApp extends StatelessWidget {
  const LearnWellApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LearnWell',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      initialRoute: '/',
      routes: {
        '/': (_) => const SplashScreen(),
        '/login': (_) => const LoginScreen(),
        '/signup': (_) => const SignupScreen(),
        '/dashboard': (_) => const DashboardScreen(),
        '/teacher': (_) => const TeacherDashboardScreen(),
      },
    );
  }
}
