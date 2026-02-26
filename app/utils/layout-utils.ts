import { useEffect, useState } from "react";

export const useViewportMin = () => {
  const [minSize, setMinSize] = useState(0);

  useEffect(() => {
    const update = () =>
      setMinSize(Math.min(window.innerWidth, window.innerHeight));
    update();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(update, 150);
    };
    
    window.addEventListener("resize", debouncedUpdate);
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeoutId);
    };
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