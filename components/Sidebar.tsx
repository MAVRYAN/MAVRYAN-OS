"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { Plus, Search, PanelLeft, Pencil, Trash2, Settings, MoreVertical } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url: string; domain: string; }[];
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  pinned?: boolean;
};

type SidebarProps = {
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: Dispatch<SetStateAction<string>>;
  createNewChat: () => void;
  editingConversationId: string | null;
  setEditingConversationId: Dispatch<SetStateAction<string | null>>;
  editingTitle: string;
  setEditingTitle: Dispatch<SetStateAction<string>>;
  saveRename: () => void;
  startRename: (conversationId: string, currentTitle: string) => void;
  deleteConversation: (id: string) => void;
  togglePin: (id: string) => void;
  renameInputRef: RefObject<HTMLInputElement | null>;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  activeView: "chat" | "search";
  setActiveView: Dispatch<SetStateAction<"chat" | "search">>;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  conversations, activeConversationId, setActiveConversationId, createNewChat,
  editingConversationId, setEditingConversationId, editingTitle, setEditingTitle,
  saveRename, startRename, deleteConversation, togglePin, renameInputRef,
  onOpenSettings, isCollapsed, setIsCollapsed, activeView, setActiveView,
  isOpen = false, onClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) && c.messages.length > 0
  );

  const pinnedChats = filteredConversations.filter((c) => c.pinned);
  const unpinnedChats = filteredConversations.filter((c) => !c.pinned);
  const sortedConversations = [...pinnedChats, ...unpinnedChats];

  // The custom easing curve for the "Gemini" glide effect
  const transitionPhysics = "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0a0a0a] border-r border-white/5 flex flex-col ${transitionPhysics} md:relative ${
        isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px] md:translate-x-0"
      } ${isCollapsed ? "md:w-[72px]" : "md:w-[280px]"}`}>
        
        {/* --- EXPANDED CONTENT --- */}
        <div className={`flex flex-col w-[280px] h-full ${transitionPhysics} ${isCollapsed ? "opacity-0 invisible md:pointer-events-none" : "opacity-100 visible"}`}>
          <div className="px-5 pt-6 pb-0 flex items-center justify-between">
            <div className="text-[16.5px] font-medium text-white/90 flex items-center gap-2.5 tracking-wide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse drop-shadow-[0_0_12px_rgba(91,134,229,0.5)]">
                <defs>
                  <linearGradient id="mavryan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c471ed" />
                    <stop offset="50%" stopColor="#5b86e5" />
                    <stop offset="100%" stopColor="#ff5f6d" />
                  </linearGradient>
                </defs>
                <g transform="rotate(15 12 12)">
                  <path d="M 21 3 L 21 19 L 15 13 L 11 13 L 11 9 L 5 3 Z" stroke="url(#mavryan-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 3 21 L 3 5 L 9 11 L 13 11 L 13 15 L 19 21 Z" stroke="url(#mavryan-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <g transform="translate(3.6, 3.6) scale(0.7)">
                    <path d="M 21 3 L 21 19 L 15 13 L 11 13 L 11 9 L 5 3 Z" stroke="url(#mavryan-gradient)" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 3 21 L 3 5 L 9 11 L 13 11 L 13 15 L 19 21 Z" stroke="url(#mavryan-gradient)" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              </svg>
              MAVRYAN
            </div>
            <div className="group relative hidden md:block">
              <button onClick={() => { setIsCollapsed(true); onClose?.(); }} className="hover:bg-[#202123] p-1.5 text-white/60 hover:text-white rounded-lg transition-colors">
                <PanelLeft size={16} />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-[#1a1a1c] border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-medium text-white/90 whitespace-nowrap opacity-0 -translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-[60]">
                Close sidebar
              </div>
            </div>
          </div>

          <div className="px-3 flex flex-col mt-1 gap-0.5">
            <button onClick={() => { createNewChat(); onClose?.(); }} className="flex items-center gap-2.5 w-full text-sm font-medium text-white/90 hover:bg-[#202123] px-3 py-2.5 rounded-lg transition-colors">
              <Plus size={16} /> New chat
            </button>
            <div onClick={() => { setActiveView("search"); searchInputRef.current?.focus(); }} className="flex items-center gap-2.5 w-full text-sm font-medium text-white/90 hover:bg-[#202123] px-3 py-2.5 rounded-lg transition-colors cursor-text">
              <Search size={16} className="text-white/60" />
              <input
                ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") e.currentTarget.blur(); }}
                onBlur={() => { setTimeout(() => { setSearchQuery(""); }, 200); }}
                placeholder="Search chats" className="bg-transparent outline-none flex-1 placeholder:text-white/60 text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto px-2 space-y-0.5">
            {sortedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center transition-all duration-300">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3">
                  <Search size={16} className="text-white/40" />
                </div>
                <p className="text-sm font-medium text-white/70">No chats found</p>
              </div>
            ) : (
              sortedConversations.map((conversation) => (
                <Fragment key={conversation.id}>
                  {conversation.pinned && conversation === pinnedChats[0] && <div className="px-3 pt-4 pb-1 text-[10px] font-semibold text-white/30 tracking-widest">PINNED</div>}
                  {!conversation.pinned && conversation === unpinnedChats[0] && <div className="px-3 pt-4 pb-1 text-[10px] font-semibold text-white/30 tracking-widest">RECENT</div>}
                  <div className={`group flex items-center justify-between rounded-full px-3 py-2.5 cursor-pointer transition-colors duration-300 ease-out ${activeConversationId === conversation.id ? "bg-white/10 text-white font-medium" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`} onClick={() => { setActiveConversationId(conversation.id); onClose?.(); }}>
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      {editingConversationId === conversation.id ? (
                        <input
                          ref={renameInputRef} value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setEditingConversationId(null); }}
                          onBlur={saveRename} className="bg-transparent outline-none text-sm w-full"
                        />
                      ) : (
                        <p className="text-sm truncate">{conversation.title}</p>
                      )}
                    </div>
                    <div className="relative opacity-100 md:opacity-0 group-hover:opacity-100 transition">
                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === conversation.id ? null : conversation.id); }} className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white/80 transition">
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === conversation.id && (
                        <div ref={menuRef} className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-[#0a0a0a] border border-white/5 shadow-2xl z-50 overflow-hidden">
                          <button onClick={(e) => { e.stopPropagation(); togglePin(conversation.id); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-white/5 text-sm">{conversation.pinned ? "📌 Unpin" : "📌 Pin"}</button>
                          <button onClick={(e) => { e.stopPropagation(); startRename(conversation.id, conversation.title); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-white/5 text-sm">✏️ Rename</button>
                          <button onClick={(e) => { e.stopPropagation(); deleteConversation(conversation.id); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 text-sm">🗑️ Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </Fragment>
              ))
            )}
          </div>

          <div onClick={() => { onOpenSettings(); onClose?.(); }} className="mt-auto px-4 py-3 border-t border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 text-[10px] font-medium rounded-full bg-white/10 flex items-center justify-center">M</div>
              <div>
                <p className="text-sm font-medium">MAVRYAN User</p>
                <p className="text-[10px] text-white/40">AI OS v3</p>
              </div>
            </div>
            <Settings size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
          </div>
        </div>

        {/* --- COLLAPSED CONTENT (DESKTOP ONLY) --- */}
        <div className={`absolute top-0 left-0 h-full w-[72px] flex flex-col justify-between items-center py-4 hidden md:flex ${transitionPhysics} ${isCollapsed ? "opacity-100 visible delay-150" : "opacity-0 invisible pointer-events-none"}`}>
          <div className="flex flex-col items-center gap-3">
            <button onClick={() => setIsCollapsed(false)} className="group relative hover:bg-white/5 p-2 rounded-xl transition-all active:scale-95">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(91,134,229,0.5)]">
                <defs>
                  <linearGradient id="mavryan-gradient-col" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c471ed" />
                    <stop offset="50%" stopColor="#5b86e5" />
                    <stop offset="100%" stopColor="#ff5f6d" />
                  </linearGradient>
                </defs>
                <g transform="rotate(15 12 12)">
                  <path d="M 21 3 L 21 19 L 15 13 L 11 13 L 11 9 L 5 3 Z" stroke="url(#mavryan-gradient-col)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 3 21 L 3 5 L 9 11 L 13 11 L 13 15 L 19 21 Z" stroke="url(#mavryan-gradient-col)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <g transform="translate(3.6, 3.6) scale(0.7)">
                    <path d="M 21 3 L 21 19 L 15 13 L 11 13 L 11 9 L 5 3 Z" stroke="url(#mavryan-gradient-col)" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 3 21 L 3 5 L 9 11 L 13 11 L 13 15 L 19 21 Z" stroke="url(#mavryan-gradient-col)" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              </svg>
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1a1a1c] border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-medium text-white/90 whitespace-nowrap opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">Expand</div>
          </button>
            <div className="group relative">
              <button onClick={() => { createNewChat(); setIsCollapsed(false); }} className="hover:bg-white/10 p-2 rounded-xl transition text-white/60 hover:text-white"><Plus size={16} /></button>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1a1a1c] border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-medium text-white/90 whitespace-nowrap opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">New Chat</div>
            </div>
            <div className="group relative">
              <button onClick={() => { setActiveView("search"); setIsCollapsed(false); }} className="hover:bg-white/10 p-2 rounded-xl transition text-white/60 hover:text-white"><Search size={16} /></button>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1a1a1c] border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-medium text-white/90 whitespace-nowrap opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">Search Chats</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="group relative">
              <button onClick={onOpenSettings} className="hover:bg-white/10 p-2 rounded-xl transition text-white/60 hover:text-white"><Settings size={16} /></button>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1a1a1c] border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-medium text-white/90 whitespace-nowrap opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">Settings</div>
            </div>
            <div className="group relative">
              <div className="h-7 w-7 text-[10px] font-medium rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors text-white/90">M</div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1a1a1c] border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-medium text-white/90 whitespace-nowrap opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">Profile</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
