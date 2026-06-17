import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';
import 'models.dart';
import 'teacher_subjects_screen.dart';
import 'teacher_notes_screen.dart';
import 'teacher_quiz_screen.dart';
import 'learning_screen.dart';
import 'settings_screen.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  late Future<List<Subject>> _future;

  @override
  void initState() {
    super.initState();
    _future = ApiService.getSubjects();
  }

  void _reload() => setState(() => _future = ApiService.getSubjects());

  Future<void> _open(Widget page) async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => page));
    if (mounted) _reload();
  }

  @override
  Widget build(BuildContext context) {
    final name = Session.name ?? 'Teacher';
    return Scaffold(
      body: SafeArea(
        child: FutureBuilder<List<Subject>>(
          future: _future,
          builder: (context, snap) {
            final count = snap.data?.length ?? 0;
            return ListView(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Welcome,',
                              style: TextStyle(color: AppColors.textMuted)),
                          Text(name,
                              style: const TextStyle(
                                  fontSize: 22, fontWeight: FontWeight.w700)),
                          Text('Teacher - ${Session.department}',
                              style: const TextStyle(
                                  color: AppColors.textMuted, fontSize: 13)),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _open(const SettingsScreen()),
                      child: CircleAvatar(
                        radius: 24,
                        backgroundColor:
                            AppColors.primary.withValues(alpha: .12),
                        child: Text(name[0].toUpperCase(),
                            style: const TextStyle(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                                fontSize: 18)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: const LinearGradient(
                        colors: [AppColors.primary, AppColors.primaryDark]),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.library_books,
                          color: Colors.white, size: 40),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('$count',
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 28,
                                  fontWeight: FontWeight.w800)),
                          const Text('Subjects available',
                              style: TextStyle(color: Colors.white70)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                const Text('Manage content',
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                const SizedBox(height: 14),
                _actionCard('Add / manage subjects',
                    'Create new subjects for any department',
                    Icons.add_box_outlined, AppColors.primary,
                    () => _open(const TeacherSubjectsScreen())),
                _actionCard('Add notes', 'Write study notes for a subject',
                    Icons.note_add_outlined, AppColors.success,
                    () => _open(const TeacherNotesScreen())),
                _actionCard('Add MCQs', 'Create quiz questions for a subject',
                    Icons.quiz_outlined, AppColors.warning,
                    () => _open(const TeacherQuizScreen())),
                _actionCard('Preview as student',
                    'See how students view the content',
                    Icons.visibility_outlined, AppColors.accent,
                    () => _open(const LearningScreen())),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _actionCard(String title, String subtitle, IconData icon, Color color,
      VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                height: 48,
                width: 48,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: .12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: color),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 16)),
                    Text(subtitle,
                        style: const TextStyle(
                            color: AppColors.textMuted, fontSize: 13)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: AppColors.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
