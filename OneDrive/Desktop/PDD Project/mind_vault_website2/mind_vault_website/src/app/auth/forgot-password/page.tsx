"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ShieldCheck, Mail, ShieldAlert, KeyRound } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email.includes("@")) {
        setStep(2);
      } else {
        setError("Invalid email format.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "9384") {
      setError("Incorrect OTP code. Enter the verification code 9384.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Access code must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      setStep(3);
      setLoading(false);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Drifting Background Glows */}
      <div className="ambient-glow w-[400px] h-[400px] bg-purple-primary/10 top-[-10%] right-[-10%]" />
      <div className="ambient-glow w-[400px] h-[400px] bg-cyan-primary/10 bottom-[-10%] left-[-10%]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center flex flex-col items-center gap-3 mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2.5 rounded-xl bg-purple-primary/10 border border-purple-primary/30 group-hover:border-purple-primary transition-all duration-300">
              <Brain className="w-6 h-6 text-purple-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Mind<span className="text-purple-primary">Vault</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-2">
            Access Recovery Console
          </p>
        </div>

        <Card variant="glass" className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step-1"
                onSubmit={handleRequestOtp}
                className="flex flex-col gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-1 text-center">
                  <h2 className="text-xl font-bold">Recover Access Code</h2>
                  <p className="text-xs text-slate-400">Request a verification code for security authentication.</p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                    {error}
                  </div>
                )}

                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="identity@mindvault.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />

                <Button variant="primary" type="submit" disabled={loading} className="w-full">
                  {loading ? "Verifying Registry Node..." : "Request Verification Token"}
                </Button>

                <div className="text-center text-xs text-slate-400 mt-2">
                  Remember access code?{" "}
                  <Link href="/auth/login" className="text-purple-primary font-bold hover:underline">
                    Log In
                  </Link>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step-2"
                onSubmit={handleResetPassword}
                className="flex flex-col gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-1 text-center">
                  <h2 className="text-xl font-bold">Verify Credentials</h2>
                  <p className="text-xs text-slate-400">Enter verification code and configure your new password.</p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                    {error}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-cyan-primary/5 border border-cyan-primary/20 flex gap-2 items-center text-xs text-slate-300">
                  <ShieldAlert className="w-5 h-5 text-cyan-primary shrink-0" />
                  <span>Simulated OTP packet successfully routed: Use code **9384**</span>
                </div>

                <div className="flex flex-col gap-4">
                  <Input
                    label="Verification Code (OTP)"
                    placeholder="9384"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="New Secure Access Code"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button variant="primary" type="submit" disabled={loading} className="w-full">
                  {loading ? "Re-encrypting Node Storage..." : "Update Vault Credentials"}
                </Button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                className="flex flex-col items-center gap-4 py-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1 }}
              >
                <KeyRound className="w-12 h-12 text-green-primary animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-xl font-bold">Node Updated</h2>
                  <p className="text-xs text-slate-400">Your access code has been securely reconfigured. Redirecting to login...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Security verification tag */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-primary" />
          <span>Local session recovery compliant with AES criteria</span>
        </div>
      </motion.div>
    </div>
  );
}
