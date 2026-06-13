"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, ShieldAlert, Sparkles } from "lucide-react";
import { useMindVaultStore } from "../../store/useMindVaultStore";
import DashboardSidebar from "../../components/DashboardSidebar";
import Button from "../../components/ui/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useMindVaultStore((state) => state.session);
  const journalLogs = useMindVaultStore((state) => state.journalLogs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !session.isLoggedIn) {
      router.push("/auth/login");
    }
  }, [mounted, session.isLoggedIn, router]);

  // Determine dynamic ambient glowing gradients based on emotional logs
  const lastLog = journalLogs[0];
  let glowColor = "bg-purple-primary/10";
  let secondGlowColor = "bg-blue-primary/10";

  if (lastLog) {
    if (lastLog.moodScore >= 8) {
      glowColor = "bg-green-primary/10";
      secondGlowColor = "bg-cyan-primary/10";
    } else if (lastLog.moodScore <= 3) {
      glowColor = "bg-coral-primary/10";
      secondGlowColor = "bg-purple-primary/10";
    } else if (lastLog.moodName === "Tranquil") {
      glowColor = "bg-cyan-primary/10";
      secondGlowColor = "bg-green-primary/10";
    }
  }

  // Prevent flash of unauthenticated layout during mount checks
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-10 h-10 text-purple-primary animate-pulse" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Opening Sanctuary Portal...
          </span>
        </div>
      </div>
    );
  }

  if (!session.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col items-center gap-6 text-center shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-purple-primary animate-bounce" />
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold">Sanctuary Access Locked</h2>
            <p className="text-xs text-slate-400">Please establish your credentials or authorize your connection node first.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => router.push("/auth/login")} className="w-full">
            Authorize Connection Node
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex">
      {/* Dynamic Ambient Glows linked to emotional history */}
      <div className={`ambient-glow w-[500px] h-[500px] ${glowColor} top-[-10%] right-[-10%]`} />
      <div className={`ambient-glow w-[500px] h-[500px] ${secondGlowColor} bottom-[-15%] left-[-15%]`} />

      <DashboardSidebar />

      {/* Main viewport area */}
      <div className="flex-1 md:pl-64 min-h-screen flex flex-col pb-24 md:pb-0">
        <main className="flex-1 p-4 sm:p-8 relative z-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
