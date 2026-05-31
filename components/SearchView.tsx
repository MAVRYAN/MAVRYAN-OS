"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

type Conversation = {
  id: string;
  title: string;
};

type SearchViewProps = {
  conversations: Conversation[];
  setActiveConversationId: (id: string) => void;
  setActiveView: (
    view: "chat" | "search"
  ) => void;
};

export default function SearchView({
  conversations,
  setActiveConversationId,
  setActiveView,
}: SearchViewProps) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredChats =
    conversations.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-6">

        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />

          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            placeholder="Search chats"
            className="w-full bg-[#1f2023] border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-white/20 focus:bg-[#232427] transition-all"
          />

          {searchQuery && (
            <button
              onClick={() =>
                setSearchQuery("")
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {filteredChats.length === 0 ? (
          <p className="text-white/40 px-2">
            No chats found
          </p>
        ) : (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveConversationId(chat.id);
                  setActiveView("chat");
                }}
                className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 cursor-pointer transition-all duration-200 border border-transparent hover:border-white/5"
              >
                <span className="truncate">
                  {chat.title}
                </span>

                <span className="text-xs text-white/30 ml-4">
                  Chat
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
