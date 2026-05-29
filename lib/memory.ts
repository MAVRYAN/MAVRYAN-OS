import { readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

export type MemoryFact = {
  id: string;
  type: "preference" | "skill" | "technology" | "education" | "career_goal" | "project" | "personal";
  value: string;
  createdAt: number;
  lastMentionedAt: number;
};

export type Memory = {
  facts: MemoryFact[];
};

const memoryFile = "memory.json";

const defaultMemory: Memory = {
  facts: [],
};

function normalizeMemory(value: unknown): Memory {
  if (
    value &&
    typeof value === "object" &&
    "facts" in value
  ) {
    const rawFacts = (value as Record<string, unknown>).facts;
    if (Array.isArray(rawFacts)) {
      const now = Date.now();
      const facts: MemoryFact[] = [];
      for (const fact of rawFacts) {
        if (typeof fact === "string") {
          facts.push({
            id: randomUUID(),
            type: "personal",
            value: fact,
            createdAt: now,
            lastMentionedAt: now,
          });
        } else if (fact && typeof fact === "object" && "value" in fact) {
          const f = fact as Record<string, unknown>;
          facts.push({
            id: typeof f.id === "string" ? f.id : randomUUID(),
            type: typeof f.type === "string" ? (f.type as MemoryFact["type"]) : "personal",
            value: String(f.value),
            createdAt: typeof f.createdAt === "number" ? f.createdAt : now,
            lastMentionedAt: typeof f.lastMentionedAt === "number" ? f.lastMentionedAt : now,
          });
        }
      }
      return { facts };
    }
  }

  return defaultMemory;
}

export function getMemoryValues(memory: Memory): string[] {
  return memory.facts.map((fact) => fact.value);
}

export function addMemoryValue(memory: Memory, value: string): void {
  memory.facts.push({
    id: randomUUID(),
    type: "personal",
    value,
    createdAt: Date.now(),
    lastMentionedAt: Date.now(),
  });
}

export function updateMemoryMention(memory: Memory, value: string): void {
  const fact = memory.facts.find(
    (f) => f.value.toLowerCase() === value.toLowerCase()
  );
  if (fact) {
    fact.lastMentionedAt = Date.now();
  }
}

function cleanFact(value: string) {
  return value
    .trim()
    .replace(/[.!?]+$/, "")
    .trim();
}

export async function loadMemory(): Promise<Memory> {
  try {
    const file = await readFile(
      memoryFile,
      "utf8"
    );

    return normalizeMemory(
      JSON.parse(file)
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return defaultMemory;
    }

    throw error;
  }
}

export async function saveMemory(
  memory: Memory
) {
  await writeFile(
    memoryFile,
    `${JSON.stringify(
      normalizeMemory(memory),
      null,
      2
    )}\n`,
    "utf8"
  );
}

export function extractMemory(
  userMessage: string
): string[] {
  const patterns = [
    /\bmy name is\s+(.+)/i,
    /\bi like\s+(.+)/i,
    /\bi love\s+(.+)/i,
    /\bi am working on\s+(.+)/i,
  ];

  return patterns
    .map((pattern) => {
      const match =
        userMessage.match(pattern);

      return match
        ? cleanFact(match[0])
        : "";
    })
    .filter(Boolean);
}
