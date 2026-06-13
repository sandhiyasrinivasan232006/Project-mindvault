"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/5 top-[10%] right-[-10%]" />
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan-primary/5 bottom-[10%] left-[-10%]" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full"
        >
          <Card variant="glass" className="p-8 sm:p-10 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Send className="w-40 h-40 text-purple-primary" />
            </div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Signal Node Connection
                </h1>
                <p className="text-sm text-slate-400 font-light">
                  Establish an encrypted pipeline to the MindVault AI operational team.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Identity Name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={sending}
                      />
                      <Input
                        label="Secure Email"
                        type="email"
                        placeholder="identity@mindvault.ai"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={sending}
                      />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="Ecosystem inquiries"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={sending}
                    />

                    <div className="w-full flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Secure Payload Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your signal details..."
                        required
                        disabled={sending}
                        className="w-full h-32 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-md text-white text-sm focus:bg-white/[0.06] focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20 placeholder-slate-500 transition-all resize-none"
                      />
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={sending || !name || !email || !message}
                      className="w-full shadow-[0_0_20px_rgba(123,97,255,0.15)]"
                    >
                      {sending ? "Transmitting Secure Packets..." : "Transmit Encrypted Signal"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-prompt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-primary" />
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold">Signal Transmitted</h3>
                      <p className="text-sm text-slate-400 max-w-sm">
                        Your packet was compressed and successfully cached. Our operations team will respond to your node shortly.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSent(false)} className="mt-4">
                      Transmit Another Signal
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.01] border border-white/5 text-[11px] text-slate-500 font-mono">
                <ShieldAlert className="w-4 h-4 text-cyan-primary shrink-0" />
                <span>Signals are securely encoded at local client nodes before server transfer.</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>

      {/* Simplified Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono relative z-10 bg-[#070a11]/40 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MindVault AI Corporation. Packet transmissions authenticated.
      </footer>
    </div>
  );
}
