"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddOrbitItemButtonProps {
  onClick?: () => void;
}

const AddOrbitItemButton = ({ onClick }: AddOrbitItemButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative w-[42px] h-[42px] bg-slate-800/80 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 z-40 hover:bg-slate-700"
    >
      <Plus size={24} />
    </motion.button>
  );
};

export default AddOrbitItemButton;
