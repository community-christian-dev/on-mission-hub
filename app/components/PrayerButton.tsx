"use client";

import React from "react";
import { motion } from "framer-motion";
import { PiHandsPraying } from "react-icons/pi";
import { usePrayerPrompts } from "../hooks/usePrayerPrompts";

interface PrayerButtonProps {
  openPrayerModal: () => void;
}

const PrayerButton = ({ openPrayerModal }: PrayerButtonProps) => {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openPrayerModal}
        className="relative z-20 flex h-[42px] items-center justify-center font-bold px-4 sm:px-3 gap-3 text-md rounded-full shadow-lg transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo/500/20 hover:shadow-indigo-500/35"
      >
        <PiHandsPraying size={18} />
        <span className="hidden sm:inline">Start Prayer</span>
      </motion.button>
    </div>
  );
};

// const PrayerButton = () => {
//   const [open, setOpen] = React.useState(false);
//   const [topic, setTopic] = React.useState("");
//   const mutation = usePrayerPrompts();

//   const handleClick = async () => {
//     setOpen(true);
//     mutation.mutate({ topic: topic || "gratitude", tone: "gentle", count: 3 });
//   };

//   return (
//     <div className="relative">
//       <motion.button
//         onClick={handleClick}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className="relative z-20 flex h-12 items-center justify-center font-bold px-5 sm:px-4 gap-3 text-md rounded-full shadow-lg transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:shadow-indigo-500/35"
//       >
//         <PiHandsPraying size={24} />
//         <span className="hidden sm:inline">Start Prayer</span>
//       </motion.button>

//       {open && (
//         <div className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl z-50">
//           <div className="flex items-center gap-2 mb-3">
//             <input
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//               placeholder="Topic (optional)"
//               className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
//             />
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 mutation.reset();
//               }}
//               className="text-zinc-400 hover:text-white"
//             >
//               Close
//             </button>
//           </div>

//           {mutation.status === "pending" ? (
//             <div className="text-zinc-400">Generating…</div>
//           ) : mutation.status === "error" ? (
//             <div className="text-red-400">Error: {mutation.error?.message}</div>
//           ) : mutation.data?.prompts?.length ? (
//             <div className="space-y-2">
//               {mutation.data.prompts.map((p, i) => (
//                 <div
//                   key={i}
//                   className="bg-zinc-800 p-2 rounded text-sm text-slate-200"
//                 >
//                   {p}
//                 </div>
//               ))}
//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={() =>
//                     navigator.clipboard.writeText(
//                       (mutation.data?.prompts || []).join("\n"),
//                     )
//                   }
//                   className="px-3 py-1 bg-sky-600 rounded text-white text-sm"
//                 >
//                   Copy
//                 </button>
//                 <button
//                   onClick={() =>
//                     mutation.mutate({
//                       topic: topic || "gratitude",
//                       tone: "gentle",
//                       count: 3,
//                     })
//                   }
//                   className="px-3 py-1 bg-zinc-700 rounded text-white text-sm"
//                 >
//                   Regenerate
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="text-zinc-400">
//               No prompts yet. Click the button to generate.
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

export default PrayerButton;
