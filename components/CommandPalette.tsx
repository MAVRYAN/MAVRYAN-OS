"use client";

import { Plus, Palette, Globe, Settings, Trash2, Search } from "lucide-react";

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onToggleTheme: () => void;
  onToggleWebSearch: () => void;
  onOpenSettings: () => void;
  onClearChats: () => void;
  theme: "dark" | "light";
  webSearch: boolean;
};

export default function CommandPalette({
  isOpen,
  onClose,
  onNewChat,
  onToggleTheme,
  onToggleWebSearch,
  onOpenSettings,
  onClearChats,
  theme,
  webSearch,
}: CommandPaletteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
          <Search size={18} className="text-white/40 ml-1" />
          <input
            autoFocus
            placeholder="Type a command..."
            className="bg-transparent outline-none flex-1 text-[15px] placeholder:text-white/40 text-white/90"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onClose();
              }
            }}
          />
        </div>

        <div className="p-2 py-3 overflow-y-auto max-h-[400px] space-y-1">
          <div className="px-3 pb-2 text-[11px] font-medium text-white/30 uppercase tracking-wider">
            Actions
          </div>
          
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors shadow-sm">
              <Plus size={16} />
            </div>
            <span className="text-[14px] font-medium text-white/70 group-hover:text-white/90 transition-colors">New Chat</span>
          </button>

          <button
            onClick={() => { onToggleTheme(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors shadow-sm">
              <Palette size={16} />
            </div>
            <span className="text-[14px] font-medium text-white/70 group-hover:text-white/90 transition-colors flex-1">Toggle Theme</span>
            <span className="text-[11px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full capitalize">{theme}</span>
          </button>

          <button
            onClick={() => { onToggleWebSearch(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors shadow-sm">
              <Globe size={16} />
            </div>
            <span className="text-[14px] font-medium text-white/70 group-hover:text-white/90 transition-colors flex-1">Toggle Web Search</span>
            <span className="text-[11px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full capitalize">
              {webSearch ? "On" : "Off"}
            </span>
          </button>

          <button
            onClick={() => { onOpenSettings(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors shadow-sm">
              <Settings size={16} />
            </div>
            <span className="text-[14px] font-medium text-white/70 group-hover:text-white/90 transition-colors">Open Settings</span>
          </button>

          <button
            onClick={() => { onClearChats(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-colors shadow-sm">
              <Trash2 size={16} />
            </div>
            <span className="text-[14px] font-medium text-red-400/80 group-hover:text-red-400 transition-colors">Clear All Chats</span>
          </button>
        </div>
      </div>
    </div>
  );
}