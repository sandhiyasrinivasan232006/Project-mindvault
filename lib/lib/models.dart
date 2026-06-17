import 'package:flutter/material.dart';

Color colorFromHex(String? hex) {
  if (hex == null || hex.isEmpty) return const Color(0xFF4F46E5);
  var h = hex.replaceAll('#', '').trim();
  if (h.length == 6) h = 'FF$h';
  return Color(int.parse(h, radix: 16));
}

IconData iconFromName(String? name) {
  switch (name) {
    case 'psychology_alt': return Icons.psychology_alt;
    case 'auto_graph': return Icons.auto_graph;
    case 'code': return Icons.code;
    case 'extension': return Icons.extension;
    case 'account_tree': return Icons.account_tree;
    case 'memory': return Icons.memory;
    case 'storage': return Icons.storage;
    case 'lan': return Icons.lan;
    case 'engineering': return Icons.engineering;
    case 'web': return Icons.web;
    case 'developer_board': return Icons.developer_board;
    case 'graphic_eq': return Icons.graphic_eq;
    case 'dns': return Icons.dns;
    case 'cell_tower': return Icons.cell_tower;
    case 'local_fire_department': return Icons.local_fire_department;
    case 'water_drop': return Icons.water_drop;
    case 'precision_manufacturing': return Icons.precision_manufacturing;
    case 'factory': return Icons.factory;
    case 'fitness_center': return Icons.fitness_center;
    case 'bolt': return Icons.bolt;
    case 'tune': return Icons.tune;
    case 'electric_bolt': return Icons.electric_bolt;
    case 'power': return Icons.power;
    case 'electrical_services': return Icons.electrical_services;
    case 'architecture': return Icons.architecture;
    case 'terrain': return Icons.terrain;
    case 'landscape': return Icons.landscape;
    case 'foundation': return Icons.foundation;
    case 'directions_car': return Icons.directions_car;
    case 'science': return Icons.science;
    case 'calculate': return Icons.calculate;
    case 'public': return Icons.public;
    case 'biotech': return Icons.biotech;
    default: return Icons.menu_book;
  }
}

const List<String> kNewSubjectIcons = [
  'menu_book', 'science', 'calculate', 'code',
  'public', 'bolt', 'architecture', 'biotech',
];
const List<String> kNewSubjectColors = [
  '#4F46E5', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899',
];

String makeSubjectCode(String name) {
  final parts = name
      .toUpperCase()
      .replaceAll(RegExp(r'[^A-Z0-9 ]'), '')
      .split(' ')
      .where((w) => w.isNotEmpty);
  final code = parts.map((w) => w[0]).join();
  return code.isEmpty ? 'SUB' : code;
}

class Subject {
  final int id;
  final String name;
  final String code;
  final String department;
  final IconData icon;
  final Color color;
  final int noteCount;
  final int questionCount;

  Subject({
    required this.id,
    required this.name,
    required this.code,
    required this.department,
    required this.icon,
    required this.color,
    this.noteCount = 0,
    this.questionCount = 0,
  });

  factory Subject.fromJson(Map<String, dynamic> j) => Subject(
        id: j['id'] ?? 0,
        name: j['name'] ?? '',
        code: j['code'] ?? '',
        department: j['department'] ?? '',
        icon: iconFromName(j['icon']),
        color: colorFromHex(j['color']),
        noteCount: j['note_count'] ?? 0,
        questionCount: j['question_count'] ?? 0,
      );
}

class NoteSection {
  final int id;
  final String heading;
  final String body;
  NoteSection({this.id = 0, required this.heading, required this.body});

  factory NoteSection.fromJson(Map<String, dynamic> j) => NoteSection(
        id: j['id'] ?? 0,
        heading: j['heading'] ?? '',
        body: j['body'] ?? '',
      );
}

class QuizQuestion {
  final int id;
  final String question;
  final List<String> options;
  final int answerIndex;
  QuizQuestion(
      {this.id = 0,
      required this.question,
      required this.options,
      required this.answerIndex});

  factory QuizQuestion.fromJson(Map<String, dynamic> j) => QuizQuestion(
        id: j['id'] ?? 0,
        question: j['question'] ?? '',
        options: (j['options'] as List).map((e) => e.toString()).toList(),
        answerIndex: j['answer_index'] ?? 0,
      );
}

class MoodEntry {
  final String mood;
  final String emoji;
  final String? note;
  final String time;
  MoodEntry(
      {required this.mood, required this.emoji, this.note, required this.time});

  factory MoodEntry.fromJson(Map<String, dynamic> j) => MoodEntry(
        mood: j['mood'] ?? '',
        emoji: j['emoji'] ?? '',
        note: (j['note'] ?? '').toString().isEmpty ? null : j['note'],
        time: j['created_at'] ?? '',
      );
}

class ProgressItem {
  final String name;
  final double percent;
  ProgressItem(this.name, this.percent);
  factory ProgressItem.fromJson(Map<String, dynamic> j) =>
      ProgressItem(j['name'] ?? '', (j['percent'] ?? 0).toDouble());
}
