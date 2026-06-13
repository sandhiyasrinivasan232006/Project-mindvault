"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";

export default function Terms() {
  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      <Navbar />
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 flex-grow flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Terms of Sanctuary & Vault Service</h1>
        <p className="text-slate-400 text-sm font-light">Last updated: May 22, 2026</p>
        
        <Card variant="glass" className="p-8 flex flex-col gap-6 font-light text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">1. Client Autonomy & Liability</h3>
            <p>
              MindVault AI provides client-side cognitive wellness tracking, local NLP sentiment summaries, and vagus nerve breathing modules. Because the system stores your data entirely in your browser's memory, you are solely responsible for exporting your records before clearing your browser cookies or cache. MindVault AI does not maintain server backups of your local vaults.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">2. Not a Medical Alternative</h3>
            <p>
              MindVault and its local AI companion, Aura, are designed strictly for habit-building, emotional intelligence tracking, and stress recovery. MindVault AI is not a licensed medical provider and does not provide clinical psychiatric diagnosis, counseling, or therapeutic crisis intervention.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">3. Subscription Tiers</h3>
            <p>
              Subscribing to the AI Recovery Elite tier gives you permission to integrate external API keys and unlock direct network-connected modules. You agree to utilize these API gateways within reasonable usage standards and accept all Google Cloud platform billing if you integrate your own key.
            </p>
          </div>
        </Card>
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono relative z-10 bg-[#070a11]/40 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MindVault AI Corporation. Terms authenticated.
      </footer>
    </div>
  );
}
