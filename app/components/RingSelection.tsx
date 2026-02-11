"use client";

import { motion } from "framer-motion";
import { RingData } from "../data/RingData";
import AddOrbitItemButton from "./AddOrbitItemButton";

const colorMap = {
  orange: {
    bg: "bg-orange-600/10",
    border: "border-orange-500/50",
    hover: "hover:bg-orange-400/30",
  },
  purple: {
    bg: "bg-purple-600/10",
    border: "border-purple-500/50",
    hover: "hover:bg-purple-400/30",
  },
  teal: {
    bg: "bg-teal-600/10",
    border: "border-teal-500/50",
    hover: "hover:bg-teal-400/30",
  },
  blue: {
    bg: "bg-blue-600/10",
    border: "border-blue-500/50",
    hover: "hover:bg-blue-400/30",
  },
  yellow: {
    bg: "bg-yellow-600/10",
    border: "border-yellow-500/50",
    hover: "hover:bg-yellow-400/30",
  },
};

interface OrbitButtonProps {
  index: number;
  text: string;
  color: "orange" | "purple" | "teal" | "blue" | "yellow";
  onClick: (index: number) => void;
}

interface RingSelectionProps {
  onClick: (index: number) => void;
  openEditModal: () => void;
}

const OrbitButton = ({ index, text, color, onClick }: OrbitButtonProps) => {
  const { bg, border, hover } = colorMap[color];

  return (
    <div className="relative pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center ${bg} border ${border} text-slate-300 hover:text-white ${hover} px-3 h-[42px] rounded-full transition-all text-md font-bold`}
        onClick={() => onClick(index)}
      >
        {text}
      </motion.button>
    </div>
  );
};

const RingSelection = ({ onClick, openEditModal }: RingSelectionProps) => {
  return (
    <div className="absolute bottom-4 flex w-full gap-2 p-4 flex-wrap justify-center">
      {RingData.map((ring, index) => (
        <OrbitButton
          key={ring.id}
          index={index}
          text={ring.name}
          color={ring.itemColor.split("-")[1] as any}
          onClick={onClick}
        />
      ))}
      <AddOrbitItemButton onClick={() => openEditModal()} />
    </div>
  );
};

export default RingSelection;
