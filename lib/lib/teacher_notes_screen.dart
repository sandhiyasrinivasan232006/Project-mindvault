import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'models.dart';

class TeacherNotesScreen extends StatefulWidget {
  const TeacherNotesScreen({super.key});

  @override
  State<TeacherNotesScreen> createState() => _TeacherNotesScreenState();
}

class _TeacherNotesScreenState extends State<TeacherNotesScreen> {
  Subject? _subject;
  List<NoteSection> _existing = [];
  final _heading = TextEditingController();
  final _body = TextEditingController();
  bool _saving = false;

  @override
  void dispose() {
    _heading.dispose();
    _body.dispose();
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
      setState(() => _subject = chosen);
      _loadNotes();
    }
  }

  Future<void> _loadNotes() async {
    if (_subject == null) return;
    final notes = await ApiService.getNotes(_subject!.code);
    if (!mounted) return;
    setState(() => _existing = notes);
  }

  Future<void> _add() async {
    if (_subject == null) return;
    if (_heading.text.trim().isEmpty || _body.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Enter a heading and content'),
          behavior: SnackBarBehavior.floating));
      return;
    }
    setState(() => _saving = true);
    try {
      await ApiService.addNote(
          _subject!.code, _heading.text.trim(), _body.text.trim());
      _heading.clear();
      _body.clear();
      await _loadNotes();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Note added'), behavior: SnackBarBehavior.floating));
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
        title: const Text('Add notes',
            style: TextStyle(fontWeight: FontWeight.w700)),
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
                  Icon(_subject?.icon ?? Icons.menu_book,
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
                  const Icon(Icons.expand_more, color: AppColors.textMuted),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),
          if (_subject != null) ...[
            const Text('New note section',
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            TextField(
              controller: _heading,
              decoration: const InputDecoration(labelText: 'Heading'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _body,
              maxLines: 5,
              decoration: const InputDecoration(
                  labelText: 'Content', alignLabelWithHint: true),
            ),
            const SizedBox(height: 14),
            ElevatedButton.icon(
              onPressed: _saving ? null : _add,
              icon: const Icon(Icons.add),
              label: const Text('Add note'),
            ),
            const SizedBox(height: 24),
            Text('Existing notes (${_existing.length})',
                style: const TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            ..._existing.map((n) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(n.heading,
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 4),
                      Text(n.body,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              color: AppColors.textMuted, fontSize: 13)),
                    ],
                  ),
                )),
          ],
        ],
      ),
    );
  }
}
