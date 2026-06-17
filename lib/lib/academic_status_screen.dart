import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';
import 'models.dart';

class AcademicStatusScreen extends StatefulWidget {
  const AcademicStatusScreen({super.key});

  @override
  State<AcademicStatusScreen> createState() => _AcademicStatusScreenState();
}

class _AcademicStatusScreenState extends State<AcademicStatusScreen> {
  late Future<List<ProgressItem>> _future;

  final _colors = const [
    AppColors.primary,
    AppColors.accent,
    AppColors.success,
    AppColors.warning,
    AppColors.danger,
    Color(0xFF8B5CF6),
  ];

  @override
  void initState() {
    super.initState();
    _future = ApiService.getProgress(Session.userId!);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: const Text('Academic Status',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: FutureBuilder<List<ProgressItem>>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final items = snap.data ?? [];
          if (items.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                    'No progress yet.\nComplete some quizzes to see your status here.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.textMuted)),
              ),
            );
          }
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
            children: [
              Text('Your best quiz score per subject',
                  style: const TextStyle(color: AppColors.textMuted)),
              const SizedBox(height: 18),
              ...List.generate(items.length, (i) {
                final item = items[i];
                final color = _colors[i % _colors.length];
                final p = item.percent / 100.0;
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
                          Expanded(
                            child: Text(item.name,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600)),
                          ),
                          Text('${item.percent.round()}%',
                              style: TextStyle(
                                  color: color,
                                  fontWeight: FontWeight.w700)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: p,
                          minHeight: 8,
                          backgroundColor: AppColors.border,
                          color: color,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}
