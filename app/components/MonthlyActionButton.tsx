"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface MonthlyActionButtonProps {
  openReadingModal: () => void;
}

const MonthlyActionButton = ({
  openReadingModal,
}: MonthlyActionButtonProps) => {
  return (
    <div className="relative z-20 pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openReadingModal}
        className="relative z-20 flex h-[42px] items-center justify-center px-4 sm:px-3 gap-3 text-md rounded-full shadow-lg transition-all bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full transition-all font-bold  backdrop-blur-sm"
      >
        <Calendar size={18} />
        <span className="hidden sm:inline">Monthly Action</span>
      </motion.button>
    </div>
  );
};

export default MonthlyActionButton;
