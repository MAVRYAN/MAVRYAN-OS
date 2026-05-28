"use client";

import { Sparkles } from "lucide-react";

type EmptyStateProps = {
  suggestions: string[];
  sendMessage: (
    messageText: string
  ) => void | Promise<void>;
};

export default function EmptyState({
  suggestions,
  sendMessage,
}: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <div className="mb-10">
          <div className="h-14 w-14 rounded-2xl bg-white text-black flex items-center justify-center mb-6">
            <Sparkles size={28} />
          </div>

          <h1 className="text-5xl font-semibold mb-3">
            Hello.
          </h1>

          <p className="text-white/50 text-2xl">
            How can MAVRYAN help you today?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                sendMessage(item)
              }
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:bg-white/10 transition"
            >
            <p className="text-sm font-medium text-white/80">
                {item}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}