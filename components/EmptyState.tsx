"use client";

type EmptyStateProps = {
  headline?: string;
};

export default function EmptyState({
  headline,
}: EmptyStateProps) {
  console.log("EMPTY_STATE_HEADLINE:", headline);
  return (
    <div className="flex flex-col items-center justify-center px-6 w-full text-center">
      <div className="opacity-0 animate-[fadeIn_0.25s_ease-out_forwards]">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white/90">
          {headline}
        </h1>
      </div>
    </div>
  );
}
