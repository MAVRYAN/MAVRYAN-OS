export type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: {
    title: string;
    url: string;
    domain: string;
  }[];
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  pinned?: boolean;
  headline?: string;
};
