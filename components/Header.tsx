"use client";

import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="h-[60px] border-b border-white/5 flex items-center px-6">
      <div className="flex items-center gap-3">
        <Sparkles
          size={18}
          className="text-white/80"
        />

        <h1 className="font-semibold text-lg">
          MAVRYAN AI
        </h1>
      </div>
    </header>
  );
}
