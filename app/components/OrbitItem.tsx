import { motion } from "framer-motion";
import { RingData } from "../data/RingData";

export type OrbitItemType = {
  id: string;
  ring: string;
  name: string;
  prayer?: string;
};

interface OrbitItemProps {
  color: string;
  item: OrbitItemType;
  onItemClick: (item: OrbitItemType) => void;
  selectedRing: number;
  x: number;
  y: number;
}

const OrbitItem = ({
  color,
  item,
  onItemClick,
  selectedRing,
  x,
  y,
}: OrbitItemProps) => {
  const xPosition = x;
  const yPosition = y;

  const ringIndex = RingData.findIndex((r) => r.id === item.ring);
  const expanded = ringIndex === selectedRing;

  return (
    <motion.div
      className="absolute flex items-center justify-center z-110 pointer-events-auto"
      initial={{ scale: 0, x: 0, y: 0 }}
      animate={{ scale: expanded ? 1 : 0.9, x: xPosition, y: yPosition }}
      transition={{
        x: { duration: 0.41, ease: "easeInOut" },
        y: { duration: 0.41, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {expanded ? (
        <div
          onClick={() => onItemClick(item)}
          className={`relative whitespace-nowrap px-2 rounded-full shadow-lg cursor-pointer ${color}
            text-white text-lg font-bold tracking-narrow border border-white/20
            transition-all duration-300 overflow-hidden flex items-center justify-center
            hover:scale-105 hover:border-white/80`}
        >
          {item.name}
        </div>
      ) : (
        <div
          onClick={() => onItemClick(item)}
          className={`w-3 h-3 rounded-full ${color} border border-white/20 shadow-sm cursor-pointer transition-transform duration-200`}
        />
      )}
    </motion.div>
  );
};

export default OrbitItem;
