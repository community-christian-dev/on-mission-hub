import React from "react";

interface PrayerPromptProps {
  name: string;
  ring: string;
  prayer: string;
}

const colorMap: { [key: string]: string } = {
  center: "bg-yellow-500",
  friends: "bg-blue-500",
  acquaintances: "bg-teal-500",
  strangers: "bg-purple-500",
  places: "bg-orange-500",
};

const PrayerPrompt = ({ name, ring, prayer }: PrayerPromptProps) => {
  return (
    // 1. Changed Fragment <> to a <div> to give Framer a solid bounding box to measure
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-8">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg ${
            colorMap[ring] || "bg-slate-500"
          }`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-xs font-mono uppercase text-slate-400">
            {ring === "center" ? "My One" : ring}
          </p>
        </div>
      </div>

      {/* 2. Keeps the margin to ensure text doesn't overlap the absolute 'Next' button */}
      <div className="mb-10 relative pl-6 border-l-4 border-indigo-500">
        <p className="text-lg text-slate-200 italic leading-relaxed">
          "{prayer || "No prayer provided."}"
        </p>
      </div>
    </div>
  );
};

export default PrayerPrompt;
