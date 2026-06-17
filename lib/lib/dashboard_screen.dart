import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';
import 'learning_screen.dart';
import 'emotional_state_screen.dart';
import 'breathing_screen.dart';
import 'ai_tutor_screen.dart';
import 'quizzes_screen.dart';
import 'rewards_screen.dart';
import 'academic_status_screen.dart';
import 'settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Future<Map<String, dynamic>> _future;

  @override
  void initState() {
    super.initState();
    _future = ApiService.getDashboard(Session.userId!);
  }

  void _reload() {
    setState(() => _future = ApiService.getDashboard(Session.userId!));
  }

  Future<void> _open(Widget page) async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => page));
    if (mounted) _reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: FutureBuilder<Map<String, dynamic>>(
          future: _future,
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            final data = snap.data ?? {};
            final name = data['name'] ?? Session.name ?? 'Student';
            final points = data['points'] ?? Session.points;
            final streak = data['streak_days'] ?? Session.streakDays;
            final badges = (data['badges'] as List?)?.length ?? 0;
            return RefreshIndicator(
              onRefresh: () async => _reload(),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
                children: [
                  _header(name),
                  const SizedBox(height: 20),
                  _statsRow(points, streak, badges),
                  const SizedBox(height: 22),
                  _startLearningCard(),
                  const SizedBox(height: 24),
                  const Text('Features',
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 14),
                  _grid(),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _header(String name) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Hello,',
                  style: TextStyle(color: AppColors.textMuted)),
              Text(name,
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.w700)),
              Text('${Session.department} - Year ${Session.year}',
                  style: const TextStyle(
                      color: AppColors.textMuted, fontSize: 13)),
            ],
          ),
        ),
        GestureDetector(
          onTap: () => _open(const SettingsScreen()),
          child: CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.primary.withValues(alpha: .12),
            child: Text(name.isNotEmpty ? name[0].toUpperCase() : 'S',
                style: const TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 18)),
          ),
        ),
      ],
    );
  }

  Widget _statsRow(dynamic points, dynamic streak, int badges) {
    return Row(
      children: [
        _stat('$points', 'Points', Icons.stars_rounded, AppColors.warning),
        const SizedBox(width: 12),
        _stat('${streak}d', 'Streak', Icons.local_fire_department,
            AppColors.danger),
        const SizedBox(width: 12),
        _stat('$badges', 'Badges', Icons.workspace_premium, AppColors.accent),
      ],
    );
  }

  Widget _stat(String value, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 6),
            Text(value,
                style: const TextStyle(
                    fontSize: 18, fontWeight: FontWeight.w700)),
            Text(label,
                style: const TextStyle(
                    color: AppColors.textMuted, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _startLearningCard() {
    return GestureDetector(
      onTap: () => _open(const LearningScreen()),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: const LinearGradient(
            colors: [AppColors.primary, AppColors.primaryDark],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Start Learning',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w700)),
                  const SizedBox(height: 6),
                  Text('Explore subjects for ${Session.department}',
                      style: const TextStyle(color: Colors.white70)),
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: const Text('Browse courses',
                        style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ),
            const Icon(Icons.menu_book_rounded,
                color: Colors.white24, size: 72),
          ],
        ),
      ),
    );
  }

  Widget _grid() {
    final items = <_Feature>[
      _Feature('AI Tutor', Icons.smart_toy_outlined, AppColors.primary,
          () => _open(const AiTutorScreen())),
      _Feature('Quizzes', Icons.quiz_outlined, AppColors.accent,
          () => _open(const QuizzesScreen())),
      _Feature('Mood Check', Icons.mood, AppColors.success,
          () => _open(const EmotionalStateScreen())),
      _Feature('Breathing', Icons.spa_outlined, const Color(0xFF8B5CF6),
          () => _open(const BreathingScreen())),
      _Feature('Rewards', Icons.emoji_events_outlined, AppColors.warning,
          () => _open(const RewardsScreen())),
      _Feature('Academic', Icons.bar_chart_rounded, AppColors.danger,
          () => _open(const AcademicStatusScreen())),
      _Feature('Settings', Icons.settings_outlined, AppColors.textMuted,
          () => _open(const SettingsScreen())),
      _Feature('Library', Icons.local_library_outlined,
          const Color(0xFF0EA5E9), () => _open(const LearningScreen())),
    ];
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: items.map(_tile).toList(),
    );
  }

  Widget _tile(_Feature f) {
    return GestureDetector(
      onTap: f.onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: f.color.withValues(alpha: .12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(f.icon, color: f.color),
            ),
            Text(f.title,
                style: const TextStyle(fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

class _Feature {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  _Feature(this.title, this.icon, this.color, this.onTap);
}
