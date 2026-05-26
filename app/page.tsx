"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Send, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello. I am MAVRYAN.\nYour futuristic AI assistant is now online.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ MAVRYAN encountered an error.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="h-screen w-screen bg-black text-white overflow-hidden flex">

      {/* SIDEBAR */}
      <div className="w-[260px] border-r border-white/10 bg-black/40 backdrop-blur-xl p-5 flex flex-col">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-wider mb-10"
        >
          MAVRYAN
        </motion.h1>

        <button className="bg-white text-black rounded-xl py-3 font-semibold hover:scale-105 transition mb-8">
          + New Chat
        </button>

        <div className="space-y-4 text-zinc-400">
          <div className="hover:text-white transition cursor-pointer">
            ⚡ AI Assistant
          </div>

          <div className="hover:text-white transition cursor-pointer">
            💻 Coding Help
          </div>

          <div className="hover:text-white transition cursor-pointer">
            🚀 Research Agent
          </div>

          <div className="hover:text-white transition cursor-pointer">
            📄 PDF Analyzer
          </div>
        </div>

        <div className="mt-auto text-zinc-600 text-sm">
          MAVRYAN OS v1.0
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 relative overflow-hidden bg-black">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full top-[-100px] left-[30%]" />

          <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full bottom-[-100px] right-[10%]" />
        </div>

        {/* HEADER */}
        <div className="relative z-10 border-b border-white/10 px-8 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="text-white" />
            <h1 className="text-2xl font-bold tracking-wide">
              MAVRYAN AI
            </h1>
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          ref={chatRef}
          className="relative z-10 h-[calc(100vh-170px)] overflow-y-auto px-8 py-8 space-y-8"
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-3xl px-6 py-5 border backdrop-blur-xl shadow-2xl ${
                  msg.role === "user"
                    ? "bg-white text-black border-white/20"
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.role === "assistant" ? (
                    <Bot size={18} />
                  ) : (
                    <User size={18} />
                  )}

                  <span className="text-sm opacity-70">
                    {msg.role === "assistant"
                      ? "MAVRYAN"
                      : "You"}
                  </span>
                </div>

                <div className="whitespace-pre-wrap leading-8 text-[17px]">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 rounded-3xl px-6 py-5 backdrop-blur-xl">
                <div className="flex gap-2 items-center">
                  <Bot size={18} />

                  <span>MAVRYAN is thinking</span>

                  <motion.div
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                    }}
                    className="flex gap-1"
                  >
                    <div>.</div>
                    <div>.</div>
                    <div>.</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* INPUT */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl px-8 py-5">
          <div className="flex items-center gap-4">

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message MAVRYAN..."
              rows={1}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none text-white placeholder:text-zinc-500 focus:border-white/30 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={sendMessage}
              className="bg-white text-black p-4 rounded-2xl font-bold"
            >
              <Send />
            </motion.button>

          </div>
        </div>
      </div>
    </main>
  );
}