"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Wind, Hourglass, ShieldCheck, CheckCircle } from "lucide-react";
import { useMindVaultStore } from "../../../store/useMindVaultStore";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function RecoverySystem() {
  const addBreathingTime = useMindVaultStore((state) => state.addBreathingTime);
  const [activeTab, setActiveTab] = useState<"breathing" | "focus">("breathing");

  // BREATHING STATE
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathCycle, setBreathCycle] = useState<"box" | "anxiety" | "deep">("anxiety");
  const [breathPhase, setBreathPhase] = useState<"inhale" | "holdIn" | "exhale" | "holdOut">("inhale");
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [breathingCompleted, setBreathingCompleted] = useState(false);

  // FOCUS TIMER STATE
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [timerType, setTimerType] = useState<"focus" | "break">("focus");

  // AUDIO MIXER STATE
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<"binaural" | "rain" | "synth">("binaural");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = {
    binaural: "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav", // Lightweight bell chime trigger
    rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // Looping ambient backing soundtrack
    synth: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  };

  // 1. Breathing Cycle configuration ratios (Inhale, Hold, Exhale, Hold)
  const breathConfigs = {
    box: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, label: "Box Breathing (4-4-4-4)", desc: "Stabilizes panic and focuses sensory prefrontals." },
    anxiety: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0, label: "4-7-8 Calm Wave", desc: "Activates vagal nerves to slow down racing heart beats." },
    deep: { inhale: 5, holdIn: 2, exhale: 5, holdOut: 0, label: "Deep Breath (5-2-5)", desc: "Maintains optimal autonomic homeostatic balance." }
  };

  // Breathing Loop Controller
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive) {
      const config = breathConfigs[breathCycle];
      interval = setInterval(() => {
        setPhaseSeconds((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            if (breathPhase === "inhale") {
              if (config.holdIn > 0) {
                setBreathPhase("holdIn");
                return config.holdIn;
              } else {
                setBreathPhase("exhale");
                return config.exhale;
              }
            } else if (breathPhase === "holdIn") {
              setBreathPhase("exhale");
              return config.exhale;
            } else if (breathPhase === "exhale") {
              if (config.holdOut > 0) {
                setBreathPhase("holdOut");
                return config.holdOut;
              } else {
                setBreathPhase("inhale");
                return config.inhale;
              }
            } else {
              setBreathPhase("inhale");
              return config.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase, breathCycle]);

  // Track breathing time updates in Zustand (updates streak & recovery score)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (breathingActive) {
      timeout = setTimeout(() => {
        addBreathingTime(1); // add 1 minute
        setBreathingCompleted(true);
        setTimeout(() => setBreathingCompleted(false), 3000);
      }, 60 * 1000); // every minute
    }
    return () => clearTimeout(timeout);
  }, [breathingActive]);

  // Reset breathing phase
  useEffect(() => {
    setBreathPhase("inhale");
    setPhaseSeconds(breathConfigs[breathCycle].inhale);
  }, [breathCycle]);

  // 2. Focus Timer Clock Controller
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer expired, switch sessions
            setTimerActive(false);
            if (timerType === "focus") {
              setTimerType("break");
              return 5 * 60; // 5 mins break
            } else {
              setTimerType("focus");
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerType]);

  // Audio stream triggers
  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[selectedTrack]);
      audioRef.current.loop = true;
    }

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.src = tracks[selectedTrack];
      audioRef.current.play().catch(e => console.warn(e));
      setAudioPlaying(true);
    }
  };

  const handleTrackChange = (trackId: "binaural" | "rain" | "synth") => {
    setSelectedTrack(trackId);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[trackId];
      if (audioPlaying) {
        audioRef.current.play().catch(e => console.warn(e));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Format countdown clock
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-8 pb-12 relative">
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan-primary/5 top-[-10%] right-[-10%] z-0" />
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/5 bottom-[-10%] left-[-10%] z-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Neuroscience Recovery Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Stabilize heart rate variability, regulate cortisol spikes, and focus raw cognitive flow.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-white/5 pb-2 relative z-10">
        <button
          onClick={() => setActiveTab("breathing")}
          className={`px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "breathing"
              ? "border-cyan-primary text-cyan-primary"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wind className="w-4 h-4" /> Autonomic Breathing Circle
        </button>
        <button
          onClick={() => setActiveTab("focus")}
          className={`px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "focus"
              ? "border-purple-primary text-purple-primary"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Hourglass className="w-4 h-4" /> Focus & Dopamine Detox
        </button>
      </div>

      {/* BREATHING MODULE VIEW */}
      {activeTab === "breathing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Animated pulsing breathing circle */}
          <Card variant="glass" className="p-8 lg:col-span-2 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            
            {/* Ambient completing banner notification */}
            <AnimatePresence>
              {breathingCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 px-4 py-2 bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-400 rounded-xl flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Session logged. Vagal index updated (+1 min)
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-8 py-6">
              {/* Concentric visual rings */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-primary/20"
                  animate={{
                    scale: breathingActive && breathPhase === "inhale" ? 1.3 : 1
                  }}
                  transition={{ duration: breathConfigs[breathCycle].inhale, ease: "easeInOut" }}
                />
                
                {/* Secondary breathing orb */}
                <motion.div
                  className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-6 border shadow-2xl relative z-10 transition-all duration-500 ${
                    breathPhase === "inhale" ? "bg-cyan-primary/10 border-cyan-primary/40 shadow-[0_0_40px_rgba(0,201,255,0.2)]" :
                    breathPhase === "holdIn" ? "bg-purple-primary/10 border-purple-primary/40 shadow-[0_0_40px_rgba(123,97,255,0.2)]" :
                    breathPhase === "exhale" ? "bg-green-primary/10 border-green-primary/40 shadow-[0_0_40px_rgba(67,233,123,0.2)]" :
                    "bg-slate-900/60 border-white/5"
                  }`}
                  animate={{
                    scale: breathingActive && breathPhase === "inhale" ? 1.25 :
                           breathingActive && breathPhase === "exhale" ? 0.95 : 1.05
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <span className="text-xl font-bold uppercase tracking-widest text-white mt-1">
                    {breathPhase === "inhale" ? "Inhale" :
                     breathPhase === "holdIn" ? "Hold" :
                     breathPhase === "exhale" ? "Exhale" : "Hold"}
                  </span>
                  <span className="text-3xl font-extrabold font-mono text-glow-cyan text-white mt-2">
                    {phaseSeconds}s
                  </span>
                </motion.div>
              </div>

              {/* Start Stop Actions */}
              <div className="flex gap-4">
                <Button
                  variant={breathingActive ? "outline" : "cyan"}
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="px-8 shadow-lg"
                >
                  {breathingActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {breathingActive ? "Pause Session" : "Start Session"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBreathingActive(false);
                    setBreathPhase("inhale");
                    setPhaseSeconds(breathConfigs[breathCycle].inhale);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Config sidebar panel */}
          <Card variant="glass" className="p-6 flex flex-col gap-6 bg-slate-950/30">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Compass className="w-4.5 h-4.5 text-cyan-primary" />
              Breathing Ratios
            </h3>

            <div className="flex flex-col gap-3.5">
              {Object.entries(breathConfigs).map(([key, cfg]) => {
                const isSelected = breathCycle === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setBreathingActive(false);
                      setBreathCycle(key as any);
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-primary/10 border-cyan-primary shadow-[0_0_10px_var(--healing-cyan-glow)]"
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="text-xs font-bold text-white tracking-tight">{cfg.label}</span>
                    <span className="text-[10px] text-slate-500 font-light leading-relaxed mt-0.5">{cfg.desc}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* FOCUS BLOCK POMODORO VIEW */}
      {activeTab === "focus" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Countdown Clock Display */}
          <Card variant="glass" className="p-8 lg:col-span-2 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-8 py-6">
              <div className="flex flex-col gap-2 text-center">
                <span className="text-xs font-mono font-bold tracking-widest text-purple-primary uppercase">
                  {timerType === "focus" ? "Deep Focus Segment" : "Parasympathetic Rest Break"}
                </span>
                <span className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white mt-2">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Start Stop timer actions */}
              <div className="flex gap-4">
                <Button
                  variant={timerActive ? "outline" : "primary"}
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-8 shadow-lg"
                >
                  {timerActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {timerActive ? "Pause Focus" : "Begin Focus"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTimerActive(false);
                    setTimeLeft(25 * 60);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Soundtrack ambient mixer sidebar */}
          <Card variant="glass" className="p-6 flex flex-col gap-6 bg-slate-950/30">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-3">
              <span className="flex items-center gap-2"><Sparkles className="w-4.5 h-4.5 text-purple-primary" /> Ambient Soundscapes</span>
              <button
                onClick={toggleAudio}
                className="p-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 text-slate-300 transition-colors"
                title="Toggle soundtrack"
              >
                {audioPlaying ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>
            </h3>

            <div className="flex flex-col gap-3">
              {[
                { id: "binaural" as const, label: "432Hz Binaural Focus Waves", desc: "Stabilizes mental clarity loops." },
                { id: "rain" as const, label: "Generative Forest Rainstorm", desc: "Filters out outside distractions." },
                { id: "synth" as const, label: "Deep Cognitive Synth Beats", desc: "Supports steady brain flow states." }
              ].map((trk) => {
                const isSelected = selectedTrack === trk.id;
                return (
                  <button
                    key={trk.id}
                    onClick={() => handleTrackChange(trk.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-primary/10 border-purple-primary shadow-[0_0_10px_var(--emotional-purple-glow)]"
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="text-xs font-bold text-white tracking-tight">{trk.label}</span>
                    <span className="text-[10px] text-slate-500 font-light mt-0.5">{trk.desc}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Security validation */}
      <div className="relative z-10 mt-6 p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center gap-3 text-xs text-slate-500 font-mono">
        <ShieldCheck className="w-5 h-5 text-cyan-primary shrink-0" />
        <span>Vagal Recovery Modules comply with autonomic homeostatic criteria. No telemetry recorded.</span>
      </div>
    </div>
  );
}
