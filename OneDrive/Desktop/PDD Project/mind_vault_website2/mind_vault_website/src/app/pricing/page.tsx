"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Pricing() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const tiers = [
    {
      name: "Sovereign Sanctuary",
      price: 0,
      description: "Local-first private emotional node. Fully secure in your own browser.",
      features: [
        "100% Secure Local Storage Caching",
        "Local Empathetic AI Companion",
        "5 Themed Personal Vaults",
        "Guided Breathing Circle (vagus support)",
        "Dopamine Focus Session modules",
        "Mock OTP & JWT session simulation"
      ],
      cta: "Initialize Free Node",
      popular: false,
      variant: "glass" as const
    },
    {
      name: "AI Recovery Elite",
      price: annualBilling ? 7 : 9,
      description: "Direct cognitive expansion, Gemini API gateway integration, and cross-sync.",
      features: [
        "Everything in Sovereign Sanctuary",
        "Unlimited Gemini Live LLM integrations",
        "Detailed Vagal Stress Analytics",
        "Automatic audio/visual vault summaries",
        "Premium Sleep Recovery audio streams",
        "Real-Time Multi-Device Mobile Sync"
      ],
      cta: "Activate Elite Access",
      popular: true,
      variant: "neon-purple" as const
    },
    {
      name: "Corporate Resilience",
      price: 29,
      description: "Mental recovery frameworks and compliance grids for full teams.",
      features: [
        "Everything in AI Recovery Elite",
        "SSO/SAML Vault authorization keys",
        "Aggregated, private team burnout reports",
        "Custom binaural soundtrack packages",
        "Dedicated corporate wellness nodes",
        "SLA standard uptime support"
      ],
      cta: "Establish Fleet Node",
      popular: false,
      variant: "glass" as const
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/5 top-[-10%] left-[-10%]" />
      <div className="ambient-glow w-[500px] h-[500px] bg-green-primary/5 bottom-[10%] right-[-10%]" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex-grow flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Sanctuary Access Tiers
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Empower your mental health with transparent, highly optimized options.
          </p>

          {/* Billing Cycle Switch */}
          <div className="flex items-center gap-3 mt-4 bg-white/[0.03] border border-white/8 backdrop-blur-md p-1.5 rounded-xl">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                !annualBilling ? "bg-purple-primary text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                annualBilling ? "bg-purple-primary text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Annual
              <span className="text-[9px] bg-green-primary/20 text-green-primary font-mono px-1.5 py-0.5 rounded border border-green-primary/30">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 items-stretch">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex"
            >
              <Card
                variant={tier.variant}
                className={`p-8 w-full flex flex-col justify-between gap-8 relative ${
                  tier.popular ? "border-purple-primary/40 shadow-[0_0_30px_rgba(123,97,255,0.1)]" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-primary/20 border border-purple-primary/30 text-[9px] font-bold text-purple-primary uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> Best Value
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold">$</span>
                    <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">{tier.price}</span>
                    <span className="text-slate-500 text-sm font-light">/month</span>
                  </div>

                  <hr className="border-white/5" />

                  <ul className="flex flex-col gap-3.5">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-cyan-primary shrink-0 mt-0.5" />
                        <span className="font-light">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/auth/signup">
                  <Button
                    variant={tier.popular ? "primary" : "outline"}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Cost Optimization Notice */}
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 mt-4 items-center">
          <AlertCircle className="w-5 h-5 text-cyan-primary shrink-0" />
          <p className="text-xs text-slate-500 font-light">
            **Free-by-Design Architecture:** MindVault leverages local edge NLP computation so that standard users incur **0 server database fees**. That is why our Sovereign plan is free forever, with no hidden subscription traps.
          </p>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono relative z-10 bg-[#070a11]/40 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MindVault AI Corporation. Secure offline processing validated.
      </footer>
    </div>
  );
}
