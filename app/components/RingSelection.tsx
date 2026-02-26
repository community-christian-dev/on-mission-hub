"use client";

import { motion } from "framer-motion";
import { RingData } from "../data/RingData";
import AddOrbitItemButton from "./AddOrbitItemButton";
import { colorMap, type ColorKey } from "../constants/colors";

interface OrbitButtonProps {
  index: number;
  text: string;
  color: ColorKey;
  onClick: (index: number) => void;
}

interface RingSelectionProps {
  onClick: (index: number) => void;
  openEditModal: () => void;
}

type ColorKey = keyof typeof colorMap;

const OrbitButton = ({ index, text, color, onClick }: OrbitButtonProps) => {
  const colorConfig = colorMap[color];

  return (
    <div className="relative pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center ${colorConfig.bg} border ${colorConfig.border} text-slate-300 hover:text-white ${colorConfig.hover} px-3 h-[42px] rounded-full transition-all text-md font-bold`}
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
          color={ring.itemColor.split("-")[1] as ColorKey}
          onClick={onClick}
        />
      ))}
      <AddOrbitItemButton onClick={() => openEditModal()} />
    </div>
  );
};

export default RingSelection;
