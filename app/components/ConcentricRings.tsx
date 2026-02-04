"use client";

import Ring from "./Ring";
import { RingData, RingType } from "../data/RingData";
import { useState } from "react";
import RingSelection from "./RingSelection";
import OrbitItem, { OrbitItemType } from "./OrbitItem";
import MockItems from "../data/MockItems";
import { useViewportMin, getSize } from "../utils/layout";

const items = MockItems;

interface ConcentricRingsProps {
  onItemClick: (item?: OrbitItemType) => void;
}

const ConcentricRings = ({ onItemClick }: ConcentricRingsProps) => {
  const [selectedRing, setSelectedRing] = useState(-1);
  const viewportMin = useViewportMin();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-0 pb-20">
      <div className="relative flex items-center justify-center pointer-events-auto">
        {RingData.map((ring, index) => (
          <Ring
            key={ring.id}
            bgColor={ring.bgColor}
            borderColor={ring.borderColor}
            z={100 - index}
            index={index}
            selectedRing={selectedRing}
          />
        ))}
      </div>

      {items.map((item) => {
        const ringConfig = RingData.find((r) => r.id === item.ring);
        if (!ringConfig) return null;

        const ringIndex = RingData.findIndex((r) => r.id === item.ring);
        const itemsInThisRing = items.filter((i) => i.ring === item.ring);
        const indexInRing = itemsInThisRing.findIndex((i) => i.id === item.id);

        const ringSize = getSize(ringIndex, selectedRing, viewportMin);
        const radius = ringSize / 2;

        const total = itemsInThisRing.length || 1;
        const angleStep = (2 * Math.PI) / total;
        const startOffset = ((ringConfig.startAngle || 0) * Math.PI) / 180;
        const angle = indexInRing * angleStep - Math.PI / 2 + startOffset;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <OrbitItem
            key={item.id}
            color={ringConfig.itemColor}
            item={item}
            onItemClick={onItemClick}
            selectedRing={selectedRing}
            x={x}
            y={y}
          />
        );
      })}
      <RingSelection onClick={setSelectedRing} openEditModal={onItemClick} />
    </div>
  );
};

export default ConcentricRings;
