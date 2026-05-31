"use client";

import { Menu } from "lucide-react";

type HeaderProps = {
  onOpenSidebar?: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps = {}) {
  return (
    <header className="h-[60px] border-b border-white/5 flex items-center px-4 md:px-6 gap-3">
      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>
      )}
      <div />
    </header>
  );
}
