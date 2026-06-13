"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, LayoutDashboard, MessageSquare, Shield, Compass, Settings, LogOut, Flame, Sparkles } from "lucide-react";
import { useMindVaultStore } from "../store/useMindVaultStore";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useMindVaultStore((state) => state.session);
  const logout = useMindVaultStore((state) => state.logout);
  const journalLogs = useMindVaultStore((state) => state.journalLogs);

  // Extract the current mood theme color based on their last journal log
  const lastLog = journalLogs[0];
  let accentClass = "text-purple-primary";
  let borderClass = "border-purple-primary/20";
  let glowClass = "rgba(123, 97, 255, 0.15)";
  
  if (lastLog) {
    if (lastLog.moodScore >= 8) {
      accentClass = "text-green-primary";
      borderClass = "border-green-primary/20";
      glowClass = "rgba(67, 233, 123, 0.15)";
    } else if (lastLog.moodScore <= 3) {
      accentClass = "text-coral-primary";
      borderClass = "border-coral-primary/20";
      glowClass = "rgba(255, 117, 140, 0.15)";
    } else if (lastLog.moodName === "Tranquil") {
      accentClass = "text-cyan-primary";
      borderClass = "border-cyan-primary/20";
      glowClass = "rgba(0, 201, 255, 0.15)";
    }
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "AI Companion", href: "/dashboard/companion", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Vaults", href: "/dashboard/vault", icon: <Shield className="w-5 h-5" /> },
    { name: "Recovery", href: "/dashboard/recovery", icon: <Compass className="w-5 h-5" /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> }
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-screen fixed left-0 top-0 p-6 bg-slate-950/40 backdrop-blur-xl border-r border-white/5 z-30">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-slate-900/50 border ${borderClass} transition-all duration-300 shadow-[0_0_15px_${glowClass}]`}>
              <Brain className={`w-5 h-5 ${accentClass}`} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Mind<span className={accentClass}>Vault</span>
            </span>
          </Link>

          {/* Streak Counter */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Daily Streak</span>
            </div>
            <span className="text-sm font-bold text-white font-mono">{session.streakDays} Days</span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "text-white bg-white/[0.04] border border-white/5 shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.01]"
                  }`}
                >
                  <span className={`${isActive ? accentClass : "text-slate-400 group-hover:text-white"}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveGlow"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-primary to-cyan-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="flex flex-col gap-4">
          <hr className="border-white/5" />
          <div className="flex items-center gap-3">
            <img
              src={session.avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white leading-none">{session.name || "Operator"}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 truncate">{session.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/5 bg-slate-900/20 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 hover:border-red-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Log Out Node
          </button>
        </div>
      </aside>

      {/* MOBILE FLOATING DOCK */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 px-6 py-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/8 shadow-2xl flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-xl transition-all ${
                isActive
                  ? `${accentClass} bg-white/5 border border-white/5 scale-110 shadow-lg`
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </nav>
    </>
  );
}
