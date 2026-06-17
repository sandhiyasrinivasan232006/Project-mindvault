import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'models.dart';
import 'quizzes_screen.dart';

class CourseNotesScreen extends StatefulWidget {
  final Subject subject;
  const CourseNotesScreen({super.key, required this.subject});

  @override
  State<CourseNotesScreen> createState() => _CourseNotesScreenState();
}

class _CourseNotesScreenState extends State<CourseNotesScreen> {
  late Future<List<NoteSection>> _future;

  @override
  void initState() {
    super.initState();
    _future = ApiService.getNotes(widget.subject.code);
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.subject;
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: Text(s.name, style: const TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: FutureBuilder<List<NoteSection>>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final notes = snap.data ?? [];
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
            children: [
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  gradient: LinearGradient(
                      colors: [s.color, s.color.withValues(alpha: .7)]),
                ),
                child: Row(
                  children: [
                    Icon(s.icon, color: Colors.white, size: 40),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.name,
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700)),
                          Text('${notes.length} sections',
                              style:
                                  const TextStyle(color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              if (notes.isEmpty)
                const Padding(
                  padding: EdgeInsets.only(top: 40),
                  child: Center(
                      child: Text('No notes yet for this subject.',
                          style: TextStyle(color: AppColors.textMuted))),
                )
              else
                ...notes.asMap().entries.map((e) => _section(e.key + 1, e.value)),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: s.color,
        onPressed: () => Navigator.push(context,
            MaterialPageRoute(builder: (_) => QuizzesScreen(initialSubject: s))),
        icon: const Icon(Icons.quiz_outlined, color: Colors.white),
        label: const Text('Take Quiz', style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _section(int n, NoteSection note) {
    final s = widget.subject;
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: s.color.withValues(alpha: .15),
                child: Text('$n',
                    style: TextStyle(
                        color: s.color,
                        fontWeight: FontWeight.w700,
                        fontSize: 13)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(note.heading,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700, fontSize: 16)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(note.body,
              style: const TextStyle(
                  height: 1.5, color: AppColors.text, fontSize: 14)),
        ],
      ),
    );
  }
}
