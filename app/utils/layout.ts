import { useEffect, useState } from "react";

export const useViewportMin = () => {
  const [minSize, setMinSize] = useState(0);

  useEffect(() => {
    const update = () =>
      setMinSize(Math.min(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return minSize;
};

export const getSize = (
  index: number,
  selectedRing: number,
  viewportMin: number,
) => {
  if (!viewportMin) return 0;

  const spacing = 0.75 * viewportMin * 0.17;
  const baseSize = (index + 1) * spacing;
  const expandedSize = 0.75 * viewportMin - 5 * spacing;

  if (selectedRing === -1 || index < selectedRing) return baseSize;
  else return baseSize + expandedSize;
};

export default {
  useViewportMin,
  getSize,
};