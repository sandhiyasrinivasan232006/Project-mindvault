import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'models.dart';

class TeacherSubjectsScreen extends StatefulWidget {
  const TeacherSubjectsScreen({super.key});

  @override
  State<TeacherSubjectsScreen> createState() => _TeacherSubjectsScreenState();
}

class _TeacherSubjectsScreenState extends State<TeacherSubjectsScreen> {
  String _dept = 'CSE';
  late Future<List<Subject>> _future;
  final _departments = const ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];

  @override
  void initState() {
    super.initState();
    _future = ApiService.getSubjects(department: _dept);
  }

  void _reload() =>
      setState(() => _future = ApiService.getSubjects(department: _dept));

  Future<int> _totalCount() async {
    final all = await ApiService.getSubjects();
    return all.length;
  }

  void _addDialog() {
    final nameCtrl = TextEditingController();
    String dept = _dept;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) => AlertDialog(
          title: const Text('New subject'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                autofocus: true,
                decoration: const InputDecoration(
                    labelText: 'Subject name',
                    hintText: 'e.g. Cloud Computing'),
              ),
              const SizedBox(height: 14),
              DropdownButtonFormField<String>(
                initialValue: dept,
                decoration: const InputDecoration(labelText: 'Department'),
                items: _departments
                    .map((d) => DropdownMenuItem(value: d, child: Text(d)))
                    .toList(),
                onChanged: (v) => setLocal(() => dept = v!),
              ),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel')),
            ElevatedButton(
              style:
                  ElevatedButton.styleFrom(minimumSize: const Size(80, 44)),
              onPressed: () async {
                final name = nameCtrl.text.trim();
                if (name.isEmpty) return;
                final idx = await _totalCount();
                final code = makeSubjectCode(name);
                final icon = kNewSubjectIcons[idx % kNewSubjectIcons.length];
                final color = kNewSubjectColors[idx % kNewSubjectColors.length];
                try {
                  await ApiService.addSubject(dept, code, name, icon, color);
                  if (!mounted) return;
                  Navigator.pop(ctx);
                  setState(() {
                    _dept = dept;
                    _future = ApiService.getSubjects(department: _dept);
                  });
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                      content: Text('Added "$name" to $dept'),
                      behavior: SnackBarBehavior.floating));
                } catch (e) {
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                      content:
                          Text(e.toString().replaceAll('Exception: ', '')),
                      behavior: SnackBarBehavior.floating));
                }
              },
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title:
            const Text('Subjects', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
            child: DropdownButtonFormField<String>(
              initialValue: _dept,
              decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.apartment_outlined),
                  labelText: 'Department'),
              items: _departments
                  .map((d) => DropdownMenuItem(value: d, child: Text(d)))
                  .toList(),
              onChanged: (v) => setState(() {
                _dept = v!;
                _future = ApiService.getSubjects(department: _dept);
              }),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Subject>>(
              future: _future,
              builder: (context, snap) {
                if (snap.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                final subjects = snap.data ?? [];
                return ListView(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 90),
                  children: [
                    Text('${subjects.length} subjects (incl. common)',
                        style: const TextStyle(color: AppColors.textMuted)),
                    const SizedBox(height: 12),
                    ...subjects.map((s) => Container(
                          margin: const EdgeInsets.only(bottom: 10),
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
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600)),
                            subtitle: Text(
                                '${s.noteCount} notes - ${s.questionCount} questions'),
                          ),
                        )),
                  ],
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addDialog,
        icon: const Icon(Icons.add),
        label: const Text('New subject'),
      ),
    );
  }
}
