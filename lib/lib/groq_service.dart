import 'dart:convert';
import 'package:http/http.dart' as http;

class GroqService {
  static const List<String> _apiKeys = [
    'YOUR_GROQ_API_KEY_HERE',
  ];

  static const String _baseUrl =
      'https://api.groq.com/openai/v1/chat/completions';
  static const String _model = 'llama-3.1-8b-instant';

  static const String _systemPrompt =
      'You are LearnWell Tutor, a friendly and clear study assistant for college students. '
      'Explain concepts simply with short examples. When asked, generate practice MCQs with the answer marked. '
      'Keep answers concise, well structured and encouraging.';

  static Future<String> sendMessage(String message,
      {List<Map<String, String>> history = const []}) async {
    final hasKey = _apiKeys
        .any((k) => k.trim().isNotEmpty && k != 'YOUR_GROQ_API_KEY_HERE');
    if (!hasKey) {
      return 'Add your Groq API key in groq_service.dart to enable live answers.';
    }
    for (final key in _apiKeys) {
      try {
        final res = await http.post(
          Uri.parse(_baseUrl),
          headers: {
            'Authorization': 'Bearer $key',
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'model': _model,
            'messages': [
              {'role': 'system', 'content': _systemPrompt},
              ...history,
              {'role': 'user', 'content': message},
            ],
            'temperature': 0.7,
            'max_tokens': 700,
          }),
        );
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          final content = data['choices']?[0]?['message']?['content'];
          if (content != null) return content.toString().trim();
        }
      } catch (_) {
        continue;
      }
    }
    return 'Could not reach the tutor. Check your connection or API key and try again.';
  }
}
