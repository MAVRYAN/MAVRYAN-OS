import { readFile, writeFile } from "fs/promises";

export type Memory = {
  facts: string[];
};

const memoryFile = "memory.json";

const defaultMemory: Memory = {
  facts: [],
};

function normalizeMemory(value: unknown): Memory {
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as Memory).facts)
  ) {
    return {
      facts: (value as Memory).facts.filter(
        (fact) => typeof fact === "string"
      ),
    };
  }

  return defaultMemory;
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
