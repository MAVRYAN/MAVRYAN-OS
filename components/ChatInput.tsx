"use client";

import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";

import { Send, Globe } from "lucide-react";

type ChatInputProps = {
  input: string;
  setInput: Dispatch<
    SetStateAction<string>
  >;
  sendMessage: () => void | Promise<void>;
  loading: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  webSearch: boolean;
  setWebSearch: Dispatch<SetStateAction<boolean>>;
  isChatActive: boolean;
};

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  loading,
  textareaRef,
  webSearch,
  setWebSearch,
  isChatActive,
}: ChatInputProps) {
  return (
    <div className="border-t border-white/5 p-3 md:p-5 bg-[#0a0a0a]">
      <style>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          background-size: 200% auto;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!loading) {
              sendMessage();
            }
          }}
          className="relative rounded-full p-[2px] bg-gradient-to-r from-[#ff5f6d] via-[#c471ed] to-[#5b86e5] shadow-[0_0_40px_rgba(196,113,237,0.35)] animate-gradient-xy transition-shadow duration-300 focus-within:shadow-[0_0_60px_rgba(196,113,237,0.5)]"
        >
          <div className="flex items-center gap-2 md:gap-3 bg-[#0a0a0a] rounded-full px-3 py-2 md:px-4 md:py-2.5 w-full h-full">
            <button
              type="button"
              onClick={() => setWebSearch(!webSearch)}
              className={`h-8 w-8 min-w-[32px] md:h-10 md:w-10 md:min-w-[40px] rounded-full flex items-center justify-center transition-all duration-300 ease-out border ${
                webSearch
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10 hover:text-white"
              }`}
              title="Web Search"
            >
              <Globe size={18} className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
            </button>

            <textarea
              ref={textareaRef}
              disabled={loading}
              value={input}
              onChange={(e) => {
                setInput(
                  e.target.value
                );

                e.target.style.height =
                  "auto";

                e.target.style.height =
                  e.target.scrollHeight +
                  "px";
              }}
              onKeyDown={(e) => {
                if (
                  e.key ===
                    "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (!loading) {
                    sendMessage();
                  }
                }
              }}
              rows={1}
              placeholder="Message MAVRYAN..."
              className="flex-1 bg-transparent outline-none text-[15px] resize-none max-h-[150px] md:max-h-[200px] leading-6 md:leading-7 text-zinc-300 placeholder:text-zinc-500 disabled:cursor-not-allowed overflow-y-auto py-1 md:py-1"
            />

            <div className="h-5 md:h-6 border-l border-white/10 mx-1 md:mx-2"></div>

            <button
              type="submit"
              disabled={loading}
              className="h-8 w-10 min-w-[40px] md:h-10 md:w-12 md:min-w-[48px] rounded-xl flex items-center justify-center transition-all duration-300 ease-out bg-gradient-to-r from-[#ff5f6d] via-[#c471ed] to-[#5b86e5] text-white shadow-lg shadow-purple-500/30 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 active:brightness-110 disabled:opacity-30 disabled:hover:scale-100 disabled:active:brightness-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              <Send size={18} className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </form>

        {isChatActive && (
          <p className="text-center text-[10px] md:text-xs text-white/30 mt-3 md:mt-4">
          MAVRYAN can make mistakes. Verify important information.
        </p>
        )}
      </div>
    </div>
  );
}
