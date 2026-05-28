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
};

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  loading,
  textareaRef,
  webSearch,
  setWebSearch,
}: ChatInputProps) {
  return (
    <div className="border-t border-white/5 p-5">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!loading) {
              sendMessage();
            }
          }}
          className="bg-white/[0.04] border border-white/5 rounded-3xl px-5 py-3 transition-all duration-300 ease-out hover:border-white/10 focus-within:bg-white/[0.06] focus-within:border-blue-500/40 focus-within:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
        >
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => setWebSearch(!webSearch)}
              className={`h-11 w-11 min-w-[44px] rounded-2xl flex items-center justify-center transition-all duration-300 ease-out border ${
                webSearch
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-white/[0.04] text-white/40 border-transparent hover:bg-white/[0.08] hover:text-white/80"
              }`}
              title="Web Search"
            >
              <Globe size={18} />
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
              className="flex-1 bg-transparent outline-none text-[15px] resize-none max-h-[200px] leading-7 placeholder:text-white/40 disabled:cursor-not-allowed overflow-y-auto"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-11 min-w-[44px] rounded-2xl bg-white text-black flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-white/30 mt-3">
          MAVRYAN can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
