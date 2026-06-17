import 'dart:convert';
import 'package:http/http.dart' as http;
import 'url.dart';
import 'models.dart';

class ApiService {
  static Uri _u(String path) => Uri.parse('${Url.Urls}$path');
  static const _headers = {'Content-Type': 'application/json'};

  static dynamic _handle(http.Response r) {
    final data = r.body.isNotEmpty ? jsonDecode(r.body) : null;
    if (r.statusCode >= 200 && r.statusCode < 300) return data;
    final msg = (data is Map && data['error'] != null)
        ? data['error']
        : 'Error ${r.statusCode}';
    throw Exception(msg);
  }

  static Future<dynamic> _get(String path) async =>
      _handle(await http.get(_u(path)));
  static Future<dynamic> _post(String path, Map body) async =>
      _handle(await http.post(_u(path), headers: _headers, body: jsonEncode(body)));
  static Future<dynamic> _put(String path, Map body) async =>
      _handle(await http.put(_u(path), headers: _headers, body: jsonEncode(body)));
  static Future<dynamic> _delete(String path) async =>
      _handle(await http.delete(_u(path)));

  // AUTH
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final r = await _post('/login', {'email': email, 'password': password});
    return Map<String, dynamic>.from(r['user']);
  }

  static Future<void> signup(Map<String, dynamic> body) async {
    await _post('/signup', body);
  }

  static Future<void> logout(String email) async {
    await _post('/logout', {'email': email});
  }

  static Future<void> updateProfile(int userId, Map<String, dynamic> body) async {
    await _put('/profile/$userId', body);
  }

  // SUBJECTS
  static Future<List<Subject>> getSubjects({String? department}) async {
    final path =
        department == null ? '/subjects' : '/subjects?department=$department';
    final r = await _get(path) as List;
    return r.map((e) => Subject.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  static Future<void> addSubject(
      String department, String code, String name, String icon, String color) async {
    await _post('/subjects', {
      'department': department,
      'code': code,
      'name': name,
      'icon': icon,
      'color': color,
    });
  }

  // NOTES
  static Future<List<NoteSection>> getNotes(String code) async {
    final r = await _get('/notes/$code') as List;
    return r
        .map((e) => NoteSection.fromJson(Map<String, dynamic>.from(e)))
        .toList();
  }

  static Future<void> addNote(String code, String heading, String body) async {
    await _post('/notes', {
      'subject_code': code,
      'heading': heading,
      'body': body,
    });
  }

  // QUESTIONS
  static Future<List<QuizQuestion>> getQuestions(String code) async {
    final r = await _get('/questions/$code') as List;
    return r
        .map((e) => QuizQuestion.fromJson(Map<String, dynamic>.from(e)))
        .toList();
  }

  static Future<void> addQuestion(
      String code, String question, List<String> options, int answerIndex) async {
    await _post('/questions', {
      'subject_code': code,
      'question': question,
      'options': options,
      'answer_index': answerIndex,
    });
  }

  // QUIZ ATTEMPTS + PROGRESS
  static Future<Map<String, dynamic>> addQuizAttempt(
      int userId, String code, int score, int total) async {
    final r = await _post('/quiz_attempts', {
      'user_id': userId,
      'subject_code': code,
      'score': score,
      'total': total,
    });
    return Map<String, dynamic>.from(r);
  }

  static Future<List<ProgressItem>> getProgress(int userId) async {
    final r = await _get('/progress/$userId') as List;
    return r
        .map((e) => ProgressItem.fromJson(Map<String, dynamic>.from(e)))
        .toList();
  }

  // MOODS
  static Future<List<MoodEntry>> getMoods(int userId) async {
    final r = await _get('/moods/$userId') as List;
    return r.map((e) => MoodEntry.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  static Future<void> addMood(
      int userId, String mood, String emoji, String? note) async {
    await _post('/moods', {
      'user_id': userId,
      'mood': mood,
      'emoji': emoji,
      'note': note ?? '',
    });
  }

  // REWARDS
  static Future<Map<String, dynamic>> getRewards(int userId) async {
    final r = await _get('/rewards/$userId');
    return Map<String, dynamic>.from(r);
  }

  static Future<void> addPoints(int userId, int points) async {
    await _post('/rewards/$userId/add_points', {'points': points});
  }

  static Future<void> awardBadge(int userId, String badge) async {
    await _post('/badges', {'user_id': userId, 'badge': badge});
  }

  // DASHBOARD
  static Future<Map<String, dynamic>> getDashboard(int userId) async {
    final r = await _get('/dashboard/$userId');
    return Map<String, dynamic>.from(r);
  }
}
