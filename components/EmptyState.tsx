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
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white text-black flex items-center justify-center mb-5 md:mb-6 shadow-sm">
            <Sparkles size={28} className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold mb-2 md:mb-3">
            Hello.
          </h1>

          <p className="text-white/50 text-xl md:text-2xl">
            How can MAVRYAN help you today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                sendMessage(item)
              }
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:bg-white/10 active:bg-white/[0.15] transition-all"
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