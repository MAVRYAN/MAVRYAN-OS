"use client";

import { X, Trash2, Zap, Palette, Cpu } from "lucide-react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clearAllChats: () => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  clearAllChats,
  theme,
  setTheme,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/5">
          <h2 className="text-[15px] font-medium text-white/90">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white hover:bg-white/10 active:scale-95 p-1.5 rounded-lg transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 md:p-5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-3 px-1">
              Data & Memory
            </h3>
            <button
              onClick={() => {
                clearAllChats();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] border border-transparent hover:border-white/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </div>
                <span className="text-[14px] font-medium">Clear All Chats</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] border border-transparent hover:border-white/5 transition-all text-left group">
              <div className="flex items-center gap-3 text-white/70 group-hover:text-white/90 transition-colors">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <Cpu size={16} />
                </div>
                <span className="text-[14px] font-medium">Clear Memory</span>
              </div>
              <span className="text-[11px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
                Placeholder
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-3 px-1">
              Preferences
            </h3>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] border border-transparent hover:border-white/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3 text-white/70 group-hover:text-white/90 transition-colors">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <Palette size={16} />
                </div>
                <span className="text-[14px] font-medium">Theme</span>
              </div>
              <span className="text-[11px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full capitalize">
                {theme}
              </span>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] border border-transparent hover:border-white/5 transition-all text-left group">
              <div className="flex items-center gap-3 text-white/70 group-hover:text-white/90 transition-colors">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <Zap size={16} />
                </div>
                <span className="text-[14px] font-medium">Response Speed</span>
              </div>
              <span className="text-[11px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
                Placeholder
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-white/30">MAVRYAN AI OS v3.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}