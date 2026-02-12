"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Calendar } from "lucide-react";
import { useMonthlyActions } from "../hooks/useMonthlyActions";
import { getCurrentNYDate } from "../utils/dateUtils";

interface MonthlyActionModalProps {
  isOpen: boolean;
  closeModal?: () => void;
}

const MonthlyActionModal = ({
  isOpen,
  closeModal,
}: MonthlyActionModalProps) => {
  const [currentMonthKey, setCurrentMonthKey] = useState<string>("");
  const [action, setAction] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // Fetch all monthly actions
  const { data: monthlyActions = [], isLoading } = useMonthlyActions();

  // Find current active action based on release date
  useEffect(() => {
    if (monthlyActions.length > 0) {
      const updateActiveAction = () => {
        const today = getCurrentNYDate();

        // Find all actions released on or before today
        const activeActions = monthlyActions.filter((a) => {
          const releaseDate = new Date(a.releaseDate);
          return releaseDate <= today;
        });

        // Sort by release date descending (newest first)
        activeActions.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );

        const currentAction = activeActions[0];

        if (currentAction) {
          setAction({
            title: currentAction.title,
            content: currentAction.content,
          });
          setCurrentMonthKey(currentAction.id);
        } else {
          setAction(null);
          setCurrentMonthKey("");
        }
      };

      updateActiveAction();

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "dateOverride") {
          updateActiveAction();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [monthlyActions, isOpen]);

  const getMonthName = () => {
    const today = getCurrentNYDate();
    return today.toLocaleDateString("en-US", {
      month: "long",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/50">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar size={20} className="text-sky-500" /> Monthly Action
                </h2>
                <p className="text-sm font-mono text-zinc-400 uppercase tracking-wider mt-1">
                  {action?.title}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="text-zinc-400 hover:text-white"
                  onClick={closeModal}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              {isLoading ? (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="animate-spin" /> Loading…
                </div>
              ) : !action ? (
                <div className="text-center py-12">
                  <p className="text-zinc-400 text-lg">
                    No monthly action scheduled for {getMonthName()}
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. Added 'formatted-content' class here to target styles 
                     2. Kept 'prose prose-invert' for basic typography, but our styles below will override the specifics
                  */}
                  <div
                    className="custom-html-content text-xl leading-loose text-slate-300 font-serif prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: action.content }}
                  />
                </>
              )}
            </div>

            {/* --- DISPLAY STYLES --- 
                These match the Editor styles exactly. 
            */}
            <style>{`
        /* 1. BLOCKQUOTES - Force Purple Border & Indent */
        .custom-html-content blockquote {
            border-left-color: #6a4cb3ff !important; /* Purple */
            border-left-width: 4px !important;
            color: #a1a1aa !important; /* Zinc 400 */
            font-style: italic !important;
            
            /* Background & Spacing */
            background: rgba(255,255,255,0.05) !important;
            padding: 1rem 1.5rem !important;
            margin: 1.5rem 0 !important;
            border-radius: 0 8px 8px 0 !important;
        }

        /* 2. HEADINGS - Make them pop */
        .custom-html-content h2 {
            color: #f4f4f5 !important; /* Zinc 100 */
            font-weight: 700 !important;
            font-size: 1.5em !important;
            margin-top: 1.5em !important;
            margin-bottom: 0.75em !important;
            border-bottom: 1px solid rgba(255,255,255,0.1); /* Subtle divider */
            padding-bottom: 0.25em;
        }

        /* 3. LISTS - Fix bullet visibility */
        .custom-html-content ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
        }
        .custom-html-content ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
        }
        .custom-html-content li {
            margin-bottom: 0.5rem !important;
            padding-left: 0.5rem !important;
        }
        
        /* 4. Fix Prose specific colors */
        .custom-html-content strong {
            color: white !important;
        }
      `}</style>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MonthlyActionModal;