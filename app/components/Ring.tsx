"use client";

import { motion } from "framer-motion";
import { useViewportMin, getSize } from "../utils/layout";

interface Props {
  bgColor: string;
  borderColor: string;
  index: number;
  selectedRing: number;
  z: number;
}

// useViewportMin and getSize are imported from app/utils/layout

const Ring = ({ bgColor, borderColor, index, selectedRing, z }: Props) => {
  const viewportMin = useViewportMin();
  const size = getSize(index, selectedRing, viewportMin);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, width: size, height: size }}
      transition={{
        scale: { duration: 0.3, ease: "easeOut" },
        width: { duration: 0.1, ease: "easeInOut" },
        height: { duration: 0.1, ease: "easeInOut" },
      }}
      className={`absolute rounded-full border-3 flex items-center justify-center
        transition-color duration-300 ease-in-out
        ${index === selectedRing ? borderColor : "border-white/20"} ${index === selectedRing ? bgColor : "bg-zinc-900"}`}
      style={{ zIndex: z }}
    />
  );
};

export default Ring;
