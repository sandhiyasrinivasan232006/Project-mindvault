import 'dart:async';
import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'api_service.dart';
import 'session.dart';

class BreathingScreen extends StatefulWidget {
  const BreathingScreen({super.key});

  @override
  State<BreathingScreen> createState() => _BreathingScreenState();
}

class _Phase {
  final String label;
  final int seconds;
  const _Phase(this.label, this.seconds);
}

class _BreathingScreenState extends State<BreathingScreen>
    with SingleTickerProviderStateMixin {
  final _phases = const [
    _Phase('Inhale', 4),
    _Phase('Hold', 4),
    _Phase('Exhale', 6),
  ];

  late final AnimationController _ctrl;
  int _phaseIndex = 0;
  int _secondsLeft = 4;
  int _completedCycles = 0;
  bool _running = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _ctrl =
        AnimationController(vsync: this, duration: const Duration(seconds: 4));
    _secondsLeft = _phases[0].seconds;
  }

  void _start() {
    setState(() => _running = true);
    _runPhase();
  }

  void _stop() {
    _timer?.cancel();
    _ctrl.stop();
    setState(() {
      _running = false;
      _phaseIndex = 0;
      _secondsLeft = _phases[0].seconds;
    });
  }

  void _runPhase() {
    final phase = _phases[_phaseIndex];
    _secondsLeft = phase.seconds;
    _ctrl.duration = Duration(seconds: phase.seconds);
    if (phase.label == 'Inhale') {
      _ctrl.forward(from: _ctrl.value);
    } else if (phase.label == 'Exhale') {
      _ctrl.reverse(from: _ctrl.value);
    }
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      setState(() => _secondsLeft--);
      if (_secondsLeft <= 0) {
        t.cancel();
        _nextPhase();
      }
    });
    setState(() {});
  }

  void _nextPhase() {
    _phaseIndex++;
    if (_phaseIndex >= _phases.length) {
      _phaseIndex = 0;
      _completedCycles++;
      if (Session.userId != null) {
        ApiService.addPoints(Session.userId!, 3).catchError((_) {});
        if (_completedCycles == 3) {
          ApiService.awardBadge(Session.userId!, 'Calm Mind').catchError((_) {});
        }
      }
    }
    if (_running) _runPhase();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final phase = _phases[_phaseIndex];
    const color = Color(0xFF8B5CF6);
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: const Text('Breathing',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: Column(
        children: [
          const SizedBox(height: 10),
          Text('Cycles completed: $_completedCycles',
              style: const TextStyle(color: AppColors.textMuted)),
          Expanded(
            child: Center(
              child: AnimatedBuilder(
                animation: _ctrl,
                builder: (_, __) {
                  final scale = 0.65 + (_ctrl.value * 0.35);
                  return SizedBox(
                    width: 260,
                    height: 260,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Transform.scale(
                          scale: scale,
                          child: Container(
                            width: 240,
                            height: 240,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const RadialGradient(
                                  colors: [color, Color(0xFF6D28D9)]),
                              boxShadow: [
                                BoxShadow(
                                  color: color.withValues(alpha: .35),
                                  blurRadius: 40,
                                  spreadRadius: 6,
                                ),
                              ],
                            ),
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(_running ? phase.label : 'Ready',
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.w700)),
                            const SizedBox(height: 4),
                            if (_running)
                              Text('$_secondsLeft',
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 44,
                                      fontWeight: FontWeight.w800)),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: _phases
                      .map((p) => Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 8),
                            child: Text('${p.label} ${p.seconds}s',
                                style: const TextStyle(
                                    color: AppColors.textMuted,
                                    fontSize: 13)),
                          ))
                      .toList(),
                ),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  style:
                      ElevatedButton.styleFrom(backgroundColor: color),
                  onPressed: _running ? _stop : _start,
                  icon: Icon(_running ? Icons.stop : Icons.play_arrow),
                  label: Text(_running ? 'Stop' : 'Start breathing'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
