"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Brain, Shield, BarChart3, Sparkles, MessageSquare, Compass, ShieldAlert } from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Features() {
  const deepFeatures = [
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-primary" />,
      title: "Tone-Adaptive Companion (Aura)",
      description: "Aura is trained to identify over 50 cognitive tension signals in your logs. She shifts her communication style—offering analytical neuroscience context, stoic perspectives, zen reminders, or comforting empathy—and recalibrates the ambient light frequencies of your workspace in real-time.",
      badge: "AI CORE"
    },
    {
      icon: <Compass className="w-8 h-8 text-cyan-primary" />,
      title: "Autonomic Recovery (Vagal Orb)",
      description: "Activate your parasympathetic nervous system via guided breathing cycles. Guided by a concentric pulsing visualizer that matches precise scientific ratios (like the box breathing technique or 4-7-8 anxiety relief pattern), your heart rate variability (HRV) adjusts to optimal resonance.",
      badge: "NEUROSCIENCE"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-primary" />,
      title: "Encrypted Multi-Vault Storage",
      description: "Your records are separated into five themed mental chambers: Peace, Motivation, Healing, Gratitude, and Dream vaults. Each chamber features custom ambient filters and a lightweight client summarization engine that builds automated indexing tags without uploading raw data to the cloud.",
      badge: "SECURITY"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-coral-primary" />,
      title: "Cognitive Balance Analytics",
      description: "Visualize weekly and monthly mood trends, stability index correlations, and burnout warning markers. Using fluid, custom-rendered interactive vector graphs, you can track stress indicators, energy reservoirs, and focus cycles without bulky analytical scripts.",
      badge: "ANALYTICS"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan-primary/5 top-[-10%] right-[-10%]" />
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/5 bottom-[10%] left-[-15%]" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex-grow flex flex-col gap-16">
        {/* Page Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            System Capabilities
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            An advanced architectural breakdown of the MindVault ecosystem. Engineered to minimize latency, eliminate hosting overhead, and guarantee complete mental privacy.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {deepFeatures.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-8 h-full flex flex-col gap-6 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 bg-white/5 border border-white/8 px-3 py-1 rounded-full">
                    {feat.badge}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{feat.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technical Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-r from-purple-primary/10 via-[#00c9ff]/5 to-transparent border border-purple-primary/20 flex flex-col sm:flex-row items-center gap-6 justify-between mt-8"
        >
          <div className="flex gap-4">
            <ShieldAlert className="w-10 h-10 text-purple-primary shrink-0 mt-1" />
            <div className="flex flex-col gap-1.5">
              <h4 className="text-lg font-bold">Client-Side Autonomy & Security</h4>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
                Unlike mainstream wellness products that record and analyze your intimate feelings on central servers, MindVault operates a fully local intelligence module. Your diaries, companion chats, and recovery logs never leave your personal storage node.
              </p>
            </div>
          </div>
          <Link href="/auth/signup" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              Initialize Sanctuary
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Simplified Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono relative z-10 bg-[#070a11]/40 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MindVault AI Corporation. Powered by edge-optimized NLP frameworks.
      </footer>
    </div>
  );
}
