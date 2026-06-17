import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'models.dart';

class TeacherQuizScreen extends StatefulWidget {
  const TeacherQuizScreen({super.key});

  @override
  State<TeacherQuizScreen> createState() => _TeacherQuizScreenState();
}

class _TeacherQuizScreenState extends State<TeacherQuizScreen> {
  Subject? _subject;
  int _count = 0;
  final _question = TextEditingController();
  final _options = List.generate(4, (_) => TextEditingController());
  int _correct = 0;
  bool _saving = false;

  @override
  void dispose() {
    _question.dispose();
    for (final c in _options) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickSubject() async {
    final subjects = await ApiService.getSubjects();
    if (!mounted) return;
    final chosen = await showModalBottomSheet<Subject>(
      context: context,
      builder: (_) => ListView(
        padding: const EdgeInsets.all(12),
        children: subjects
            .map((s) => ListTile(
                  leading: Icon(s.icon, color: s.color),
                  title: Text(s.name),
                  onTap: () => Navigator.pop(context, s),
                ))
            .toList(),
      ),
    );
    if (chosen != null) {
      setState(() {
        _subject = chosen;
        _count = chosen.questionCount;
      });
    }
  }

  Future<void> _add() async {
    if (_subject == null) return;
    final q = _question.text.trim();
    final opts =
        _options.map((c) => c.text.trim()).where((t) => t.isNotEmpty).toList();
    if (q.isEmpty || opts.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Enter a question and at least 2 options'),
          behavior: SnackBarBehavior.floating));
      return;
    }
    if (_correct >= opts.length) _correct = 0;
    setState(() => _saving = true);
    try {
      await ApiService.addQuestion(_subject!.code, q, opts, _correct);
      _question.clear();
      for (final c in _options) {
        c.clear();
      }
      setState(() {
        _correct = 0;
        _count++;
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Question added'),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title:
            const Text('Add MCQs', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        children: [
          GestureDetector(
            onTap: _pickSubject,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Icon(_subject?.icon ?? Icons.quiz,
                      color: _subject?.color ?? AppColors.textMuted),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(_subject?.name ?? 'Select a subject',
                        style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: _subject == null
                                ? AppColors.textMuted
                                : AppColors.text)),
                  ),
                  if (_subject != null)
                    Text('$_count Qs',
                        style: const TextStyle(color: AppColors.textMuted)),
                  const SizedBox(width: 6),
                  const Icon(Icons.expand_more, color: AppColors.textMuted),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),
          if (_subject != null) ...[
            const Text('Question',
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            TextField(
              controller: _question,
              maxLines: 2,
              decoration: const InputDecoration(hintText: 'Type the question'),
            ),
            const SizedBox(height: 16),
            const Text('Options (tap the circle to mark the correct one)',
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            ...List.generate(4, (i) => _optionRow(i)),
            const SizedBox(height: 14),
            ElevatedButton.icon(
              onPressed: _saving ? null : _add,
              icon: const Icon(Icons.add),
              label: const Text('Add question'),
            ),
          ],
        ],
      ),
    );
  }

  Widget _optionRow(int i) {
    final selected = _correct == i;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => setState(() => _correct = i),
            child: Container(
              height: 26,
              width: 26,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: selected ? AppColors.success : Colors.transparent,
                border: Border.all(
                    color: selected ? AppColors.success : AppColors.border,
                    width: 2),
              ),
              child: selected
                  ? const Icon(Icons.check, size: 16, color: Colors.white)
                  : null,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: _options[i],
              decoration: InputDecoration(
                hintText:
                    'Option ${i + 1}${i < 2 ? ' (required)' : ' (optional)'}',
                isDense: true,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
