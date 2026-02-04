"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetReadingContent } from "../hooks/useGetReadingContent";

interface ReadingModalProps {
  isOpen: boolean;
  closeModal?: () => void;
}

const MonthlyActionModal = ({ isOpen, closeModal }: ReadingModalProps) => {
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
                  <Calendar size={20} className="text-sky-500" /> Monthly Action
                </h2>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
                  Praying Through My Orbit
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
              <div className="text-xl leading-loose text-slate-300 font-serif" />
              <span className="italic text-slate-400 justify-center flex text-left">
                My sheep listen to my voice; I know them, and they follow me.
                <br></br>- John 10:27
              </span>
              <br></br>
              <p>
                A critical part of the life of a disciple to Jesus is learning
                to recognize the voice of Christ in our lives, and learning to
                obey His leading. Nearly all of us would want to be able to
                understand the will of God and how to join Jesus in the work
                He's doing in the world. We've all desired to say the right word
                or do the right thing when it is most needed, but we all know
                what it feels like to fail to recognize and respond to God's
                promptings.
              </p>
              <br></br>
              <p>
                But God is not hiding His will from us, as if it were some
                unsolvable mystery. The problem is that we go about our day
                focused only on our schedule, our problems, and our desires. So
                as those who are learning how to join God’s activity in the
                lives of those around us, we need to regularly invite Him to
                show us what He’s up to and how we can join Him.
              </p>
              <br></br>
              <p>
                So this month we are focusing on two simple actions. First, we
                are going to{" "}
                <strong>
                  pray the following prayer whenever we are around anyone:
                </strong>
              </p>
              <br></br>
              <p>
                <strong>Prayer of Invitation</strong>
              </p>
              <p>
                <em>Father, open my eyes to see</em>
              </p>
              <p>
                <em>My ears to hear</em>
              </p>
              <p>
                <em>And my hands to give</em>
              </p>
              <p>
                <em>May your will be done through me</em>
              </p>
              <p>
                <em>In Jesus’ name I pray, amen</em>
              </p>
              <br></br>
              <p>
                Before you go to work or go to lunch, before you go into a store
                or the gym, and before you walk in the door of your house, pray
                that prayer. Then spend your time in those environments and
                around the people there to{" "}
                <strong>
                  look and listen for the activity of God around you.
                </strong>{" "}
                The more we expect to hear from Him or to see Him at work, the
                more likely we are to recognize Him.
              </p>
              <br></br>
              <p>
                Second, we want to see our daily routine through a different
                lens. None of us show up at any location by accident. We all
                have agendas for why we’re there. We go to the store to shop, we
                go to the gym to exercise, we go to the office to work, and we
                go to our neighborhood to rest. Our will determines how we
                behave and how we view the people in those environments.
              </p>
              <br></br>
              <p>
                Throughout our year, we’re going to focus on the different
                spheres of our orbit, but for this month we want to begin simply
                by identifying who is in those spheres. So as you go throughout
                your month praying this prayer of invitation, start to notice
                the places you regularly go, and the people who fill those
                spaces.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MonthlyActionModal;
