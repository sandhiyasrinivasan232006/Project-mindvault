"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";

export default function Privacy() {
  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      <Navbar />
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 flex-grow flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Shield & Data Custody</h1>
        <p className="text-slate-400 text-sm font-light">Last updated: May 22, 2026</p>
        
        <Card variant="glass" className="p-8 flex flex-col gap-6 font-light text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">1. The Principle of Local Sovereignty</h3>
            <p>
              MindVault AI operates under a Zero-Knowledge architectural framework. Standard accounts do not stream, cache, or maintain your emotional diaries, companion conversation histories, or recovery profiles on central cloud systems. All personal information rests exclusively in the local client database (Zustand store synced to browser localStorage/IndexedDB).
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">2. Optional API Custom Extensions</h3>
            <p>
              If you explicitly configure a personal Gemini API Gateway Key inside your Settings dashboard, chat prompts are transmitted securely directly to the Google Generative Language endpoints. MindVault servers do not intercept, index, or store these API request payloads.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">3. Mobile Synchronization</h3>
            <p>
              Sync data shared between the MindVault Mobile app and the Web client is fully compressed and client-side encrypted before network transit. No telemetry metadata is ever shared with third-party advertising partners.
            </p>
          </div>
        </Card>
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono relative z-10 bg-[#070a11]/40 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MindVault AI Corporation. Privacy authenticated.
      </footer>
    </div>
  );
}
