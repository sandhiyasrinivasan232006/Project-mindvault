import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'groq_service.dart';

class AiTutorScreen extends StatefulWidget {
  const AiTutorScreen({super.key});

  @override
  State<AiTutorScreen> createState() => _AiTutorScreenState();
}

class _Msg {
  final String text;
  final bool fromUser;
  _Msg(this.text, this.fromUser);
}

class _AiTutorScreenState extends State<AiTutorScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  final List<_Msg> _messages = [
    _Msg("Hi! I'm your AI tutor. Ask me to explain a topic, summarise notes, or give you a practice question.",
        false),
  ];
  bool _typing = false;

  final _suggestions = const [
    'Explain machine learning simply',
    'Give me a quiz question on AI',
    'Summarise supervised learning',
  ];

  @override
  void dispose() {
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _send(String text) async {
    if (text.trim().isEmpty || _typing) return;
    final userText = text.trim();
    setState(() {
      _messages.add(_Msg(userText, true));
      _typing = true;
    });
    _controller.clear();
    _scrollDown();

    final history = _messages
        .where((m) => m.text.isNotEmpty)
        .map((m) =>
            {'role': m.fromUser ? 'user' : 'assistant', 'content': m.text})
        .toList();
    if (history.isNotEmpty) history.removeLast();
    final trimmed =
        history.length > 8 ? history.sublist(history.length - 8) : history;

    final reply = await GroqService.sendMessage(userText, history: trimmed);
    if (!mounted) return;
    setState(() {
      _messages.add(_Msg(reply, false));
      _typing = false;
    });
    _scrollDown();
  }

  void _scrollDown() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(_scroll.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.primary.withValues(alpha: .15),
              child: const Icon(Icons.smart_toy_outlined,
                  size: 18, color: AppColors.primary),
            ),
            const SizedBox(width: 10),
            const Text('AI Tutor',
                style: TextStyle(fontWeight: FontWeight.w700)),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_typing ? 1 : 0),
              itemBuilder: (_, i) {
                if (_typing && i == _messages.length) {
                  return _bubble(_Msg('Typing...', false), faded: true);
                }
                return _bubble(_messages[i]);
              },
            ),
          ),
          if (_messages.length <= 1)
            SizedBox(
              height: 44,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: _suggestions
                    .map((s) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ActionChip(
                              label: Text(s), onPressed: () => _send(s)),
                        ))
                    .toList(),
              ),
            ),
          _inputBar(),
        ],
      ),
    );
  }

  Widget _bubble(_Msg m, {bool faded = false}) {
    return Align(
      alignment: m.fromUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints:
            BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        decoration: BoxDecoration(
          color: m.fromUser ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: m.fromUser ? null : Border.all(color: AppColors.border),
        ),
        child: SelectableText(
          m.text,
          style: TextStyle(
            color: m.fromUser
                ? Colors.white
                : (faded ? AppColors.textMuted : AppColors.text),
            height: 1.4,
          ),
        ),
      ),
    );
  }

  Widget _inputBar() {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _controller,
                textInputAction: TextInputAction.send,
                onSubmitted: _send,
                decoration: const InputDecoration(
                  hintText: 'Ask anything...',
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 26,
              backgroundColor: AppColors.primary,
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white),
                onPressed: () => _send(_controller.text),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
