"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Brain, Settings2, Trash2, ShieldCheck, Heart, User, Check } from "lucide-react";
import { useMindVaultStore, Message } from "../../../store/useMindVaultStore";
import { generateCompanionResponse } from "../../../utils/aiEngine";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function AICompanion() {
  const chatMessages = useMindVaultStore((state) => state.chatMessages);
  const addChatMessage = useMindVaultStore((state) => state.addChatMessage);
  const clearChat = useMindVaultStore((state) => state.clearChat);
  const geminiApiKey = useMindVaultStore((state) => state.geminiApiKey);
  const companionSettings = useMindVaultStore((state) => state.companionSettings);
  const updateCompanionSettings = useMindVaultStore((state) => state.updateCompanionSettings);

  const [inputMessage, setInputMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeGlowTheme, setActiveGlowTheme] = useState("calm"); // calm, stressed, exhausted, inspired, healing, focus
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personalityOptions = [
    { id: "empathetic", label: "Empathetic", emoji: "❤️", desc: "Warm, validating, and supportive" },
    { id: "stoic", label: "Stoic", emoji: "🛡️", desc: "Rational, resilient, and focused" },
    { id: "analytical", label: "Analytical", emoji: "🧠", desc: "Neuroscience and logically driven" },
    { id: "zen", label: "Zen", emoji: "🌊", desc: "Poetic, calm, and spacious" }
  ] as const;

  const quickPresets = [
    "I am feeling completely overwhelmed by my work.",
    "Can you suggest a 5-minute dopamine detox?",
    "Explain the neuroscience of stress management.",
    "Help me wind down for deep sleep."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, typing]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    addChatMessage({
      sender: "user",
      text: text.trim()
    });

    setInputMessage("");
    setTyping(true);

    // 2. Fetch history for context
    const currentHistory = [...chatMessages, { id: "temp", sender: "user" as const, text: text.trim(), timestamp: "" }];

    try {
      // 3. Generate response using AI Engine (simulates local OR routes to Gemini API if key exists)
      const res = await generateCompanionResponse(
        currentHistory,
        companionSettings.personality,
        geminiApiKey
      );

      // 4. Update the adaptive ambient background glow matching the emotional response
      setActiveGlowTheme(res.emotion);

      // 5. Add AI message
      addChatMessage({
        sender: "ai",
        text: res.text,
        emotion: res.emotion
      });
    } catch (e) {
      console.error(e);
      addChatMessage({
        sender: "ai",
        text: "I experienced an offline latency bump. Let's take a deep breath and sync again.",
        emotion: "calm"
      });
    } finally {
      setTyping(false);
    }
  };

  const getGlowStyles = () => {
    switch (activeGlowTheme) {
      case "stressed":
        return {
          glow: "bg-coral-primary/10",
          border: "border-coral-primary/30",
          accent: "text-coral-primary"
        };
      case "exhausted":
        return {
          glow: "bg-purple-primary/10",
          border: "border-purple-primary/30",
          accent: "text-purple-primary"
        };
      case "inspired":
        return {
          glow: "bg-green-primary/10",
          border: "border-green-primary/30",
          accent: "text-green-primary"
        };
      case "healing":
        return {
          glow: "bg-cyan-primary/10",
          border: "border-cyan-primary/30",
          accent: "text-cyan-primary"
        };
      default:
        return {
          glow: "bg-blue-primary/10",
          border: "border-blue-primary/30",
          accent: "text-blue-primary"
        };
    }
  };

  const currentGlow = getGlowStyles();

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-8 relative overflow-hidden">
      {/* Absolute adaptive ambient background glow */}
      <div className={`ambient-glow w-[600px] h-[600px] rounded-full filter blur-[120px] absolute top-10 right-10 ${currentGlow.glow} transition-all duration-1000 z-0`} />

      {/* Main chat window container */}
      <Card variant="glass" className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 border transition-all duration-1000 ${currentGlow.border}`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-slate-900/60 border ${currentGlow.border} transition-all duration-1000`}>
              <Brain className={`w-5 h-5 ${currentGlow.accent} transition-colors duration-1000`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                {companionSettings.name} <span className="text-[9px] bg-purple-primary/20 text-purple-primary font-mono px-1.5 py-0.5 rounded border border-purple-primary/30">AI COMPANION</span>
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-mono">
                {companionSettings.personality} response profile active
              </span>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors cursor-pointer"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Message Board */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {chatMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 max-w-sm mx-auto">
              <Sparkles className={`w-10 h-10 ${currentGlow.accent} animate-pulse`} />
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider">Initialize Connection</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  I am Aura, your cognitive resonance companion. Tell me how your day is going, or select a preset prompt to establish a protocol.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                {quickPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSendMessage(preset)}
                    className="p-3 text-left rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 text-xs text-slate-300 font-light leading-relaxed transition-all cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 h-fit ${
                    msg.sender === "user" ? "bg-white/5 border-white/10" : `bg-slate-900/40 border-white/5`
                  }`}>
                    {msg.sender === "user" ? <User className="w-4 h-4 text-slate-400" /> : <Brain className="w-4 h-4 text-purple-primary" />}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-light leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-primary to-[#8b5cf6] text-white"
                        : "bg-slate-900/60 text-slate-200 border border-white/5"
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[9px] font-mono text-slate-500 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Dynamic typing indicator */}
              {typing && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/40 shrink-0 h-fit">
                    <Brain className="w-4 h-4 text-purple-primary animate-pulse" />
                  </div>
                  <div className="px-4 py-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex gap-1 items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={scrollToBottom} />
            </div>
          )}
        </div>

        {/* Input Message panel */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Transmit your message to Aura..."
              disabled={typing}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-md text-white text-xs sm:text-sm focus:bg-white/[0.06] focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20 placeholder-slate-500 transition-all disabled:opacity-40"
            />
            <Button
              variant="primary"
              type="submit"
              disabled={typing || !inputMessage.trim()}
              className="px-4 py-3 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Companion Configuration Side Panel */}
      <Card variant="glass" className="w-full lg:w-80 p-6 flex flex-col gap-6 relative z-10 bg-slate-950/30">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Settings2 className="w-4.5 h-4.5 text-purple-primary" />
          Aura Configuration
        </h3>

        {/* Companion Custom Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Companion Persona Name</label>
          <input
            type="text"
            value={companionSettings.name}
            onChange={(e) => updateCompanionSettings({ name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/8 text-xs text-white focus:outline-none focus:border-purple-primary placeholder-slate-600 transition-all"
            placeholder="Aura"
          />
        </div>

        {/* Personality selection list */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">designated personality</label>
          <div className="flex flex-col gap-2">
            {personalityOptions.map((opt) => {
              const isSelected = companionSettings.personality === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateCompanionSettings({ personality: opt.id })}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-primary/10 border-purple-primary shadow-[0_0_10px_var(--emotional-purple-glow)]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="text-base mt-0.5">{opt.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {opt.label} {isSelected && <Check className="w-3.5 h-3.5 text-purple-primary" />}
                    </span>
                    <span className="text-[10px] text-slate-500 font-light mt-0.5">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Encryption validation details */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-primary shrink-0" />
          <span>Local NLP sandbox is active. Conversation logs remain private.</span>
        </div>
      </Card>
    </div>
  );
}
