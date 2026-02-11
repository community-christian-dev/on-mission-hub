"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, BookOpen, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetReadingContent } from "../hooks/useGetReadingContent";

interface ReadingModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ReadingModal = ({ isOpen, closeModal }: ReadingModalProps) => {
  const queryClient = useQueryClient();
  const cacheKey = ["reading", "111", "JHN.5"];
  const cached = queryClient.getQueryData(cacheKey) as any | undefined;

  const { data, isLoading, isError, error } = useGetReadingContent(
    "111",
    "JHN.4",
    {
      queryKey: cacheKey,
      enabled: !cached,
      initialData: cached,
    },
  );

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
                  Today's Reading
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
              <div className="prose prose-invert max-w-none h-full flex flex-col mb-6">
                <h3 className="text-3xl font-serif text-zinc-100 mb-1">
                  {data?.reference ?? (isLoading ? "Loading…" : "Reference")}
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
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              ) : (
                <div className="text-xl leading-loose text-slate-300 font-serif whitespace-pre-line">
                  No content available
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReadingModal;
