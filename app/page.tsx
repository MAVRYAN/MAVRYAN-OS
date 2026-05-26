"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { vscDarkPlus }
from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Trash2,
  Paperclip,
} from "lucide-react";

import Particles
from "react-tsparticles";

import { loadFull }
from "tsparticles";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function Home() {

  const [chats, setChats] =
    useState<Chat[]>([]);

  const [currentChatId,
    setCurrentChatId] =
    useState<number | null>(null);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [uploadedText,
    setUploadedText] =
    useState("");

  const [uploadedFileName,
    setUploadedFileName] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  // PARTICLES
  const particlesInit =
    async (engine: any) => {

      await loadFull(engine);
    };

  // LOAD CHATS
  useEffect(() => {

    const savedChats =
      localStorage.getItem(
        "mavryan-chats"
      );

    if (savedChats) {

      const parsed =
        JSON.parse(savedChats);

      setChats(parsed);

      if (parsed.length > 0) {

        setCurrentChatId(
          parsed[0].id
        );
      }

    } else {

      createNewChat();
    }

  }, []);

  // SAVE CHATS
  useEffect(() => {

    localStorage.setItem(
      "mavryan-chats",
      JSON.stringify(chats)
    );

  }, [chats]);

  // AUTO SCROLL
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chats, loading]);

  function createNewChat() {

    const newChat: Chat = {

      id: Date.now(),

      title: "New Chat",

      messages: [
        {
          role: "assistant",

          content:
            "# Hello 👋\nI am **MAVRYAN**, your futuristic AI assistant.",
        },
      ],
    };

    setChats((prev) => [
      newChat,
      ...prev,
    ]);

    setCurrentChatId(
      newChat.id
    );

    setUploadedText("");
    setUploadedFileName("");
  }

  function deleteChat(
    chatId: number
  ) {

    const updatedChats =
      chats.filter(
        (chat) =>
          chat.id !== chatId
      );

    setChats(updatedChats);

    if (
      currentChatId === chatId
    ) {

      if (
        updatedChats.length > 0
      ) {

        setCurrentChatId(
          updatedChats[0].id
        );

      } else {

        createNewChat();
      }
    }
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      setUploadedText(
        data.text
      );

      setUploadedFileName(
        file.name
      );

    } catch (error) {

      console.error(error);
    }
  }

  const currentChat =
    chats.find(
      (chat) =>
        chat.id ===
        currentChatId
    );

  async function sendMessage() {

    if (
      !input.trim() ||
      !currentChat
    ) return;

    const userMessage: Message = {

      role: "user",

      content:
        uploadedText
          ? `File Content:\n${uploadedText}\n\nUser Question:\n${input}`
          : input,
    };

    const updatedMessages = [
      ...currentChat.messages,
      userMessage,
    ];

    const updatedChats =
      chats.map((chat) =>
        chat.id ===
        currentChatId
          ? {
              ...chat,

              messages:
                updatedMessages,

              title:
                chat.title ===
                "New Chat"
                  ? input.slice(
                      0,
                      20
                    )
                  : chat.title,
            }
          : chat
      );

    setChats(updatedChats);

    setInput("");
    setLoading(true);

    try {

      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              messages:
                updatedMessages,
            }),
          }
        );

      const reader =
        response.body?.getReader();

      if (!reader) return;

      let assistantText = "";

      while (true) {

        const {
          done,
          value,
        } = await reader.read();

        if (done) break;

        const chunk =
          new TextDecoder()
            .decode(value);

        assistantText += chunk;

        setChats(
          (prevChats) =>
            prevChats.map(
              (chat) =>
                chat.id ===
                currentChatId
                  ? {
                      ...chat,

                      messages: [
                        ...updatedMessages,

                        {
                          role:
                            "assistant",

                          content:
                            assistantText,
                        },
                      ],
                    }
                  : chat
            )
        );
      }

    } catch (error) {

      console.error(error);
    }

    setLoading(false);
  }

  return (

    <main className="flex h-screen bg-black text-white overflow-hidden relative">

      {/* PARTICLES */}
      <Particles
        id="tsparticles"
        init={particlesInit}

        options={{

          fullScreen: {
            enable: false,
          },

          background: {
            color: {
              value: "#000000",
            },
          },

          fpsLimit: 120,

          particles: {

            color: {
              value: "#ffffff",
            },

            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.08,
              width: 1,
            },

            move: {
              direction: "none",
              enable: true,

              outModes: {
                default: "bounce",
              },

              random: false,
              speed: 1,
              straight: false,
            },

            number: {
              density: {
                enable: true,
              },

              value: 55,
            },

            opacity: {
              value: 0.08,
            },

            shape: {
              type: "circle",
            },

            size: {
              value: {
                min: 1,
                max: 3,
              },
            },
          },

          detectRetina: true,
        }}

        className="absolute inset-0 z-0"
      />

      {/* GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],

          opacity: [
            0.12,
            0.25,
            0.12,
          ],
        }}

        transition={{
          duration: 8,
          repeat: Infinity,
        }}

        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
      />

      {/* SIDEBAR */}
      <div className="w-72 border-r border-zinc-800 bg-zinc-950/60 backdrop-blur-2xl p-5 flex flex-col z-10">

        <motion.h1
          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="text-4xl font-black tracking-widest mb-8"
        >
          MAVRYAN
        </motion.h1>

        <motion.button

          whileHover={{
            scale: 1.03,
          }}

          whileTap={{
            scale: 0.96,
          }}

          onClick={
            createNewChat
          }

          className="bg-white text-black rounded-2xl py-3 px-4 font-bold shadow-2xl"
        >
          + New Chat
        </motion.button>

        {/* CHAT LIST */}
        <div className="mt-8 space-y-3 overflow-y-auto">

          {chats.map((chat) => (

            <motion.div

              whileHover={{
                scale: 1.02,
              }}

              key={chat.id}

              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition border ${
                currentChatId ===
                chat.id
                  ? "bg-white text-black border-white"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800"
              }`}
            >

              <div
                className="flex-1 truncate"

                onClick={() =>
                  setCurrentChatId(
                    chat.id
                  )
                }
              >
                {chat.title}
              </div>

              <button
                onClick={() =>
                  deleteChat(
                    chat.id
                  )
                }

                className="opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2
                  size={16}
                />
              </button>

            </motion.div>

          ))}

        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col relative z-10">

        {/* HEADER */}
        <div className="border-b border-zinc-800 bg-black/30 backdrop-blur-2xl p-5 text-xl font-bold">
          MAVRYAN AI
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          <AnimatePresence>

            {currentChat?.messages.map(
              (
                message,
                index
              ) => (

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
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`rounded-3xl px-6 py-5 max-w-3xl shadow-2xl ${
                      message.role ===
                      "user"
                        ? "bg-white text-black"
                        : "bg-zinc-900/60 border border-zinc-800 backdrop-blur-2xl"
                    }`}
                  >

                    <ReactMarkdown
                      components={{
                        code(props) {

                          const {
                            children,
                          } = props;

                          return (

                            <SyntaxHighlighter
                              style={
                                vscDarkPlus
                              }

                              language="javascript"

                              PreTag="div"
                            >
                              {String(
                                children
                              ).replace(
                                /\n$/,
                                ""
                              )}
                            </SyntaxHighlighter>

                          );
                        },
                      }}
                    >
                      {
                        message.content
                      }
                    </ReactMarkdown>

                  </div>

                </motion.div>
              )
            )}

          </AnimatePresence>

          {/* LOADING */}
          {loading && (

            <div className="flex justify-start">

              <div className="bg-zinc-900/60 border border-zinc-800 px-6 py-4 rounded-3xl flex items-center gap-2 backdrop-blur-xl">

                <motion.div
                  animate={{
                    y: [
                      0,
                      -5,
                      0,
                    ],
                  }}

                  transition={{
                    repeat:
                      Infinity,

                    duration:
                      0.6,
                  }}

                  className="w-2 h-2 bg-white rounded-full"
                />

                <motion.div
                  animate={{
                    y: [
                      0,
                      -5,
                      0,
                    ],
                  }}

                  transition={{
                    repeat:
                      Infinity,

                    duration:
                      0.6,

                    delay: 0.2,
                  }}

                  className="w-2 h-2 bg-white rounded-full"
                />

                <motion.div
                  animate={{
                    y: [
                      0,
                      -5,
                      0,
                    ],
                  }}

                  transition={{
                    repeat:
                      Infinity,

                    duration:
                      0.6,

                    delay: 0.4,
                  }}

                  className="w-2 h-2 bg-white rounded-full"
                />

              </div>

            </div>

          )}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}
        <div className="border-t border-zinc-800 bg-black/40 backdrop-blur-2xl p-5">

          <div className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 shadow-2xl">

            {/* UPLOAD */}
            <label className="mr-4 cursor-pointer text-zinc-400 hover:text-white transition">

              <Paperclip />

              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={
                  handleFileUpload
                }
              />

            </label>

            <input
              type="text"

              placeholder=
                "Message MAVRYAN..."

              value={input}

              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }

              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  sendMessage();
                }
              }}

              className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500 text-lg"
            />

            <motion.button

              whileHover={{
                scale: 1.05,
              }}

              whileTap={{
                scale: 0.95,
              }}

              onClick={
                sendMessage
              }

              className="ml-4 bg-white text-black px-5 py-2 rounded-xl font-bold"
            >
              Send
            </motion.button>

          </div>

          {/* FILE NAME */}
          {uploadedFileName && (

            <div className="mt-3 text-sm text-zinc-400">

              Uploaded:

              <span className="text-white ml-2">
                {uploadedFileName}
              </span>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}