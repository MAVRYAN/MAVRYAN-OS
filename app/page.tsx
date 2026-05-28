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
  pinned?: boolean;
};

const suggestions = [
  "Build a futuristic portfolio website",
  "Explain quantum physics simply",
  "Create a React dashboard UI",
  "Write an AI startup pitch",
];

function generateSmartTitle(text: string): string {
  let cleanText = text.trim();

  const fillers = [
    /^how do i /i, /^how to /i, /^what is /i, /^what are /i,
    /^tell me about /i, /^tell me /i, /^can you /i, /^could you /i,
    /^write a /i, /^write /i, /^create a /i, /^create /i,
    /^help me with /i, /^help me /i, /^explain /i, /^please /i,
    /^show me /i, /^give me /i, /^i need /i
  ];

  for (const filler of fillers) {
    cleanText = cleanText.replace(filler, "");
  }

  cleanText = cleanText.replace(/[?!.,;:_]+$/, "").trim();

  if (cleanText.length > 35) {
    const truncated = cleanText.substring(0, 35);
    const lastSpace = truncated.lastIndexOf(" ");
    cleanText = lastSpace > 10 ? truncated.substring(0, lastSpace) : truncated;
  }

  const title = cleanText
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return title || "New Chat";
}

export default function Home() {
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

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
    const saved =
      localStorage.getItem(
        "mavryan-conversations"
      );

    if (saved) {
      const parsed =
        JSON.parse(saved);

      setConversations(parsed);
    }

    const savedTheme =
      localStorage.getItem(
        "mavryan-theme"
      ) as "dark" | "light";

    if (savedTheme) {
      setTheme(savedTheme);
    }

    setActiveConversationId("");
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

    if (!currentConversationId) {
      currentConversationId = Date.now().toString();
      setActiveConversationId(currentConversationId);
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
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: finalMessage,
              },
            ],
            webSearch,
          }),
        }
      );

      const data =
        await response.json();

      let aiText = "";

      if (typeof data === "string") {
        aiText = data;
      } else if (data.content) {
        aiText = data.content;
      } else if (data.message) {
        aiText = data.message;
      } else {
        aiText = JSON.stringify(
          data,
          null,
          2
        );
      }

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

      const chunkSize = 16;

      for (
        let i = chunkSize;
        i <= aiText.length + chunkSize;
        i += chunkSize
      ) {
        const nextIndex = Math.min(
          i,
          aiText.length
        );

        const currentText =
          aiText.slice(0, nextIndex);

        const streamedMessage: Message = {
          role: "assistant",
          content:
            currentText +
            (nextIndex < aiText.length
              ? "▋"
              : ""),
          sources: data.sources,
        };

        if (regenerateIndex === undefined) {
          updateMessages([
            ...updatedMessages,
            streamedMessage,
          ], currentConversationId);
        } else {
          const newMsgs = [...updatedMessages];
          newMsgs[regenerateIndex] = streamedMessage;
          updateMessages(newMsgs, currentConversationId);
        }

        if (nextIndex < aiText.length) {
          await new Promise<void>(
            (resolve) => {
              requestAnimationFrame(() =>
                resolve()
              );
            }
          );
        }
      }
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
    <main className={`flex h-screen bg-[#0a0a0a] text-white overflow-hidden ${theme === "light" ? "invert hue-rotate-180" : ""}`}>
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
      />

      {/* MAIN */}

      <section className="flex-1 flex flex-col relative">
        <Header />

        {/* CHAT */}

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto"
        >
          {messages.length === 0 ? (
            <EmptyState
              suggestions={suggestions}
              sendMessage={sendMessage}
            />
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

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
          textareaRef={textareaRef}
          webSearch={webSearch}
          setWebSearch={setWebSearch}
        />
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
