import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';
import 'edit_profile_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _dailyReminder = true;
  bool _sound = false;

  void _logout() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Log out?'),
        content: const Text('You will need to sign in again.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () async {
              final email = Session.email;
              if (email != null) {
                await ApiService.logout(email).catchError((_) {});
              }
              Session.clear();
              if (!mounted) return;
              Navigator.pushNamedAndRemoveUntil(
                  context, '/login', (r) => false);
            },
            child: const Text('Log out',
                style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }

  void _infoDialog(String title, String body) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(body),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Got it')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final name = Session.name ?? 'Student';
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title:
            const Text('Settings', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: AppColors.primary.withValues(alpha: .12),
                  child: Text(name[0].toUpperCase(),
                      style: const TextStyle(
                          color: AppColors.primary,
                          fontSize: 24,
                          fontWeight: FontWeight.w700)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name,
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.w700)),
                      Text(Session.email ?? '',
                          style: const TextStyle(color: AppColors.textMuted)),
                      Text(
                          '${Session.role} - ${Session.department}'
                          '${Session.isTeacher ? '' : ' - Year ${Session.year}'}',
                          style: const TextStyle(
                              color: AppColors.textMuted, fontSize: 13)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _sectionTitle('Preferences'),
          _switchTile('Push notifications', _notifications,
              (v) => setState(() => _notifications = v),
              Icons.notifications_outlined),
          _switchTile('Daily study reminder', _dailyReminder,
              (v) => setState(() => _dailyReminder = v), Icons.alarm),
          _switchTile('Sound effects', _sound,
              (v) => setState(() => _sound = v), Icons.volume_up_outlined),
          const SizedBox(height: 24),
          _sectionTitle('Account'),
          _navTile('Edit profile', Icons.person_outline, () async {
            await Navigator.push(context,
                MaterialPageRoute(builder: (_) => const EditProfileScreen()));
            setState(() {});
          }),
          _navTile('Privacy & security', Icons.lock_outline, () {
            _infoDialog('Privacy & security',
                'Your account is secured on the server. Connect more options here as needed.');
          }),
          _navTile('Help & support', Icons.help_outline, () {
            _infoDialog('Help & support',
                'Need help? Email support@learnwell.app or use the AI Tutor for quick questions.');
          }),
          _navTile('About LearnWell', Icons.info_outline, () {
            showAboutDialog(
              context: context,
              applicationName: 'LearnWell',
              applicationVersion: '1.2.0',
              applicationLegalese: 'Learn smart. Stay calm.',
            );
          }),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.danger,
              minimumSize: const Size.fromHeight(52),
              side: const BorderSide(color: AppColors.danger),
              shape:
                  RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: _logout,
            icon: const Icon(Icons.logout),
            label: const Text('Log out'),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 8, left: 4),
        child: Text(t,
            style: const TextStyle(
                color: AppColors.textMuted,
                fontWeight: FontWeight.w600,
                fontSize: 13)),
      );

  Widget _switchTile(String title, bool value, ValueChanged<bool> onChanged,
      IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: SwitchListTile(
        value: value,
        onChanged: onChanged,
        activeThumbColor: AppColors.primary,
        secondary: Icon(icon, color: AppColors.textMuted),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      ),
    );
  }

  Widget _navTile(String title, IconData icon, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.textMuted),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
        onTap: onTap,
      ),
    );
  }
}
