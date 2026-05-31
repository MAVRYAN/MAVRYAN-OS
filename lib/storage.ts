import type { Conversation } from "@/types/chat";

export function getUserName() {
  return localStorage.getItem(
    "mavryan-user-name"
  ) || undefined;
}

export function getConversations():
  Conversation[] {
  const saved =
    localStorage.getItem(
      "mavryan-conversations"
    );

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveConversations(
  conversations: Conversation[]
) {
  localStorage.setItem(
    "mavryan-conversations",
    JSON.stringify(conversations)
  );
}

export function getTheme():
  "dark" | "light" | null {
  return localStorage.getItem(
    "mavryan-theme"
  ) as "dark" | "light" | null;
}

export function saveTheme(
  theme: "dark" | "light"
) {
  localStorage.setItem(
    "mavryan-theme",
    theme
  );
}
