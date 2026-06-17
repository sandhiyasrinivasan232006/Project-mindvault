import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  late Future<Map<String, dynamic>> _future;

  final _allBadges = const [
    _Badge('Quick Starter', Icons.flag, AppColors.accent),
    _Badge('Calm Mind', Icons.spa, Color(0xFF8B5CF6)),
    _Badge('Quiz Master', Icons.psychology, AppColors.primary),
    _Badge('7-Day Streak', Icons.local_fire_department, AppColors.danger),
    _Badge('Night Owl', Icons.nightlight, Color(0xFF334155)),
    _Badge('Top Scorer', Icons.military_tech, AppColors.warning),
  ];

  final _rewards = const [
    _Redeem('Extra quiz attempt', 50, Icons.replay),
    _Redeem('Theme unlock', 100, Icons.palette),
    _Redeem('Certificate of progress', 250, Icons.workspace_premium),
  ];

  @override
  void initState() {
    super.initState();
    _future = ApiService.getRewards(Session.userId!);
  }

  void _reload() =>
      setState(() => _future = ApiService.getRewards(Session.userId!));

  Future<void> _redeem(_Redeem r, int points) async {
    if (points < r.cost) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Need ${r.cost - points} more points'),
          behavior: SnackBarBehavior.floating));
      return;
    }
    try {
      await ApiService.addPoints(Session.userId!, -r.cost);
      _reload();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Redeemed: ${r.title}'),
          behavior: SnackBarBehavior.floating));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title:
            const Text('Rewards', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final data = snap.data ?? {};
          final points = data['points'] ?? 0;
          final streak = data['streak_days'] ?? 0;
          final earned = (data['badges'] as List?)?.cast<String>() ?? [];
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
            children: [
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: const LinearGradient(
                      colors: [AppColors.warning, Color(0xFFEA580C)]),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.stars_rounded,
                        color: Colors.white, size: 44),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('$points',
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 32,
                                fontWeight: FontWeight.w800)),
                        const Text('Total points',
                            style: TextStyle(color: Colors.white70)),
                      ],
                    ),
                    const Spacer(),
                    Column(
                      children: [
                        const Icon(Icons.local_fire_department,
                            color: Colors.white),
                        Text('$streak day streak',
                            style: const TextStyle(color: Colors.white)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 26),
              const Text('Badges',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 14),
              GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.95,
                children:
                    _allBadges.map((b) => _badgeTile(b, earned)).toList(),
              ),
              const SizedBox(height: 26),
              const Text('Redeem points',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 14),
              ..._rewards.map((r) => _redeemTile(r, points)),
            ],
          );
        },
      ),
    );
  }

  Widget _badgeTile(_Badge b, List<String> earnedList) {
    final earned = earnedList.contains(b.name);
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(b.icon, size: 34, color: earned ? b.color : AppColors.border),
          const SizedBox(height: 8),
          Text(b.name,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: earned ? AppColors.text : AppColors.textMuted)),
        ],
      ),
    );
  }

  Widget _redeemTile(_Redeem r, int points) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.primary.withValues(alpha: .12),
            child: Icon(r.icon, color: AppColors.primary),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(r.title,
                style: const TextStyle(fontWeight: FontWeight.w600)),
          ),
          OutlinedButton(
              onPressed: () => _redeem(r, points),
              child: Text('${r.cost} pts')),
        ],
      ),
    );
  }
}

class _Badge {
  final String name;
  final IconData icon;
  final Color color;
  const _Badge(this.name, this.icon, this.color);
}

class _Redeem {
  final String title;
  final int cost;
  final IconData icon;
  const _Redeem(this.title, this.cost, this.icon);
}
