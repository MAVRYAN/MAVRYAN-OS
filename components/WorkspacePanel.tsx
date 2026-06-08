"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type WorkspacePanelProps = {
  activeArtifact: { title: string; content: string } | null;
  onClose: () => void;
};

export default function WorkspacePanel({ activeArtifact, onClose }: WorkspacePanelProps) {
  return (
    <AnimatePresence>
      {activeArtifact && (
        <motion.div
          initial={{ flex: 0, minWidth: 0, opacity: 0 }}
          animate={{ flex: 1, minWidth: "300px", opacity: 1 }}
          exit={{ flex: 0, minWidth: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full lg:w-1/2 bg-[#050505] flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="h-15 flex-none border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
              <h3 className="text-[15px] font-medium text-white/90 tracking-wide">{activeArtifact.title || "Workspace"}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigator.clipboard.writeText(activeArtifact.content)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-md text-xs font-medium transition-colors"
              >
                Copy Code
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-[#050505] text-[13px] text-white/80 whitespace-pre-wrap font-mono leading-relaxed select-text">
            {activeArtifact.content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
