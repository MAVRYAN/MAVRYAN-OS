import { NextResponse } from "next/server";

import { loadMemory } from "@/lib/memory";

export const dynamic = "force-dynamic";

export async function GET() {
  const memory = await loadMemory();

  return NextResponse.json({
    facts: memory.facts,
  });
}
