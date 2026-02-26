/**
 * Centralized color mapping for UI components
 * Ensures consistency across the application
 */

export type ColorKey = "orange" | "purple" | "teal" | "blue" | "yellow";

export const colorMap: Record<
  ColorKey,
  {
    bg: string;
    border: string;
    hover: string;
  }
> = {
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

export const RingColorMap: Record<
  string,
  {
    itemColor: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  center: {
    itemColor: "bg-yellow-600",
    bgColor: "bg-yellow-600/10",
    borderColor: "border-yellow-500/50",
  },
  friends: {
    itemColor: "bg-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-500/50",
  },
  acquaintances: {
    itemColor: "bg-teal-600",
    bgColor: "bg-teal-600/10",
    borderColor: "border-teal-500/50",
  },
  strangers: {
    itemColor: "bg-purple-600",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-500/50",
  },
  places: {
    itemColor: "bg-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-500/50",
  },
};
