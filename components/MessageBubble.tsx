"use client";

import React from "react";

import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
} from "react";

import {
  Bot,
  Check,
  Copy,
  Pencil,
  RefreshCw,
  Trash2,
  User,
  ExternalLink,
  Maximize2,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: {
    title: string;
    url: string;
    domain: string;
  }[];
};

type MessageBubbleProps = {
  message: Message;
  index: number;
  copiedIndex: number | null;
  copyMessage: (
    text: string,
    index: number
  ) => void | Promise<void>;
  deleteMessage: (index: number) => void;
  onRegenerate?: (index: number) => void;
  onEdit?: (index: number) => void;
  onOpenArtifact?: (title: string, content: string) => void;
};

type CodeProps =
  ComponentPropsWithoutRef<"code"> & {
    inline?: boolean;
    node?: unknown;
    children?: ReactNode;
  };

const syntaxTheme =
  oneDark as {
    [key: string]: CSSProperties;
  };

const markdownComponents: Components = {
  h3({ children, ...props }) {
    const text = String(children);
    if (text.includes("🧠")) return <div className="bg-blue-500/10 border-l-[3px] border-blue-500/50 px-4 py-3 my-4 rounded-r-xl font-medium text-blue-200 text-[14px] leading-relaxed shadow-sm">{children}</div>;
    if (text.includes("⚙️")) return <div className="bg-purple-500/10 border-l-[3px] border-purple-500/50 px-4 py-3 my-4 rounded-r-xl font-medium text-purple-200 text-[14px] leading-relaxed shadow-sm">{children}</div>;
    if (text.includes("💡") || text.includes("🔧")) return <div className="text-white font-semibold text-[17px] mt-8 mb-4 border-b border-white/10 pb-2">{children}</div>;
    return <h3 className="text-white font-semibold text-lg mt-6 mb-3" {...props}>{children}</h3>;
  },
  p({ children, ...props }) {
    return <p className="mb-4 leading-relaxed text-[15px] text-white/80" {...props}>{children}</p>;
  },
  ul({ children, ...props }) {
    return <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-white/40" {...props}>{children}</ul>;
  },
  ol({ children, ...props }) {
    return <ol className="list-decimal pl-6 mb-5 space-y-2 marker:text-white/40" {...props}>{children}</ol>;
  },
  li({ children, ...props }) {
    return <li className="text-[15px] text-white/80 pl-1" {...props}>{children}</li>;
  },
  strong({ children, ...props }) {
    return <strong className="font-semibold text-white/90" {...props}>{children}</strong>;
  },
  code({
    inline,
    className,
    children,
    node: _node,
    style: _style,
    ...props
  }: CodeProps) {
    void _node;
    void _style;

    const match =
      /language-(\w+)/.exec(
        className || ""
      );

    return !inline && match ? (
      <SyntaxHighlighter
        style={syntaxTheme}
        language={match[1]}
        PreTag="div"
        className="!m-0 !bg-transparent !p-4 sm:!p-5 [&>code]:!text-[13px] sm:[&>code]:!text-[14px] [&>code]:!leading-relaxed [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent !overflow-x-auto"
        {...props}
      >
        {String(children).replace(
          /\n$/,
          ""
        )}
      </SyntaxHighlighter>
    ) : (
      <code
        className="bg-white/[0.05] border border-white/10 rounded-md px-1.5 py-0.5 text-[13px] font-mono text-white/90"
        {...props}
      >
        {children}
      </code>
    );
  },
};

