"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, ShieldCheck } from "lucide-react";
import { useMindVaultStore } from "../../../store/useMindVaultStore";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

export default function Signup() {
  const router = useRouter();
  const login = useMindVaultStore((state) => state.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    setError("");

    if (password !== confirmPassword) {
      setError("Access codes do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email.includes("@")) {
        login(name, email);

        // Redirect ONLY after signup
        router.push("/dashboard");
      } else {
        setError("Invalid email format.");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6 overflow-hidden">

      {/* Drifting Background Glows */}
      <div className="ambient-glow w-[400px] h-[400px] bg-purple-primary/10 bottom-[-10%] left-[-10%] animate-[drift_25s_infinite]" />
      <div className="ambient-glow w-[400px] h-[400px] bg-cyan-primary/10 top-[-10%] right-[-10%] animate-[drift_25s_infinite_7s]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center flex flex-col items-center gap-3 mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2.5 rounded-xl bg-purple-primary/10 border border-purple-primary/30 group-hover:border-purple-primary transition-all duration-300">
              <Brain className="w-6 h-6 text-purple-primary" />
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              Mind<span className="text-purple-primary">Vault</span>
            </span>
          </Link>

          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-2">
            Establish Credentials
          </p>
        </div>

        <Card variant="glass" className="p-8">
          <form
            onSubmit={handleSignup}
            autoComplete="off"
            className="flex flex-col gap-5"
          >

            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-xl font-bold font-sans">
                Initialize Node
              </h2>
              <p className="text-xs text-slate-400">
                Generate your local-first private sanctuary credentials.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Input
                label="Full Identity Name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
                disabled={loading}
              />

              <Input
                label="Operational Email"
                type="email"
                placeholder="identity@mindvault.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
                disabled={loading}
              />

              <Input
                label="Secure Access Code (Password)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />

              <Input
                label="Confirm Access Code"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Allocating Local Storage Clusters..."
                : "Establish Sanctuary Credentials"}
            </Button>

            <div className="text-center text-xs text-slate-400 mt-2">
              Existing node operator?{" "}
              <Link
                href="/auth/login"
                className="text-purple-primary font-bold hover:underline"
              >
                Re-Authorize Node
              </Link>
            </div>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-primary" />
          <span>
            Local storage encryption operates via sandboxed client keys
          </span>
        </div>
      </motion.div>
    </div>
  );
}