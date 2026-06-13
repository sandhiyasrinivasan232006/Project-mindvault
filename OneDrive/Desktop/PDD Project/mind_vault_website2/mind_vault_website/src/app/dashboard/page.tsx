"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Activity, Sliders, ChevronRight, FileHeart, Brain, Flame, Trash2, ShieldAlert } from "lucide-react";
import { useMindVaultStore, JournalLog } from "../../store/useMindVaultStore";
import { analyzeTextLocally } from "../../utils/aiEngine";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function DashboardHome() {
  const session = useMindVaultStore((state) => state.session);
  const journalLogs = useMindVaultStore((state) => state.journalLogs);
  const addJournalLog = useMindVaultStore((state) => state.addJournalLog);
  const deleteJournalLog = useMindVaultStore((state) => state.deleteJournalLog);

  // Form states
  const [moodScore, setMoodScore] = useState(6);
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [focus, setFocus] = useState(7);
  const [journalText, setJournalText] = useState("");
  const [showLogger, setShowLogger] = useState(false);

  // Compute stats
  const averageMood = journalLogs.length > 0
    ? (journalLogs.reduce((acc, curr) => acc + curr.moodScore, 0) / journalLogs.length).toFixed(1)
    : "N/A";

  const averageStress = journalLogs.length > 0
    ? (journalLogs.reduce((acc, curr) => acc + curr.stress, 0) / journalLogs.length).toFixed(1)
    : "N/A";

  const recoveryScore = journalLogs.length > 0
    ? Math.round(
        ((10 - parseFloat(averageStress)) * 0.4 +
          (journalLogs.reduce((acc, curr) => acc + curr.energy, 0) / journalLogs.length) * 0.3 +
          (journalLogs.reduce((acc, curr) => acc + curr.focus, 0) / journalLogs.length) * 0.3) *
          10
      )
    : 75; // Default healthy baseline

  const moodOptions = [
    { name: "Radiant", score: 9, emoji: "🌟", color: "text-yellow-400" },
    { name: "Tranquil", score: 7, emoji: "🌊", color: "text-cyan-400" },
    { name: "Grounded", score: 5, emoji: "🌱", color: "text-green-400" },
    { name: "Restless", score: 3, emoji: "🌀", color: "text-orange-400" },
    { name: "Heavy", score: 1, emoji: "⛈️", color: "text-purple-400" }
  ];

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dominantMood = moodOptions.find(o => Math.abs(o.score - moodScore) <= 1) || moodOptions[2];
    
    // Analyze journal text
    const localAnalysis = analyzeTextLocally(journalText || `Feeling ${dominantMood.name}`);

    addJournalLog({
      moodScore,
      moodName: dominantMood.name,
      stress,
      energy,
      focus,
      journalText,
      tags: localAnalysis.tags,
      aiAnalysis: {
        burnoutLevel: localAnalysis.burnoutLevel,
        primaryEmotion: localAnalysis.primaryEmotion,
        advice: localAnalysis.advice
      }
    });

    setJournalText("");
    setMoodScore(6);
    setStress(4);
    setEnergy(6);
    setFocus(7);
    setShowLogger(false);
  };

  // Build sleek custom SVG path representing emotional waves
  const renderSVGChart = () => {
    if (journalLogs.length < 2) {
      return (
        <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
          Log at least 2 entries to establish trend waves.
        </div>
      );
    }

    const items = [...journalLogs].reverse().slice(-7); // show last 7
    const height = 150;
    const width = 500;
    const padding = 20;

    const points = items.map((log, index) => {
      const x = padding + (index * (width - padding * 2)) / (items.length - 1);
      const y = height - padding - ((log.moodScore - 1) * (height - padding * 2)) / 9;
      return { x, y };
    });

    const pathD = points.reduce(
      (acc, curr, index) =>
        index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`,
      ""
    );

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7b61ff" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

        {/* Path fill area */}
        {points.length > 1 && (
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#chartGradient)"
          />
        )}
        {/* Main trendline */}
        <path d={pathD} fill="none" stroke="#7b61ff" strokeWidth={3} strokeLinecap="round" />
        {/* Trend data points */}
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={pt.x} cy={pt.y} r={5} fill="#090d16" stroke="#00c9ff" strokeWidth={2} />
            <circle cx={pt.x} cy={pt.y} r={8} fill="#00c9ff" opacity={0} className="hover:opacity-30 transition-opacity" />
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-purple-primary">{session.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Ecosystem node active. Your biometric recovery statistics are balanced.
          </p>
        </div>
        <Button variant="cyan" size="sm" onClick={() => setShowLogger(true)} className="w-full sm:w-auto">
          Log Emotional State
        </Button>
      </div>

      {/* Dynamic Slide-in Logger Modal */}
      <AnimatePresence>
        {showLogger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full"
            >
              <Card variant="glass" className="p-6 relative max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleLogSubmit} className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-primary" />
                      Log Emotional State
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowLogger(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Mood slider quick values */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Dominant Mood (Score: {moodScore})
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {moodOptions.map((opt) => (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setMoodScore(opt.score)}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                            Math.abs(opt.score - moodScore) <= 1
                              ? "bg-purple-primary/10 border-purple-primary shadow-[0_0_10px_var(--emotional-purple-glow)]"
                              : "bg-white/[0.01] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <span className="text-xl">{opt.emoji}</span>
                          <span className={`text-[10px] font-semibold leading-none ${opt.color}`}>{opt.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Stress ({stress}/10)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={stress}
                        onChange={(e) => setStress(parseInt(e.target.value))}
                        className="w-full accent-purple-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Energy ({energy}/10)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={energy}
                        onChange={(e) => setEnergy(parseInt(e.target.value))}
                        className="w-full accent-green-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Focus ({focus}/10)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={focus}
                        onChange={(e) => setFocus(parseInt(e.target.value))}
                        className="w-full accent-cyan-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Quick Journaling Text */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Quick Journal Log
                    </label>
                    <textarea
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      placeholder="e.g. Spent the afternoon on deep programming tasks. Feeling proud but physically depleted..."
                      required
                      className="w-full h-24 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-md text-white text-sm focus:bg-white/[0.06] focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20 placeholder-slate-500 transition-all resize-none"
                    />
                  </div>

                  <Button variant="cyan" type="submit" className="w-full">
                    Log and Analyze Biometrics
                  </Button>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Metrics Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6 flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Biometric Recovery</div>
          <div className="text-4xl font-extrabold tracking-tight text-glow-cyan text-cyan-primary mt-1">
            {recoveryScore}%
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Autonomic HRV Coefficient</p>
        </Card>

        <Card variant="glass" className="p-6 flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average Stress</div>
          <div className="text-4xl font-extrabold tracking-tight text-glow-purple text-purple-primary mt-1">
            {averageStress}/10
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Vagal state tracking</p>
        </Card>

        <Card variant="glass" className="p-6 flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average Mood</div>
          <div className="text-4xl font-extrabold tracking-tight text-glow-green text-green-primary mt-1">
            {averageMood}/10
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Stability wave coefficient</p>
        </Card>

        <Card variant="glass" className="p-6 flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Vagus Breathing</div>
          <div className="text-4xl font-extrabold tracking-tight text-glow-cyan text-white mt-1">
            {session.completedBreathingMinutes}m
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Strengthened parasympathetic pathway</p>
        </Card>
      </div>

      {/* Wave chart and AI insights row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Custom SVG Trend wave */}
        <Card variant="glass" className="p-6 lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-purple-primary" />
              Emotional Stability Wave
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Last 7 Sessions</span>
          </div>
          <div className="h-[180px] w-full mt-2 bg-white/[0.01] border border-white/5 rounded-xl p-2">
            {renderSVGChart()}
          </div>
        </Card>

        {/* Dynamic local AI advice panel */}
        <Card variant="neon-purple" className="p-6 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Aura AI Insights</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {journalLogs.length > 0 && journalLogs[0].aiAnalysis
                ? journalLogs[0].aiAnalysis.advice
                : "Initiate your first emotional check-in to receive targeted prefrontal recovery protocols."}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <hr className="border-white/5" />
            <Link href="/dashboard/companion">
              <Button variant="primary" size="sm" className="w-full text-xs">
                Enter Companion Chat <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Logs Feed Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Node Logs Feed</h3>
        {journalLogs.length === 0 ? (
          <Card variant="glass" className="p-8 text-center text-slate-500 font-mono text-xs border-dashed border-white/10">
            No logged biometric entries. Complete a check-in to populate node registers.
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {journalLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card variant="glass" className="p-5 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm font-bold text-white flex items-center gap-1">
                        Mood State: <span className="text-purple-primary text-glow-purple ml-1">{log.moodName}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      {log.aiAnalysis && (
                        <span className={`text-[9px] font-mono border px-2 py-0.5 rounded-full ${
                          log.aiAnalysis.burnoutLevel === "High" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                          log.aiAnalysis.burnoutLevel === "Moderate" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                          "bg-green-500/10 border-green-500/30 text-green-400"
                        }`}>
                          Burnout: {log.aiAnalysis.burnoutLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed italic">
                      "{log.journalText}"
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {log.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-3 justify-between w-full sm:w-auto self-stretch shrink-0">
                    <div className="flex gap-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Stress</span>
                        <span className="text-sm font-bold text-coral-primary">{log.stress}/10</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Energy</span>
                        <span className="text-sm font-bold text-green-primary">{log.energy}/10</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Focus</span>
                        <span className="text-sm font-bold text-cyan-primary">{log.focus}/10</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteJournalLog(log.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
