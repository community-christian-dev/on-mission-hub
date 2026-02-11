import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { PiHandsPraying } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";

interface PrayerSessionProps {
  items: OrbitItem[];
  onClose: () => void;
}

const PrayerSession = ({ items, onClose }: PrayerSessionProps) => {
  const [sessionState, setSessionState] = useState<
    "intro" | "loading" | "praying" | "completed"
  >("intro");
  const [prompts, setPrompts] = useState<{ itemId: number; text: string }[]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  //   const generateMutation = useGeneratePrayerPrompts();
  //   const logPrayerMutation = useLogPrayer();

  //   const handleStart = async () => {
  //     setSessionState("loading");

  //     // Pick up to 3 random items
  //     const shuffled = [...items].sort(() => 0.5 - Math.random());
  //     const selected = shuffled.slice(0, Math.min(3, items.length));
  //     const selectedIds = selected.map((i) => i.id);

  //     try {
  //       const result = await generateMutation.mutateAsync(selectedIds);
  //       setPrompts(result.prompt);
  //       setSessionState("praying");
  //     } catch (err) {
  //       console.error(err);
  //       const fallbackPrompts = selected.map((item) => ({
  //         itemId: item.id,
  //         text: `Pray for ${item.name}'s well-being and that you might be a light in their life today.`,
  //       }));
  //       setPrompts(fallbackPrompts);
  //       setSessionState("praying");
  //     }
  //   };

  //   const handleNext = async () => {
  //     // Log the completed prayer
  //     const currentPrompt = prompts[currentIndex];
  //     logPrayerMutation.mutate({
  //       orbitItemId: currentPrompt.itemId,
  //       prompt: currentPrompt.text,
  //     });

  //     if (currentIndex < prompts.length - 1) {
  //       setCurrentIndex((prev) => prev + 1);
  //     } else {
  //       setSessionState("completed");
  //       confetti({
  //         particleCount: 100,
  //         spread: 70,
  //         origin: { y: 0.6 },
  //         colors: ["#0ea5e9", "#a855f7", "#ffffff"],
  //       });
  //     }
  //   };

  const currentPrompt = prompts[currentIndex];
  const currentItem = items.find((i) => i.id === currentPrompt?.itemId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <button
        className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>

      <AnimatePresence mode="wait">
        {sessionState === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-md space-y-6"
          >
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <PiHandsPraying className="w-10 h-10 text-indigo-500 " />
            </div>
            <h2 className="text-3xl font-bold text-white">Guided Prayer</h2>
            <p className="text-slate-400 text-lg">
              Take a few moments to lift up the people in your orbit. We'll
              guide you through 3 short prayer points.
            </p>
            <button className="w-full text-white text-lg font-bold h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all rounded-xl">
              Start Prayer Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrayerSession;