function MessageBubble({
  message,
  index,
  copiedIndex,
  copyMessage,
  deleteMessage,
  onRegenerate,
  onEdit,
  onOpenArtifact,
}: MessageBubbleProps) {
  const isStreaming = message.role === "assistant" && message.content.endsWith("▋");
  const cleanContent = isStreaming ? message.content.slice(0, -1) : message.content;

  const showArtifactButton = message.role === "assistant" && cleanContent.length > 300 && !isStreaming;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group flex gap-3 md:gap-5 transition-colors duration-500 ease-out hover:bg-white/[0.02] p-3 md:p-4 -mx-3 md:-mx-4 rounded-3xl ${message.role === "user" ? "bg-white/[0.01]" : ""}`}>
      <div className="mt-1 shrink-0">
        <div
          className={`h-8 w-8 md:h-9 md:w-9 rounded-xl flex items-center justify-center shadow-sm transition-all duration-500 ${
            message.role ===
            "assistant"
              ? isStreaming
                ? "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.3)] scale-105"
                : "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              : "bg-white/10 text-white border border-white/5"
          }`}
        >
          {message.role ===
          "assistant" ? (
            <Bot size={18} className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
          ) : (
            <User size={18} className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <p className="font-medium text-[15px] text-white/90">
            {message.role ===
            "assistant"
              ? "MAVRYAN"
              : "You"}
          </p>

          <div className="opacity-100 md:opacity-0 group-hover:opacity-100 flex items-center gap-1 md:gap-2 transition-opacity duration-300">
            
            {message.role === "user" && (
              <button
                onClick={() =>
                  onEdit?.(index)
                }
                className="hover:bg-white/10 hover:text-white text-white/40 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Pencil size={15} />
              </button>
            )}

            {message.role === "assistant" && (
              <button
                onClick={() =>
                  onRegenerate?.(index)
                }
                className="hover:bg-white/10 hover:text-white text-white/40 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <RefreshCw size={15} />
              </button>
            )}

            <button
              onClick={() =>
                copyMessage(
                  message.content,
                  index
                )
              }
              className="hover:bg-white/10 hover:text-white text-white/40 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            >
              {copiedIndex ===
              index ? (
                <Check
                  size={15}
                />
              ) : (
                <Copy
                  size={15}
                />
              )}
            </button>

            <button
              onClick={() =>
                deleteMessage(
                  index
                )
              }
              className="hover:bg-red-500/20 hover:text-red-400 text-white/40 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Trash2
                size={15}
              />
            </button>
          </div>
        </div>

        <div className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:bg-[#050505] prose-pre:shadow-[0_4px_20px_rgba(0,0,0,0.2)] prose-pre:my-4 md:prose-pre:my-6 transition-opacity duration-500 break-words ${message.role === "user" ? "text-white/80" : "text-white/90"} ${isStreaming ? "opacity-90 [&>*:last-child]:after:content-['▋'] [&>*:last-child]:after:animate-pulse [&>*:last-child]:after:ml-0.5 empty:after:content-['▋'] empty:after:animate-pulse" : "opacity-100"}`}>
          <ReactMarkdown
            components={
              markdownComponents
            }
          >
            {cleanContent}
          </ReactMarkdown>
        </div>

        {showArtifactButton && (
          <div className="mt-4 flex items-center">
            <button
              onClick={() => onOpenArtifact?.("Workspace Code", cleanContent)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-[13px] font-medium text-blue-100 hover:text-white transition-all duration-200 group"
            >
              <Maximize2 size={14} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
              Open in Workspace
            </button>
          </div>
        )}

        {message.sources && message.sources.length > 0 && (
          <details className="mt-4 md:mt-6 group">
            <summary className="flex items-center gap-2 text-[13px] font-medium text-white/40 hover:text-white/80 transition-colors cursor-pointer list-none select-none w-max outline-none">
              <ExternalLink size={14} />
              <span className="group-open:hidden">View {message.sources.length} Sources</span>
              <span className="hidden group-open:inline">Hide Sources</span>
            </summary>
            <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 md:gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {message.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group w-full sm:w-auto sm:max-w-[280px]"
              >
                <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white/80 transition-colors shrink-0">
                  <ExternalLink size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/80 group-hover:text-white truncate transition-colors">
                    {source.title}
                  </p>
                  <p className="text-[11px] text-white/40 truncate">
                    {source.domain}
                  </p>
                </div>
              </a>
            ))}
          </div>
          </details>
        )}
      </div>
    </motion.div>
  );
}

function areMessageBubblePropsEqual(
  previous: MessageBubbleProps,
  next: MessageBubbleProps
) {
  const wasCopied =
    previous.copiedIndex === previous.index;

  const isCopied =
    next.copiedIndex === next.index;

  return (
    previous.message.role ===
      next.message.role &&
    previous.message.content ===
      next.message.content &&
    previous.message.sources ===
      next.message.sources &&
    previous.index === next.index &&
    wasCopied === isCopied &&
    previous.copyMessage ===
      next.copyMessage &&
    previous.deleteMessage ===
      next.deleteMessage &&
    previous.onRegenerate ===
      next.onRegenerate &&
    previous.onEdit === next.onEdit &&
    previous.onOpenArtifact === next.onOpenArtifact
  );
}

export default React.memo(
  MessageBubble,
  areMessageBubblePropsEqual
);