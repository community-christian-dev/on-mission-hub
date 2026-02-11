"use client";

import { motion } from "framer-motion";
import { PiHandsPraying } from "react-icons/pi";

interface PrayerButtonProps {
  openPrayerModal: () => void;
}

const PrayerButton = ({ openPrayerModal }: PrayerButtonProps) => {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openPrayerModal}
        className="relative z-20 flex h-[42px] items-center justify-center font-bold px-4 sm:px-3 gap-3 text-md rounded-full shadow-lg transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo/500/20 hover:shadow-indigo-500/35"
      >
        <PiHandsPraying size={18} />
        <span className="hidden sm:inline">Start Prayer</span>
      </motion.button>
    </div>
  );
};

export default PrayerButton;
