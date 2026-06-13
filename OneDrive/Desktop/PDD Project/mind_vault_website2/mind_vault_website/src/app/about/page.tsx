"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Brain, Shield, Sparkles, HeartHandshake, Compass } from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function About() {
  const pillars = [
    {
      icon: <Brain className="w-6 h-6 text-purple-primary" />,
      title: "Prefrontal De-escalation",
      description: "During hyperarousal (stress/anxiety), raw emotional inputs override logical centers. By parsing journals locally, Aura prompts immediate vagus actions before cognitive fatigue sets in."
    },
    {
      icon: <Compass className="w-6 h-6 text-cyan-primary" />,
      title: "Vagal Autonomic Regulation",
      description: "Heart Rate Variability (HRV) acts as a mirror to your nervous system. MindVault's dynamic guided breathing models use structured patterns to shift you from sympathetic 'fight-or-flight' to parasympathetic recovery."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-primary" />,
      title: "Encrypted Externalization",
      description: "Logging thoughts in physical vaults releases cognitive burden. According to psychological research, the act of compartmentalizing memories into distinct thematic vaults helps quiet looping rumination."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/5 top-[-10%] left-[-10%]" />
      <div className="ambient-glow w-[500px] h-[500px] bg-blue-primary/5 bottom-[10%] right-[-10%]" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex-grow flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/8 text-[10px] font-mono tracking-widest text-cyan-primary uppercase"
          >
            <Activity className="w-3.5 h-3.5" /> Neural Resonance Lab
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Our Neuroscience Philosophy
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Empathetic design coupled with biological science. We construct clean spaces where your mind can heal, track, and align without privacy tradeoffs.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {pillars.map((pil, index) => (
            <motion.div
              key={pil.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-8 h-full flex flex-col gap-5 hover:border-white/10 transition-colors">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 w-fit">
                  {pil.icon}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{pil.title}</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">{pil.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Corporate Note */}
        <Card variant="glass" className="p-8 sm:p-12 relative flex flex-col sm:flex-row items-center gap-8 border-white/5 justify-between">
          <div className="flex gap-4">
            <HeartHandshake className="w-12 h-12 text-cyan-primary shrink-0 mt-1" />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">A Shared Wellness Standard</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-xl">
                MindVault was initiated to address high-friction, server-heavy mental health apps. By combining premium aesthetics with local-first secure architectures, we enable private recovery directories that are fully compatible with your existing mobile app accounts.
              </p>
            </div>
          </div>
          <Link href="/auth/signup" className="shrink-0 w-full sm:w-auto">
            <Button variant="cyan" className="w-full">
              Initialize Sanctuary Node
            </Button>
          </Link>
        </Card>
      </main>

      {/* Simplified Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono relative z-10 bg-[#070a11]/40 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MindVault AI Corporation. Scientific homeostatic models standard.
      </footer>
    </div>
  );
}
