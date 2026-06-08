/* eslint-disable @typescript-eslint/no-explicit-any */
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { MAVRYAN_SYSTEM_PROMPT } from "@/constants/systemPrompt";

import {
  extractMemory,
  extractMemoryWithAI,
  loadMemory,
  saveMemory,
  getMemoryValues,
  addMemoryValue,
  updateMemoryMention,
  MemoryFact,
} from "@/lib/memory";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];
    const webSearch = body.webSearch || false;

    const lastMessage =
      messages[messages.length - 1]?.content || "";

    let searchContext = "";
    let sources: { title: string; url: string; domain: string }[] = [];

    if (webSearch) {
      try {
        const tavilyRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: lastMessage,
            search_depth: "basic",
            include_answer: false
          })
        });

        const searchData = await tavilyRes.json();

        if (searchData.results) {
          searchContext = "\n\nSearch Results:\n" + searchData.results.map((r: any) =>
            `Title: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`
          ).join("\n\n");

          sources = searchData.results.map((r: any) => {
            let domain = "";
            try {
              domain = new URL(r.url).hostname.replace('www.', '');
            } catch (e) {
              domain = r.url;
            }
            return {
              title: r.title,
              url: r.url,
              domain
            };
          });
        }
      } catch (error) {
        console.error("Tavily Search Error:", error);
      }
    }

    const memory = await loadMemory();

    const aiExtraction = await extractMemoryWithAI(lastMessage);

    let newFacts: { type: MemoryFact["type"]; value: string }[] = [];

    if (aiExtraction.remember && aiExtraction.facts.length > 0) {
      newFacts = aiExtraction.facts;
    } else {
      newFacts = extractMemory(lastMessage).map((f) => ({
        type: "personal",
        value: f,
      }));
    }

    const currentValues = getMemoryValues(memory);

    const existingFacts = new Set(
      currentValues.map((fact) =>
        fact.toLowerCase()
      )
    );

    for (const factObj of newFacts) {
      const factValue = factObj.value;
      if (
        !existingFacts.has(
          factValue.toLowerCase()
        )
      ) {
        addMemoryValue(memory, factValue, factObj.type);
        existingFacts.add(
          factValue.toLowerCase()
        );
      } else {
        updateMemoryMention(memory, factValue);
      }
    }

    await saveMemory(memory);

    const updatedValues = getMemoryValues(memory);
    const memoryPrompt =
      updatedValues.length > 0
        ? `Known user facts:\n${updatedValues
            .map((fact) => `- ${fact}`)
            .join("\n")}`
        : "Known user facts:\n- None yet.";

    const formattedMessages = messages.map((msg: any, index: number) => ({
      role: msg.role,
      content: index === messages.length - 1 ? msg.content + searchContext : msg.content,
    }));

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `\n\n`,
          },
          ...formattedMessages,
        ],

        temperature: 0.9,
        max_tokens: 2000,
      });

    return NextResponse.json({
      content:
        completion.choices[0]?.message?.content ||
        "MAVRYAN could not generate a response.",
      sources: sources.length > 0 ? sources : undefined,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      content: "MAVRYAN systems encountered an error.",
    });
  }
}
