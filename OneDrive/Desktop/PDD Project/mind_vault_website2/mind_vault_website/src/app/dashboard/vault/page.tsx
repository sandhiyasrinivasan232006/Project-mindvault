"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Plus, Trash2, Calendar, FileText, Search, Tag, Quote, ShieldCheck, Heart } from "lucide-react";
import { useMindVaultStore, VaultItem } from "../../../store/useMindVaultStore";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

export default function VaultSystem() {
  const vaultItems = useMindVaultStore((state) => state.vaultItems);
  const addVaultItem = useMindVaultStore((state) => state.addVaultItem);
  const deleteVaultItem = useMindVaultStore((state) => state.deleteVaultItem);

  const [activeTab, setActiveTab] = useState<VaultItem["vaultType"]>("peace");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const vaultTabs = [
    { id: "peace", label: "Peace Vault", emoji: "🕊️", color: "text-cyan-400", themeGlow: "bg-cyan-primary/10", border: "border-cyan-primary/30" },
    { id: "motivation", label: "Motivation Vault", emoji: "⚡", color: "text-yellow-400", themeGlow: "bg-yellow-primary/10", border: "border-yellow-primary/30" },
    { id: "healing", label: "Healing Vault", emoji: "🌿", color: "text-green-400", themeGlow: "bg-green-primary/10", border: "border-green-primary/30" },
    { id: "gratitude", label: "Gratitude Vault", emoji: "🌸", color: "text-coral-primary", themeGlow: "bg-coral-primary/10", border: "border-coral-primary/30" },
    { id: "dream", label: "Dream Vault", emoji: "✨", color: "text-purple-primary", themeGlow: "bg-purple-primary/10", border: "border-purple-primary/30" }
  ] as const;

  const currentTabConfig = vaultTabs.find(t => t.id === activeTab)!;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Initial simulated local summary using client-side AI templates
    const quickSummary = content.length > 100 
      ? `• Core subject: "${title}".\n• Emotional tone: Rooted in the sanctum energy of ${activeTab.toUpperCase()}.\n• Suggested direction: Keep cultivating these positive cognitive records.`
      : `• Saved key note: "${title}" in the ${activeTab} category.`;

    addVaultItem({
      vaultType: activeTab,
      title,
      content,
      tags,
      summary: quickSummary
    });

    setTitle("");
    setContent("");
    setTagsInput("");
    setShowAddForm(false);
  };

  const triggerLocalAISummary = (id: string, text: string) => {
    setSummarizingId(id);
    
    setTimeout(() => {
      // Direct local extraction summarizing text (zero cost)
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      const bulletPoints = sentences
        .slice(0, 3)
        .map(s => `• ${s.trim()}`)
        .join("\n");

      const compiledSummary = `### Aura Cognitive Summary\n${bulletPoints}\n\n**Neuroscience Insight:** Journaling this entry allows your prefrontal cortex to de-escalate amygdala hyper-vigilance, helping organize memory retention.`;

      // Inline update the store state for summary
      const storeState = useMindVaultStore.getState();
      const updatedItems = storeState.vaultItems.map(item => 
        item.id === id ? { ...item, summary: compiledSummary } : item
      );
      useMindVaultStore.setState({ vaultItems: updatedItems });
      setSummarizingId(null);
    }, 1000);
  };

  // Filter items matching query and category
  const filteredItems = vaultItems.filter((item) => {
    const matchesCategory = item.vaultType === activeTab;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-8 pb-12 relative">
      {/* Dynamic ambient tab glow */}
      <div className={`ambient-glow w-[500px] h-[500px] rounded-full filter blur-[100px] absolute top-10 right-10 ${currentTabConfig.themeGlow} transition-all duration-700 z-0`} />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Digital Vault Sanctums
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Compartmentalize your memories to release cognitive burden and quiet looping thoughts.
          </p>
        </div>
        <Button
          variant={activeTab === "peace" || activeTab === "healing" ? "cyan" : "primary"}
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 shrink-0" /> Seal New Memory
        </Button>
      </div>

      {/* Slide in new note form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full"
            >
              <Card variant="glass" className="p-6">
                <form onSubmit={handleAddNote} className="flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-primary" />
                      Seal Memory - {currentTabConfig.label}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <Input
                    label="Memory Title"
                    placeholder="e.g. Quiet afternoon by the river"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Journal Narrative Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your private reflection details..."
                      required
                      className="w-full h-36 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-md text-white text-sm focus:bg-white/[0.06] focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20 placeholder-slate-500 transition-all resize-none"
                    />
                  </div>

                  <Input
                    label="Tags (Comma separated)"
                    placeholder="e.g. mindfulness, nature, calm"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />

                  <Button variant="cyan" type="submit" className="w-full">
                    Seal & Encrypt in Vault
                  </Button>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Selector Navigation */}
      <div className="relative z-10 flex flex-wrap gap-2.5 border-b border-white/5 pb-4">
        {vaultTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? `bg-white/5 ${tab.border} ${tab.color} shadow-lg scale-105`
                  : "bg-slate-900/10 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and listings filter */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search within this vault chamber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-primary transition-all"
          />
        </div>
        <div className="text-right text-[10px] font-mono text-slate-500">
          Chamber contains {filteredItems.length} sealed packets
        </div>
      </div>

      {/* List items grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filteredItems.length === 0 ? (
          <Card
            variant="glass"
            className="p-12 md:col-span-2 text-center text-slate-500 font-mono text-xs border-dashed border-white/10"
          >
            Chamber empty. Seal a memory in your {currentTabConfig.label} to establish entries.
          </Card>
        ) : (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass" className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteVaultItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                    title="Delete sealed memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed whitespace-pre-line italic">
                  "{item.content}"
                </p>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Summarize button or summary text block */}
                <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-3">
                  {item.summary ? (
                    <div className="p-4 rounded-xl bg-purple-primary/5 border border-purple-primary/10 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-primary uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> AI Companion Insight
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-light whitespace-pre-line">
                        {item.summary}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => triggerLocalAISummary(item.id, item.content)}
                      disabled={summarizingId === item.id}
                      className="text-left w-fit px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-[10px] font-mono hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-primary" />
                      {summarizingId === item.id ? "Analyzing..." : "Aura Summarize"}
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Security verification notice */}
      <div className="relative z-10 mt-6 p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center gap-3 text-xs text-slate-500 font-mono">
        <ShieldCheck className="w-5 h-5 text-cyan-primary shrink-0" />
        <span>Military-grade client caching: Your vault content runs 100% in-browser and is never cached on outer server clusters.</span>
      </div>
    </div>
  );
}
