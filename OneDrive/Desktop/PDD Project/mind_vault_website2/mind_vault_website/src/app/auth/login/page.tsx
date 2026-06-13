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

export default function Login() {
  const router = useRouter();
  const login = useMindVaultStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email.includes("@")) {
        const generatedName = email.split("@")[0];
        const formattedName =
          generatedName.charAt(0).toUpperCase() +
          generatedName.slice(1);

        login(formattedName, email);

        // Redirect only after successful login
        router.push("/dashboard");
      } else {
        setError("Invalid credentials structure. Use a standard email.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6 overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="ambient-glow w-[400px] h-[400px] bg-purple-primary/10 top-[-10%] left-[-10%] animate-[drift_20s_infinite]" />
      <div className="ambient-glow w-[400px] h-[400px] bg-cyan-primary/10 bottom-[-10%] right-[-10%] animate-[drift_20s_infinite_5s]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo */}
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
            Secure Auth Node Initialized
          </p>
        </div>

        {/* Login Card */}
        <Card variant="glass" className="p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-xl font-bold">Welcome Back</h2>
              <p className="text-xs text-slate-400">
                Re-enter your private operational vault.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Input
                label="Operational Email"
                type="email"
                placeholder="identity@mindvault.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Access Code (Password)
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-[10px] font-mono text-cyan-primary hover:text-cyan-400 transition-colors uppercase"
                  >
                    Forgot access code?
                  </Link>
                </div>

                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Decrypting Storage Keys..."
                : "Authorize Sanctuary Access"}
            </Button>

            <div className="text-center text-xs text-slate-400 mt-2">
              New node operator?{" "}
              <Link
                href="/auth/signup"
                className="text-purple-primary font-bold hover:underline"
              >
                Establish Credentials
              </Link>
            </div>
          </form>
        </Card>

        {/* Security Tag */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-primary" />
          <span>AES-256 Client-Side Token Decryption Active</span>
        </div>
      </motion.div>
    </div>
  );
}