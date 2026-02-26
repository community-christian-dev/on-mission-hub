"use client";
import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, BookOpen, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { useGetReadingContent } from "../hooks/useGetReadingContent";
import { useReadings } from "../hooks/useReadings";
import {
  getCurrentNYDate,
  formatDateKey,
  parseLocalDate,
} from "../utils/dateUtils";

interface ReadingModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ReadingModal = ({ isOpen, closeModal }: ReadingModalProps) => {
  const [todayKey, setTodayKey] = useState<string>("");
  const [reference, setReference] = useState<string | null>(null);

  // Fetch all readings
  const { data: readings = [] } = useReadings();

  // Update today's key when modal opens or date override changes
  useEffect(() => {
    if (isOpen) {
      const updateTodayKey = () => {
        const today = getCurrentNYDate();
        const key = formatDateKey(today);
        setTodayKey(key);
      };

      updateTodayKey();

      // Listen for storage changes (date override updates)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "dateOverride") {
          updateTodayKey();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [isOpen]);

  // Find today's reading
  useEffect(() => {
    if (todayKey && readings.length > 0) {
      const todayReading = readings.find((r) => r.id === todayKey);
      setReference(todayReading?.reference || null);
    }
  }, [todayKey, readings]);

  // Fetch content from YouVersion API
  const { data, isLoading, isError, error } = useGetReadingContent(
    "111", // NIV version
    reference || "",
    {
      queryKey: ["reading", "111", reference || ""],
      enabled: !!reference && isOpen,
    },
  );
  // Sanitize HTML content with DOMPurify
  const sanitizedContent = useMemo(() => {
    if (!data?.content) return '"';
    try {
      return DOMPurify.sanitize(data.content, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "b",
          "i",
          "em",
          "strong",
          "span",
          "div",
          "sup",
        ],
        ALLOWED_ATTR: ["class"],
      });
    } catch (e) {
      console.error("Error sanitizing content:", e);
      return "";
    }
  }, [data?.content]);
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
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/50">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-sky-500" /> Daily
                  Scripture Reading
                </h2>
                <p className="text-sm text-zinc-400 font-mono uppercase tracking-wider mt-1">
                  {todayKey
                    ? parseLocalDate(todayKey).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Today's Reading"}
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
              {!reference ? (
                <div className="text-center py-12">
                  <p className="text-zinc-400 text-lg">
                    No reading scheduled for today
                  </p>
                </div>
              ) : (
                <>
                  <div className="prose prose-invert max-w-none h-full flex flex-col mb-6">
                    <h3 className="text-3xl font-serif text-zinc-100 mb-1">
                      {data?.reference ?? (isLoading ? "Loading…" : reference)}
                    </h3>
                    <p className="text-medium text-zinc-500 font-mono tracking-widest">
                      NIV
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="animate-spin" /> Loading…
                    </div>
                  ) : isError ? (
                    <div className="text-red-400">
                      Error: {(error as Error)?.message || "Failed to load."}
                    </div>
                  ) : data?.content ? (
                    <div
                      className="text-xl leading-loose text-slate-300 font-serif"
                      dangerouslySetInnerHTML={{
                        __html: sanitizedContent,
                      }}
                    />
                  ) : (
                    <div className="text-xl leading-loose text-slate-300 font-serif whitespace-pre-line">
                      No content available
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReadingModal;
