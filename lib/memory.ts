import { readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import Groq from "groq-sdk";

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

export function addMemoryValue(
  memory: Memory,
  value: string,
  type: MemoryFact["type"] = "personal"
): void {
  memory.facts.push({
    id: randomUUID(),
    type,
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

export async function extractMemoryWithAI(
  userMessage: string
): Promise<{
  remember: boolean;
  facts: { type: MemoryFact["type"]; value: string }[];
}> {
  if (!userMessage || userMessage.trim().length < 5) {
    return { remember: false, facts: [] };
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a memory extraction system. Analyze the user message and extract long-term facts.
Remember: preferences, favorite things, skills, technologies used, education, career goals, ongoing projects, long-term interests, recurring personal context.
Do NOT remember: temporary requests, one-time tasks, random questions, weather, generic conversation filler.

Return ONLY a valid JSON object with this exact structure:
{
  "remember": boolean,
  "facts": [
    {
      "type": "preference" | "skill" | "technology" | "education" | "career_goal" | "project" | "personal",
      "value": "string"
    }
  ]
}

If there are no relevant facts to remember, return {"remember": false, "facts": []}.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const resultText = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(resultText);

    if (
      result &&
      typeof result.remember === "boolean" &&
      Array.isArray(result.facts)
    ) {
      return {
        remember: result.remember,
        facts: result.facts
          .map((f: Record<string, unknown>) => ({
            type: (typeof f.type === "string" ? f.type : "personal") as MemoryFact["type"],
            value: f.value && typeof f.value === "string" ? cleanFact(f.value) : "",
          }))
          .filter((f: { type: MemoryFact["type"]; value: string }) => f.value !== ""),
      };
    }

    return { remember: false, facts: [] };
  } catch (error) {
    console.error("AI Memory Extraction Error:", error);
    return { remember: false, facts: [] };
  }
}
