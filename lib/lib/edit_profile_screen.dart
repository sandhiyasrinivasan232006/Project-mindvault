import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late final TextEditingController _name =
      TextEditingController(text: Session.name);
  late String _dept = Session.department ?? 'CSE';
  late int _year = Session.year;
  bool _saving = false;

  final _departments = const ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ApiService.updateProfile(Session.userId!, {
        'name': _name.text.trim(),
        'department': _dept,
        'year': _year,
      });
      Session.name = _name.text.trim().isEmpty ? Session.name : _name.text.trim();
      Session.department = _dept;
      Session.year = _year;
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Profile updated'),
          behavior: SnackBarBehavior.floating));
      Navigator.pop(context);
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
        title: const Text('Edit profile',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        children: [
          const Text('Name', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _name,
            decoration:
                const InputDecoration(prefixIcon: Icon(Icons.person_outline)),
          ),
          const SizedBox(height: 18),
          const Text('Department',
              style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: _dept,
            decoration: const InputDecoration(
                prefixIcon: Icon(Icons.apartment_outlined)),
            items: _departments
                .map((d) => DropdownMenuItem(value: d, child: Text(d)))
                .toList(),
            onChanged: (v) => setState(() => _dept = v!),
          ),
          if (!Session.isTeacher) ...[
            const SizedBox(height: 18),
            const Text('Year', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            DropdownButtonFormField<int>(
              initialValue: _year,
              decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.calendar_today_outlined)),
              items: [1, 2, 3, 4]
                  .map((y) =>
                      DropdownMenuItem(value: y, child: Text('Year $y')))
                  .toList(),
              onChanged: (v) => setState(() => _year = v!),
            ),
          ],
          const SizedBox(height: 28),
          ElevatedButton.icon(
            onPressed: _saving ? null : _save,
            icon: const Icon(Icons.check),
            label: const Text('Save changes'),
          ),
        ],
      ),
    );
  }
}
