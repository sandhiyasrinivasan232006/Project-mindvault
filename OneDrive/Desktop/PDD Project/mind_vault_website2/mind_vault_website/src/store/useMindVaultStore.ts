import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  emotion?: string;
}

export interface JournalLog {
  id: string;
  date: string;
  moodScore: number; // 1 to 10
  moodName: string; // "Calm", "Anxious", "Inspired", "Exhausted", etc.
  stress: number;   // 1 to 10
  energy: number;   // 1 to 10
  focus: number;    // 1 to 10
  journalText: string;
  tags: string[];
  aiAnalysis?: {
    burnoutLevel: "Low" | "Moderate" | "High";
    primaryEmotion: string;
    advice: string;
  };
}

export interface VaultItem {
  id: string;
  vaultType: "peace" | "motivation" | "healing" | "gratitude" | "dream";
  title: string;
  content: string;
  tags: string[];
  mediaUrl?: string;
  audioUrl?: string;
  date: string;
  summary?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatarUrl: string;
  streakDays: number;
  lastActiveDate?: string;
  completedBreathingMinutes: number;
}

interface MindVaultState {
  // Session
  session: UserSession;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateStreak: () => void;
  addBreathingTime: (minutes: number) => void;

  // Mood Journaling
  journalLogs: JournalLog[];
  addJournalLog: (log: Omit<JournalLog, "id" | "date">) => void;
  deleteJournalLog: (id: string) => void;

  // Vault
  vaultItems: VaultItem[];
  addVaultItem: (item: Omit<VaultItem, "id" | "date">) => void;
  deleteVaultItem: (id: string) => void;

  // AI Companion Chat
  chatMessages: Message[];
  addChatMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  clearChat: () => void;

  // API Configuration (Optional Gemini Connection)
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  
  // Custom companion settings
  companionSettings: {
    name: string;
    voiceEnabled: boolean;
    personality: "empathetic" | "stoic" | "analytical" | "zen";
  };
  updateCompanionSettings: (settings: Partial<MindVaultState["companionSettings"]>) => void;
}

export const useMindVaultStore = create<MindVaultState>()(
  persist(
    (set, get) => ({
      // Session initial state
      session: {
        isLoggedIn: false,
        name: "",
        email: "",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        streakDays: 0,
        lastActiveDate: undefined,
        completedBreathingMinutes: 0,
      },

      login: (name, email) => set((state) => {
        const today = new Date().toDateString();
        const prevActive = state.session.lastActiveDate;
        let newStreak = state.session.streakDays;

        if (prevActive) {
          const prevDate = new Date(prevActive);
          const diffTime = Math.abs(new Date(today).getTime() - prevDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        return {
          session: {
            ...state.session,
            isLoggedIn: true,
            name,
            email,
            streakDays: newStreak,
            lastActiveDate: today,
          }
        };
      }),

      logout: () => set({
        session: {
          isLoggedIn: false,
          name: "",
          email: "",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
          streakDays: 0,
          lastActiveDate: undefined,
          completedBreathingMinutes: 0,
        },
        chatMessages: [],
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const lastActive = state.session.lastActiveDate;
        let streak = state.session.streakDays;

        if (lastActive !== today) {
          if (lastActive) {
            const lastDate = new Date(lastActive);
            const diff = Math.ceil(Math.abs(new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
              streak += 1;
            } else if (diff > 1) {
              streak = 1;
            }
          } else {
            streak = 1;
          }
        }

        return {
          session: {
            ...state.session,
            streakDays: streak,
            lastActiveDate: today
          }
        };
      }),

      addBreathingTime: (minutes) => set((state) => ({
        session: {
          ...state.session,
          completedBreathingMinutes: state.session.completedBreathingMinutes + minutes
        }
      })),

      // Mood Journaling Actions
      journalLogs: [],
      addJournalLog: (log) => set((state) => {
        const newLog: JournalLog = {
          ...log,
          id: Math.random().toString(36).substring(2, 15),
          date: new Date().toISOString(),
        };
        return {
          journalLogs: [newLog, ...state.journalLogs],
        };
      }),
      deleteJournalLog: (id) => set((state) => ({
        journalLogs: state.journalLogs.filter((log) => log.id !== id),
      })),

      // Vault Actions
      vaultItems: [],
      addVaultItem: (item) => set((state) => {
        const newItem: VaultItem = {
          ...item,
          id: Math.random().toString(36).substring(2, 15),
          date: new Date().toISOString(),
        };
        return {
          vaultItems: [newItem, ...state.vaultItems],
        };
      }),
      deleteVaultItem: (id) => set((state) => ({
        vaultItems: state.vaultItems.filter((item) => item.id !== id),
      })),

      // AI Chat Actions
      chatMessages: [],
      addChatMessage: (msg) => set((state) => {
        const newMsg: Message = {
          ...msg,
          id: Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          chatMessages: [...state.chatMessages, newMsg],
        };
      }),
      clearChat: () => set({ chatMessages: [] }),

      // API Action
      geminiApiKey: "",
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),

      // Companion Preferences
      companionSettings: {
        name: "Aura",
        voiceEnabled: false,
        personality: "empathetic",
      },
      updateCompanionSettings: (settings) => set((state) => ({
        companionSettings: {
          ...state.companionSettings,
          ...settings,
        }
      })),
    }),
    {
      name: "mind-vault-storage", // local storage key
    }
  )
);
