import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';
import 'models.dart';

class QuizzesScreen extends StatefulWidget {
  final Subject? initialSubject;
  const QuizzesScreen({super.key, this.initialSubject});

  @override
  State<QuizzesScreen> createState() => _QuizzesScreenState();
}

class _QuizzesScreenState extends State<QuizzesScreen> {
  Subject? _subject;
  List<QuizQuestion> _questions = [];
  bool _loading = false;
  int _current = 0;
  int _score = 0;
  int? _picked;
  bool _finished = false;
  int _earned = 0;

  @override
  void initState() {
    super.initState();
    if (widget.initialSubject != null) _startQuiz(widget.initialSubject!);
  }

  Future<void> _startQuiz(Subject s) async {
    setState(() {
      _subject = s;
      _loading = true;
      _finished = false;
      _current = 0;
      _score = 0;
      _picked = null;
    });
    try {
      final qs = await ApiService.getQuestions(s.code);
      if (!mounted) return;
      setState(() {
        _questions = qs;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _questions = [];
        _loading = false;
      });
    }
  }

  void _answer(int index) {
    if (_picked != null) return;
    setState(() => _picked = index);
  }

  Future<void> _next() async {
    if (_picked == _questions[_current].answerIndex) _score++;
    if (_current < _questions.length - 1) {
      setState(() {
        _current++;
        _picked = null;
      });
    } else {
      try {
        final res = await ApiService.addQuizAttempt(
            Session.userId!, _subject!.code, _score, _questions.length);
        _earned = res['points_earned'] ?? _score * 10;
      } catch (_) {
        _earned = _score * 10;
      }
      if (!mounted) return;
      setState(() => _finished = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: Text(_subject == null ? 'Quizzes' : '${_subject!.name} Quiz',
            style: const TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: _subject == null
          ? _SubjectPicker(onPick: _startQuiz)
          : _loading
              ? const Center(child: CircularProgressIndicator())
              : _questions.isEmpty
                  ? _empty()
                  : _finished
                      ? _result()
                      : _quiz(),
    );
  }

  Widget _empty() => const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('No questions yet for this subject.',
              style: TextStyle(color: AppColors.textMuted)),
        ),
      );

  Widget _quiz() {
    final q = _questions[_current];
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LinearProgressIndicator(
            value: (_current + 1) / _questions.length,
            backgroundColor: AppColors.border,
            color: AppColors.primary,
            minHeight: 8,
            borderRadius: BorderRadius.circular(8),
          ),
          const SizedBox(height: 16),
          Text('Question ${_current + 1} of ${_questions.length}',
              style: const TextStyle(color: AppColors.textMuted)),
          const SizedBox(height: 10),
          Text(q.question,
              style: const TextStyle(
                  fontSize: 20, fontWeight: FontWeight.w700, height: 1.3)),
          const SizedBox(height: 24),
          ...List.generate(q.options.length, (i) {
            final isCorrect = i == q.answerIndex;
            final isPicked = i == _picked;
            Color border = AppColors.border;
            Color bg = Colors.white;
            if (_picked != null) {
              if (isCorrect) {
                border = AppColors.success;
                bg = AppColors.success.withValues(alpha: .1);
              } else if (isPicked) {
                border = AppColors.danger;
                bg = AppColors.danger.withValues(alpha: .1);
              }
            }
            return GestureDetector(
              onTap: () => _answer(i),
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: border, width: 1.5),
                ),
                child: Row(
                  children: [
                    Expanded(
                        child: Text(q.options[i],
                            style: const TextStyle(fontSize: 15))),
                    if (_picked != null && isCorrect)
                      const Icon(Icons.check_circle, color: AppColors.success),
                    if (_picked != null && isPicked && !isCorrect)
                      const Icon(Icons.cancel, color: AppColors.danger),
                  ],
                ),
              ),
            );
          }),
          const Spacer(),
          ElevatedButton(
            onPressed: _picked == null ? null : _next,
            child: Text(_current < _questions.length - 1
                ? 'Next'
                : 'Finish quiz'),
          ),
        ],
      ),
    );
  }

  Widget _result() {
    final pct = (_score / _questions.length * 100).round();
    final passed = pct >= 60;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(passed ? Icons.emoji_events : Icons.replay_circle_filled,
                size: 88,
                color: passed ? AppColors.warning : AppColors.textMuted),
            const SizedBox(height: 16),
            Text('$_score / ${_questions.length}',
                style: const TextStyle(
                    fontSize: 36, fontWeight: FontWeight.w800)),
            Text('$pct% - +$_earned points',
                style: const TextStyle(color: AppColors.textMuted)),
            const SizedBox(height: 8),
            Text(passed ? 'Well done!' : 'Keep practising, you have got this.',
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 28),
            ElevatedButton(
                onPressed: () => _startQuiz(_subject!),
                child: const Text('Try again')),
            const SizedBox(height: 10),
            TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Back')),
          ],
        ),
      ),
    );
  }
}

class _SubjectPicker extends StatefulWidget {
  final void Function(Subject) onPick;
  const _SubjectPicker({required this.onPick});

  @override
  State<_SubjectPicker> createState() => _SubjectPickerState();
}

class _SubjectPickerState extends State<_SubjectPicker> {
  late Future<List<Subject>> _future;

  @override
  void initState() {
    super.initState();
    _future = ApiService.getSubjects(department: Session.department);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Subject>>(
      future: _future,
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        final subjects = snap.data ?? [];
        return ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          children: [
            const Text('Pick a subject to test yourself',
                style: TextStyle(color: AppColors.textMuted)),
            const SizedBox(height: 16),
            ...subjects.map((s) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    tileColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                      side: const BorderSide(color: AppColors.border),
                    ),
                    leading: CircleAvatar(
                      backgroundColor: s.color.withValues(alpha: .15),
                      child: Icon(s.icon, color: s.color),
                    ),
                    title: Text(s.name,
                        style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text('${s.questionCount} questions'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => widget.onPick(s),
                  ),
                )),
          ],
        );
      },
    );
  }
}
