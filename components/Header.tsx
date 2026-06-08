"use client";

type HeaderProps = {
  onOpenSidebar?: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps = {}) {
  return (
    <header className="h-[60px] border-b border-transparent flex items-center px-4 md:px-6">
      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="flex items-center gap-2.5 group hover:bg-white/5 p-2 -ml-2 rounded-xl transition-all active:scale-95 md:hidden cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(91,134,229,0.5)]">
            <defs>
              <linearGradient id="mavryan-gradient-header" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c471ed" />
                <stop offset="50%" stopColor="#5b86e5" />
                <stop offset="100%" stopColor="#ff5f6d" />
              </linearGradient>
            </defs>
            <g transform="rotate(15 12 12)">
              <path d="M 21 3 L 21 19 L 15 13 L 11 13 L 11 9 L 5 3 Z" stroke="url(#mavryan-gradient-header)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 3 21 L 3 5 L 9 11 L 13 11 L 13 15 L 19 21 Z" stroke="url(#mavryan-gradient-header)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(3.6, 3.6) scale(0.7)">
                <path d="M 21 3 L 21 19 L 15 13 L 11 13 L 11 9 L 5 3 Z" stroke="url(#mavryan-gradient-header)" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 3 21 L 3 5 L 9 11 L 13 11 L 13 15 L 19 21 Z" stroke="url(#mavryan-gradient-header)" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          </svg>
          <span className="text-[16.5px] font-medium text-white/90 tracking-wide group-hover:text-white transition-colors">
            MAVRYAN
          </span>
        </button>
      )}
    </header>
  );
}
