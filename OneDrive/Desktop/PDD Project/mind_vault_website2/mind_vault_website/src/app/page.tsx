"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Shield, Heart, Zap, Sparkles, ChevronRight, MessageSquare, AudioLines, FileClock } from "lucide-react";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { analyzeTextLocally } from "../utils/aiEngine";

export default function Home() {
  const [testText, setTestText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleTestAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeTextLocally(testText);
      setAnalysisResult(res);
      setAnalyzing(false);
    }, 600);
  };

  const featureCards = [
    {
      icon: <Heart className="w-6 h-6 text-purple-primary" />,
      title: "AI Emotional Intelligence",
      description: "Empathetic companion that processes speech, text, and daily journals to spot exhaustion patterns and soothe cognitive fatigue."
    },
    {
      icon: <Brain className="w-6 h-6 text-blue-primary" />,
      title: "Neuroscience Guided Recovery",
      description: "Breathing orbs, binaural waves, and focus blocks specifically designed to regulate cortisol levels and trigger vagus nerve activation."
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-primary" />,
      title: "Personal Security Vault",
      description: "Five dedicated emotional repositories (Peace, Motivation, Healing, Gratitude, Dream) protected by military-grade browser encryption."
    },
    {
      icon: <Zap className="w-6 h-6 text-green-primary" />,
      title: "Mood & Habit Sync",
      description: "Advanced heart-rate sync recommendations and daily streaks to support consistency across your mobile and web platforms."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      {/* Background Ambient Blobs */}
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/10 top-[-10%] left-[-10%]" />
      <div className="ambient-glow w-[500px] h-[500px] bg-blue-primary/10 bottom-[10%] right-[-10%]" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex-grow flex flex-col gap-24">
        {/* HERO SECTION */}
        <div className="text-center flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-primary" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              Futuristic Mental Operating System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
          >
            Protect Your Peace.<br />
            <span className="bg-gradient-to-r from-purple-primary via-cyan-primary to-green-primary bg-clip-text text-transparent">
              Elevate Your Mind.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 font-light max-w-2xl"
          >
            MindVault is a cinematic, neuroscience-guided sanctuary. Sync with your existing mobile app, record memories, engage your vagal breathing, and chat with Aura, your adaptive wellness companion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="shadow-[0_0_30px_rgba(123,97,255,0.2)]">
                Initialize Sanctuary <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* INTERACTIVE DEMO WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto w-full"
        >
          <Card variant="neon-purple" className="p-8 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-32 h-32 text-purple-primary" />
            </div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-primary" />
                  Try Aura's Real-Time Tone Analyzer
                </h3>
                <p className="text-sm text-slate-400">
                  Write how you are feeling right now. Our local AI will analyze your stress, energy, and suggest a targeted recovery routine.
                </p>
              </div>

              <form onSubmit={handleTestAnalysis} className="flex flex-col gap-4">
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="e.g. I am feeling extremely exhausted from sitting at the computer all day, my head hurts, and I can't seem to focus..."
                  className="w-full h-32 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-md text-white text-sm focus:bg-white/[0.06] focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20 placeholder-slate-500 transition-all resize-none"
                />
                <Button variant="primary" type="submit" disabled={analyzing || !testText.trim()}>
                  {analyzing ? "Mapping Neural Pathways..." : "Analyze Mood Profile"}
                </Button>
              </form>

              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-6 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-6"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-xs text-slate-400">Mood Score</div>
                      <div className="text-2xl font-bold text-cyan-primary mt-1">{analysisResult.moodScore}/10</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{analysisResult.moodName}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-xs text-slate-400">Stress Factor</div>
                      <div className="text-2xl font-bold text-coral-primary mt-1">{analysisResult.stress}/10</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Vagal State</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-xs text-slate-400">Energy Level</div>
                      <div className="text-2xl font-bold text-green-primary mt-1">{analysisResult.energy}/10</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">ATP Index</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-xs text-slate-400">Burnout Risk</div>
                      <div className={`text-xl font-bold mt-1.5 ${
                        analysisResult.burnoutLevel === "High" ? "text-red-400" :
                        analysisResult.burnoutLevel === "Moderate" ? "text-orange-400" : "text-green-400"
                      }`}>{analysisResult.burnoutLevel}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-primary/5 border border-purple-primary/20 flex gap-3">
                    <Sparkles className="w-5 h-5 text-purple-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-bold text-purple-primary uppercase tracking-wider">Aura's Suggested Recovery</div>
                      <p className="text-sm text-slate-300 leading-relaxed">{analysisResult.advice}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag: string) => (
                      <span key={tag} className="text-[11px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* MARKETING FEATURES GRID */}
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Engineered for Cognitive Sovereignty
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-light">
              We leverage neural indicators, bio-resonance patterns, and encrypted storage configurations to help you establish emotional resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="glass-interactive" className="p-6 h-full flex flex-col gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 w-fit">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{feat.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MOBILE SYNC BANNER */}
        <Card variant="glass" className="p-8 sm:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8 border-white/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-primary/5 rounded-full filter blur-[80px] pointer-events-none" />
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="text-xs font-mono font-bold text-cyan-primary uppercase tracking-widest">
              Existing Ecosystem Connection
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Seamlessly Synchronized with your Mobile App
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-light">
              MindVault AI connects instantly to your mobile app data. All your breath metrics, sleep sounds, and local vault folders sync without heavy database overhead.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-4 w-full md:w-auto">
            <Link href="/auth/signup">
              <Button variant="cyan" className="w-full md:w-auto">
                Sync Account Now
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Encrypted Sync</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> 0-Cost Edge Architecture</span>
            </div>
          </div>
        </Card>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#070a11]/80 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-primary" />
              <span className="font-bold text-white tracking-tight">MindVault AI</span>
            </div>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Encrypted digital sanctuaries and cognitive recovery modules, designed for resilience.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Product</div>
            <Link href="/features" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Platform Features</Link>
            <Link href="/pricing" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Pricing & Plans</Link>
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Neuroscience of AI</Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Sanctuary Docs</div>
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Shield</Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Vault</Link>
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Signal Node (Contact)</Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Ecosystem Status</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-mono">Edge Nodes Live</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">v1.2.0-Production</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-[10px] text-slate-600 font-mono mt-12">
          &copy; {new Date().getFullYear()} MindVault AI Corporation. Engineered for private emotional intelligence.
        </div>
      </footer>
    </div>
  );
}
