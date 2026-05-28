"use client";

import { useState, useEffect, useRef } from "react";

import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";

import {
  Plus,
  Search,
  PanelLeft,
  Pencil,
  Trash2,
  MessageSquare,
  Edit3,
  Settings,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: {
    title: string;
    url: string;
    domain: string;
  }[];
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

type SidebarProps = {
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: Dispatch<
    SetStateAction<string>
  >;
  createNewChat: () => void;
  editingConversationId: string | null;
  setEditingConversationId: Dispatch<
    SetStateAction<string | null>
  >;
  editingTitle: string;
  setEditingTitle: Dispatch<
    SetStateAction<string>
  >;
  saveRename: () => void;
  startRename: (
    conversationId: string,
    currentTitle: string
  ) => void;
  deleteConversation: (id: string) => void;
  renameInputRef: RefObject<HTMLInputElement | null>;
  onOpenSettings: () => void;
};

export default function Sidebar({
  conversations,
  activeConversationId,
  setActiveConversationId,
  createNewChat,
  editingConversationId,
  setEditingConversationId,
  editingTitle,
  setEditingTitle,
  saveRename,
  startRename,
  deleteConversation,
  renameInputRef,
  onOpenSettings,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-[280px] border-r border-white/5 bg-[#080808] flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 text-sm font-medium hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] px-3 py-2 rounded-xl transition-all duration-300 ease-out active:scale-95"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="flex items-center gap-2">
          <button className="hover:bg-white/10 p-2 rounded-lg transition-colors duration-200">
            <Pencil size={17} />
          </button>

          <button className="hover:bg-white/10 p-2 rounded-lg transition-colors duration-200">
            <PanelLeft size={17} />
          </button>
        </div>
      </div>

      {/* SEARCH */}

      <div className="px-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white/60 transition-all duration-300 hover:border-white/10 focus-within:bg-white/[0.07] focus-within:border-blue-500/40 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)] focus-within:text-white/90">
          <Search size={16} />
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Search"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/60"
          />
        </div>
      </div>

      {/* CHATS */}

      <div className="mt-6 flex-1 overflow-y-auto px-3 space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <Search size={18} className="text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/70">
              No chats found
            </p>
            <p className="text-xs text-white/40 mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group flex items-center justify-between rounded-xl px-3 py-3 cursor-pointer transition-all duration-300 ease-out ${
                activeConversationId ===
                conversation.id
                  ? "bg-white/10 border border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                  : "border border-transparent hover:bg-white/[0.04] hover:-translate-y-[1px] hover:shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
              }`}
              onClick={() =>
                setActiveConversationId(
                  conversation.id
                )
              }
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <MessageSquare
                  size={16}
                  className="min-w-[16px]"
                />

                {editingConversationId ===
                conversation.id ? (
                  <input
                    ref={renameInputRef}
                    value={editingTitle}
                    onChange={(e) =>
                      setEditingTitle(
                        e.target.value
                      )
                    }
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        saveRename();
                      }

                      if (
                        e.key ===
                        "Escape"
                      ) {
                        setEditingConversationId(
                          null
                        );
                      }
                    }}
                    onBlur={saveRename}
                    className="bg-transparent outline-none text-sm w-full"
                  />
                ) : (
                  <p className="text-sm truncate">
                    {conversation.title}
                  </p>
                )}
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    startRename(
                      conversation.id,
                      conversation.title
                    );
                  }}
                  className="hover:bg-white/20 hover:scale-110 p-1.5 rounded-lg transition-all duration-200"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteConversation(
                      conversation.id
                    );
                  }}
                  className="hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:scale-110 p-1.5 rounded-lg transition-all duration-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* USER */}

      <div
        onClick={onOpenSettings}
        className="mt-auto p-4 border-t border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
            M
          </div>

          <div>
            <p className="text-sm font-medium">
              MAVRYAN User
            </p>

            <p className="text-xs text-white/40">
              AI OS v3
            </p>
          </div>
        </div>

        <Settings
          size={16}
          className="text-white/40 group-hover:text-white/80 transition-colors"
        />
      </div>
    </aside>
  );
}
