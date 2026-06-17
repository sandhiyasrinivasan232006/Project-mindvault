import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';
import 'models.dart';

class EmotionalStateScreen extends StatefulWidget {
  const EmotionalStateScreen({super.key});

  @override
  State<EmotionalStateScreen> createState() => _EmotionalStateScreenState();
}

class _EmotionalStateScreenState extends State<EmotionalStateScreen> {
  final _moods = const [
    _Mood('Happy', '\u{1F600}', AppColors.success),
    _Mood('Calm', '\u{1F60C}', AppColors.accent),
    _Mood('Tired', '\u{1F634}', AppColors.warning),
    _Mood('Stressed', '\u{1F61F}', Color(0xFFF97316)),
    _Mood('Sad', '\u{1F622}', AppColors.danger),
  ];
  _Mood? _selected;
  final _note = TextEditingController();
  bool _saving = false;
  late Future<List<MoodEntry>> _future;

  @override
  void initState() {
    super.initState();
    _future = ApiService.getMoods(Session.userId!);
  }

  @override
  void dispose() {
    _note.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_selected == null) return;
    setState(() => _saving = true);
    try {
      await ApiService.addMood(
          Session.userId!, _selected!.label, _selected!.emoji,
          _note.text.trim().isEmpty ? null : _note.text.trim());
      _note.clear();
      _selected = null;
      if (!mounted) return;
      setState(() => _future = ApiService.getMoods(Session.userId!));
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Mood logged - +5 points'),
          behavior: SnackBarBehavior.floating));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(e.toString().replaceAll('Exception: ', '')),
          behavior: SnackBarBehavior.floating));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  String _suggestion(String mood) {
    switch (mood) {
      case 'Stressed':
      case 'Sad':
        return 'Take a moment with the Breathing exercise before your next study session.';
      case 'Tired':
        return 'A short break and some water can help. Keep study blocks short today.';
      default:
        return 'Great energy! A good time to tackle a tough topic or a quiz.';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: const Text('How are you feeling?',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
        children: [
          const Text('Check in with your mood',
              style: TextStyle(color: AppColors.textMuted)),
          const SizedBox(height: 18),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: _moods.map((m) {
              final on = _selected == m;
              return GestureDetector(
                onTap: () => setState(() => _selected = m),
                child: Container(
                  width: 96,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: on ? m.color.withValues(alpha: .15) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                        color: on ? m.color : AppColors.border,
                        width: on ? 2 : 1),
                  ),
                  child: Column(
                    children: [
                      Text(m.emoji, style: const TextStyle(fontSize: 30)),
                      const SizedBox(height: 6),
                      Text(m.label,
                          style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: on ? m.color : AppColors.text)),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          if (_selected != null) ...[
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: _selected!.color.withValues(alpha: .1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lightbulb_outline, size: 20),
                  const SizedBox(width: 10),
                  Expanded(child: Text(_suggestion(_selected!.label))),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],
          TextField(
            controller: _note,
            maxLines: 3,
            decoration: const InputDecoration(hintText: 'Add a note (optional)'),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: (_selected == null || _saving) ? null : _save,
            icon: const Icon(Icons.check),
            label: const Text('Log mood'),
          ),
          const SizedBox(height: 28),
          const Text('Recent moods',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          FutureBuilder<List<MoodEntry>>(
            future: _future,
            builder: (context, snap) {
              if (snap.connectionState == ConnectionState.waiting) {
                return const Padding(
                  padding: EdgeInsets.all(12),
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              final moods = snap.data ?? [];
              if (moods.isEmpty) {
                return const Text('No entries yet.',
                    style: TextStyle(color: AppColors.textMuted));
              }
              return Column(children: moods.map(_historyTile).toList());
            },
          ),
        ],
      ),
    );
  }

  Widget _historyTile(MoodEntry e) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Text(e.emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(e.mood,
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                if (e.note != null)
                  Text(e.note!,
                      style: const TextStyle(
                          color: AppColors.textMuted, fontSize: 13)),
              ],
            ),
          ),
          Text(e.time,
              style:
                  const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        ],
      ),
    );
  }
}

class _Mood {
  final String label;
  final String emoji;
  final Color color;
  const _Mood(this.label, this.emoji, this.color);
}
