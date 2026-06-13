"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Download,
  Upload,
  Eye,
  EyeOff,
  User,
  Brain,
  AlertCircle,
  CheckCircle,
  LogOut
} from "lucide-react";
import { useMindVaultStore } from "../../../store/useMindVaultStore";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

export default function SettingsPage() {
  const router = useRouter();

  const session = useMindVaultStore((state) => state.session);
  const login = useMindVaultStore((state) => state.login);
  const logout = useMindVaultStore((state) => state.logout);

  const geminiApiKey = useMindVaultStore((state) => state.geminiApiKey);
  const setGeminiApiKey = useMindVaultStore((state) => state.setGeminiApiKey);

  const [profileName, setProfileName] = useState(session.name);
  const [profileEmail, setProfileEmail] = useState(session.email);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiSaveSuccess, setApiSaveSuccess] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) return;

    login(profileName, profileEmail);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput);
    setApiSaveSuccess(true);
    setTimeout(() => setApiSaveSuccess(false), 3000);
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    logout();

    // extra cleanup
    localStorage.removeItem("mind-vault-storage");

    router.push("/auth/login");
  };

  const handleExportBackup = () => {
    try {
      const backupData = localStorage.getItem("mind-vault-storage");
      if (!backupData) return;

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(backupData);

      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `mindvault_backup_${new Date()
          .toISOString()
          .split("T")[0]}.json`
      );

      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error("Backup compilation error:", e);
    }
  };

  const handleImportBackup = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    setImportSuccess(false);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(
          event.target?.result as string
        );

        if (parsed.state) {
          localStorage.setItem(
            "mind-vault-storage",
            JSON.stringify(parsed)
          );

          setImportSuccess(true);

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setImportError(
            "Invalid backup package. State node not detected."
          );
        }
      } catch {
        setImportError(
          "Failed to parse backup package. Verify file structure."
        );
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-8 pb-12 relative">
      <div className="ambient-glow w-[500px] h-[500px] bg-purple-primary/5 top-[-10%] right-[-10%] z-0" />
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan-primary/5 bottom-[-15%] left-[-15%] z-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Profile & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Configure API credentials and manage encrypted storage.
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Rest of your existing cards remain unchanged */}

      <div className="relative z-10 mt-6 p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center gap-3 text-xs text-slate-500 font-mono">
        <ShieldCheck className="w-5 h-5 text-cyan-primary shrink-0" />
        <span>
          Data custodian protocols comply with strict sandboxed
          criteria.
        </span>
      </div>
    </div>
  );
}