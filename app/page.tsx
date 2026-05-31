"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Bot } from "lucide-react";

import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import MessageBubble from "@/components/MessageBubble";
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";
import CommandPalette from "@/components/CommandPalette";

import {
  getNextHeadline,
  getPersonalizedHeadline,
} from "@/utils/headlineGenerator";
import { generateSmartTitle } from "@/utils/smartTitle";
import type {
  Message,
  Conversation,
} from "@/types/chat";
import { extractResponseText } from "@/lib/chat/extractResponseText";
import { streamResponse } from "@/lib/chat/streamResponse";
import { sendChatRequest } from "@/lib/chat/sendChatRequest";





export default function Home() {
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mavryan-user-name") || undefined;
    }
    return undefined;
  });

  const [transientHeadline, setTransientHeadline] =
    useState<string>("");

  const [copiedIndex, setCopiedIndex] =
    useState<number | null>(null);

  const [isNearBottom, setIsNearBottom] =
    useState(true);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [activeConversationId, setActiveConversationId] =
    useState<string>("");

  const [editingConversationId, setEditingConversationId] =
    useState<string | null>(null);

  const [editingTitle, setEditingTitle] =
    useState("");

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [theme, setTheme] =
    useState<"dark" | "light">("dark");

  const [webSearch, setWebSearch] =
    useState(false);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
    useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const renameInputRef =
    useRef<HTMLInputElement>(null);

  const messagesRef =
    useRef<Message[]>([]);

  const sendMessageRef =
    useRef<((text?: string, regenerateIndex?: number) => Promise<void>) | null>(null);

  const activeConversation =
    conversations.find(
      (c) => c.id === activeConversationId
    );

  const messages =
    activeConversation?.messages || [];

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // LOAD STORAGE

  useEffect(() => {
    const savedName = localStorage.getItem("mavryan-user-name") || undefined;
    if (savedName) setUserName(savedName);

    let currentTransient = transientHeadline;
    if (!currentTransient) {
      currentTransient = getPersonalizedHeadline(savedName);
      setTransientHeadline(currentTransient);
    }

    const saved =
      localStorage.getItem(
        "mavryan-conversations"
      );

    if (saved) {
      const parsed = JSON.parse(saved) as Conversation[];
      setConversations(parsed);
      const migrated = parsed.map((c) => {
        if (!c.headline || c.headline === "Ready to build something?") {
          return { ...c, headline: getNextHeadline(currentTransient, savedName) };
        }
        return c;
      });

      setConversations(migrated);
    }

    const savedTheme =
      localStorage.getItem(
        "mavryan-theme"
      ) as "dark" | "light";

    if (savedTheme) {
      setTheme(savedTheme);
    }

  }, []);

  // SAVE STORAGE

  useEffect(() => {
    localStorage.setItem(
      "mavryan-conversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(
      "mavryan-theme",
      theme
    );
  }, [theme]);

  // AUTO FOCUS RENAME

  useEffect(() => {
    if (
      editingConversationId &&
      renameInputRef.current
    ) {
      renameInputRef.current.focus();
    }
  }, [editingConversationId]);

  // GLOBAL KEYBOARD SHORTCUTS

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // SMART SCROLL

  useEffect(() => {
    const container = chatRef.current;

    if (!container) return;

    const handleScroll = () => {
      const threshold = 150;

      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      setIsNearBottom(
        distanceFromBottom < threshold
      );
    };

    handleScroll();

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const scrollToBottom = (
    smooth = true
  ) => {
    if (
      chatRef.current &&
      isNearBottom
    ) {
      chatRef.current.scrollTo({
        top:
          chatRef.current.scrollHeight,
        behavior: smooth
          ? "smooth"
          : "auto",
      });
    }
  };

  useEffect(() => {
    if (
      !chatRef.current ||
      !isNearBottom
    ) {
      return;
    }

    const animationFrame =
      requestAnimationFrame(() => {
        chatRef.current?.scrollTo({
          top:
            chatRef.current.scrollHeight,
          behavior: "auto",
        });
      });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [messages, isNearBottom]);

  function createNewChat() {
    const newChat: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      headline: getNextHeadline(activeConversation?.headline || transientHeadline, userName),
    };

    setConversations((prev) => [
      newChat,
      ...prev,
    ]);

    setActiveConversationId(newChat.id);
  }

  function updateMessages(
    updatedMessages: Message[],
    conversationId: string = activeConversationId
  ) {
    setConversations((prev) => {
      const exists = prev.some(
        (c) => c.id === conversationId
      );

      if (!exists) {
        return [
          {
            id: conversationId,
            title:
              updatedMessages.length > 0
                ? generateSmartTitle(updatedMessages[0].content)
                : "New Chat",
            messages: updatedMessages,
              headline: transientHeadline || getNextHeadline(undefined, userName),
          },
          ...prev,
        ];
      }

      return prev.map((conversation) => {
        if (
          conversation.id ===
          conversationId
        ) {
          return {
            ...conversation,
            title:
              conversation.title ===
                "New Chat" &&
              updatedMessages.length > 0
                ? generateSmartTitle(updatedMessages[0].content)
                : conversation.title,
            messages: updatedMessages,
          };
        }

        return conversation;
      });
    });
  }

  function startRename(
    conversationId: string,
    currentTitle: string
  ) {
    setEditingConversationId(
      conversationId
    );

    setEditingTitle(currentTitle);
  }

  function saveRename() {
    if (!editingConversationId) return;

    setConversations((prev) =>
      prev.map((conversation) => {
        if (
          conversation.id ===
          editingConversationId
        ) {
          return {
            ...conversation,
            title:
              editingTitle.trim() ||
              "Untitled Chat",
          };
        }

        return conversation;
      })
    );

    setEditingConversationId(null);

    setEditingTitle("");
  }

  async function sendMessage(messageText?: string, regenerateIndex?: number) {
    const finalMessage = messageText || input;

    if (!finalMessage.trim()) return;

    let currentConversationId = activeConversationId;
    let isNewChat = false;

    if (!currentConversationId) {
      currentConversationId = Date.now().toString();
      setActiveConversationId(currentConversationId);
      isNewChat = true;
    }

    const updatedMessages = [...messagesRef.current];

    if (regenerateIndex === undefined) {
      const userMessage = {
        role: "user" as const,
        content: finalMessage,
      };

      updatedMessages.push(userMessage);

      updateMessages(
        updatedMessages,
        currentConversationId
      );

      setInput("");

      if (textareaRef.current) {
        textareaRef.current.style.height =
          "auto";
      }
      if (isNewChat) {
        setTransientHeadline(getNextHeadline(transientHeadline, userName));
      }
    } else {
      updatedMessages[regenerateIndex] = {
        role: "assistant",
        content: "▋",
      };
      updateMessages(
        updatedMessages,
        currentConversationId
      );
    }

    setLoading(true);

    setTimeout(() => {
      scrollToBottom(true);
    }, 100);

    try {
      const data =
        await sendChatRequest(
          (regenerateIndex === undefined
            ? updatedMessages
            : updatedMessages.slice(
                0,
                regenerateIndex
              )
          ).map((msg) => ({
            role: msg.role,
            content: msg.content.replace(
              "▋",
              ""
            ),
          })),
          webSearch
        );

      const aiText =
        extractResponseText(data);

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        sources: data.sources,
      };

      if (regenerateIndex === undefined) {
        updateMessages([
          ...updatedMessages,
          assistantMessage,
        ], currentConversationId);
      } else {
        const newMsgs = [...updatedMessages];
        newMsgs[regenerateIndex] = assistantMessage;
        updateMessages(newMsgs, currentConversationId);
      }

      await streamResponse(
        aiText,
        (currentText, isComplete) => {
          const streamedMessage: Message = {
            role: "assistant",
            content:
              currentText +
              (isComplete ? "" : "▋"),
            sources: data.sources,
          };

          if (regenerateIndex === undefined) {
            updateMessages([
              ...updatedMessages,
              streamedMessage,
            ], currentConversationId);
          } else {
            const newMsgs = [...updatedMessages];
            newMsgs[regenerateIndex] =
              streamedMessage;
            updateMessages(
              newMsgs,
              currentConversationId
            );
          }
        }
      );
    } catch (error) {
      updateMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "⚠️ MAVRYAN encountered a system malfunction.",
        },
      ], currentConversationId);
    }

    setLoading(false);
  }

  sendMessageRef.current = sendMessage;

  const copyMessage = useCallback(async (
    text: string,
    index: number
  ) => {
    await navigator.clipboard.writeText(
      text.replace("▋", "")
    );

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  }, []);

  const deleteMessage = useCallback(
    (index: number) => {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            conversation.id !==
            activeConversationId
          ) {
            return conversation;
          }

          const updatedMessages =
            conversation.messages.filter(
              (_, i) => i !== index
            );

          return {
            ...conversation,
            title:
              conversation.title ===
                "New Chat" &&
              updatedMessages.length > 0
                ? generateSmartTitle(updatedMessages[0].content)
                : conversation.title,
            messages: updatedMessages,
          };
        })
      );
    },
    [activeConversationId]
  );

  const handleEditMessage = useCallback(
    (index: number) => {
      const message = messagesRef.current[index];

      if (message && message.role === "user") {
        setInput(message.content);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
              textareaRef.current.scrollHeight + "px";
          }
        }, 10);
      }
    },
    []
  );

  const handleRegenerateMessage = useCallback(
    (index: number) => {
      const assistantMsg = messagesRef.current[index];
      const prevUserIndex = index - 1;
      const prevUserMsg = messagesRef.current[prevUserIndex];

      if (
        assistantMsg &&
        assistantMsg.role === "assistant" &&
        prevUserMsg &&
        prevUserMsg.role === "user"
      ) {
        sendMessageRef.current?.(prevUserMsg.content, index);
      }
    },
    []
  );

  function deleteConversation(id: string) {
    const updated =
      conversations.filter(
        (conversation) =>
          conversation.id !== id
      );

    setConversations(updated);

    if (updated.length > 0) {
      setActiveConversationId(
        updated[0].id
      );
    } else {
      createNewChat();
    }
  }

  function clearAllChats() {
    setConversations([]);
    setActiveConversationId("");
    setTransientHeadline(getNextHeadline(transientHeadline, userName));
  }

  function togglePin(id: string) {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id === id) {
          return {
            ...conversation,
            pinned: !conversation.pinned,
          };
        }
        return conversation;
      })
    );
  }

  function exportActiveChat() {
    if (!activeConversation || activeConversation.messages.length === 0) return;

    let content = `# ${activeConversation.title}\n\n`;

    activeConversation.messages.forEach((msg) => {
      const role = msg.role === "assistant" ? "MAVRYAN" : "You";
      content += `### ${role}\n${msg.content.replace("▋", "")}\n\n`;
      if (msg.sources && msg.sources.length > 0) {
        content += `**Sources:**\n`;
        msg.sources.forEach((src) => {
          content += `- ${src.title}\n`;
        });
        content += `\n`;
      }
    });

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeConversation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "chat_export"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <main className={`flex h-[100dvh] bg-[#131314] text-white overflow-hidden ${theme === "light" ? "invert hue-rotate-180" : ""}`}>
      {/* SIDEBAR */}

      <Sidebar
        conversations={conversations}
        activeConversationId={
          activeConversationId
        }
        setActiveConversationId={
          setActiveConversationId
        }
        createNewChat={createNewChat}
        editingConversationId={
          editingConversationId
        }
        setEditingConversationId={
          setEditingConversationId
        }
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        saveRename={saveRename}
        startRename={startRename}
        deleteConversation={
          deleteConversation
        }
        togglePin={togglePin}
        renameInputRef={renameInputRef}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MAIN */}

      <section className="flex-1 flex flex-col relative z-0">
        <style>{`
          @keyframes ambient-glow {
            0%, 100% { opacity: 0.20; transform: scale(1); }
            50% { opacity: 0.40; transform: scale(1.05); }
          }
          .animate-ambient-glow {
            animation: ambient-glow 18s ease-in-out infinite;
          }
        `}</style>

        {/* AMBIENT GLOW */}
        <div className="absolute top-[15vh] md:top-[25vh] left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[400px] md:h-[500px] pointer-events-none -z-10 flex justify-center">
          <div 
            className="w-full h-full blur-[100px] md:blur-[150px] rounded-full animate-ambient-glow"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(196,113,237,0.45) 0%, rgba(91,134,229,0.35) 35%, rgba(255,95,109,0.25) 70%, transparent 100%)" }}
          />
        </div>

        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* CHAT */}

        <div className={`flex-1 flex flex-col ${messages.length === 0 ? 'justify-center items-center' : ''}`}>
          <div
            ref={chatRef}
            className={`w-full ${messages.length === 0 ? 'flex-none pb-6' : 'flex-1 overflow-y-auto'}`}
          >
            {messages.length === 0 ? (
              <EmptyState headline={activeConversation?.headline || transientHeadline} />
          ) : (
            <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
                {messages.map(
                  (message, index) => (
                    <MessageBubble
                      key={index}
                      message={message}
                      index={index}
                      copiedIndex={copiedIndex}
                      copyMessage={copyMessage}
                      deleteMessage={deleteMessage}
                      onEdit={handleEditMessage}
                      onRegenerate={handleRegenerateMessage}
                    />
                  )
                )}
                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className="h-9 w-9 rounded-xl bg-white text-black flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <Bot size={18} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium mb-3">MAVRYAN</p>
                      <div className="flex items-center gap-2 h-7">
                        <span className="text-[15px] text-white/50 animate-pulse">MAVRYAN is thinking</span>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INPUT */}

          <div className={`w-full ${messages.length === 0 ? '[&>div]:!border-transparent [&>div]:!bg-transparent' : ''}`}>
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              loading={loading}
              textareaRef={textareaRef}
              webSearch={webSearch}
              setWebSearch={setWebSearch}
            />
          </div>
        </div>
      </section>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        clearAllChats={clearAllChats}
        theme={theme}
        setTheme={setTheme}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNewChat={createNewChat}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onToggleWebSearch={() => setWebSearch(!webSearch)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearChats={clearAllChats}
        onExportChat={exportActiveChat}
        theme={theme}
        webSearch={webSearch}
      />
    </main>
  );
}
