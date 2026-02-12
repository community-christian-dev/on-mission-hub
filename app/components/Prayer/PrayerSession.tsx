import { useState } from "react";
import { X, Loader2, Check, ArrowRight } from "lucide-react";
// import { PiHandsPraying } from "react-icons/pi"; // Unused in this snippet
import { AnimatePresence, motion } from "framer-motion";
import { OrbitItemType } from "../OrbitItem";
import { useGeneratePrayerPrompts } from "../../hooks/usePrayer";

interface PrayerSessionProps {
  items: OrbitItemType[];
  onClose: () => void;
}

const PrayerSession = ({ items, onClose }: PrayerSessionProps) => {
  const [sessionState, setSessionState] = useState<
    "intro" | "loading" | "praying" | "completed"
  >("intro");

  // Stores the AI text response
  const [prompts, setPrompts] = useState<{ itemId: string; text: string }[]>(
    [],
  );

  // Stores the actual people objects selected for this session
  const [prayerQueue, setPrayerQueue] = useState<OrbitItemType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateMutation = useGeneratePrayerPrompts();

  const handleStart = async () => {
    setSessionState("loading");

    // 1. Select 3 random people
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, items.length));

    // Save selected items to state
    setPrayerQueue(selected);

    try {
      // 2. Call OpenAI API with full item data
      const result = await generateMutation.mutateAsync(selected);
      setPrompts(result);
      setSessionState("praying");
    } catch (err) {
      console.error(err);
      // Fallback: Use local generation if API fails
      const fallbackPrompts = selected.map((item) => ({
        itemId: item.id,
        text: `Pray for ${item.name}'s well-being and that you might be a light in their life today.`,
      }));
      setPrompts(fallbackPrompts);
      setSessionState("praying");
    }
  };

  const handleNext = () => {
    if (currentIndex < prayerQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionState("completed");
    }
  };

  // Helper to safely get current data
  const currentItem = prayerQueue[currentIndex];
  // Find the specific AI prompt for this person
  const currentPrompt = prompts.find((p) => p.itemId === currentItem?.id);

  const colorMap: { [key: string]: string } = {
    center: "bg-yellow-500",
    friends: "bg-blue-500",
    acquaintances: "bg-teal-500",
    strangers: "bg-purple-500",
    places: "bg-orange-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm">
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
            <h2 className="text-3xl font-bold text-white">Guided Prayer</h2>
            <p className="text-slate-400 text-lg">
              Take a few moments to lift up the people in your orbit. We'll
              guide you through 3 short prayer points.
            </p>
            <button
              onClick={handleStart}
              className="w-full text-white text-lg font-bold h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all rounded-xl"
            >
              Start Prayer Session
            </button>
          </motion.div>
        )}

        {sessionState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Preparing your prayer guide...</p>
          </motion.div>
        )}

        {sessionState === "praying" && currentItem && (
          <motion.div
            key={`prayer-${currentItem.id}`} // Use ID for smoother Framer Motion transitions
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-lg"
          >
            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <div className="p-8 space-y-6">
                {/* Header: Person Info */}
                <div className="flex items-center space-x-5 mb-4">
                  <div
                    className={`${colorMap[currentItem.ring] || "bg-indigo-500"} w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl shrink-0`}
                  >
                    {currentItem.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentItem.name}
                    </h2>
                    <p className="text-sm font-mono uppercase text-slate-400">
                      {currentItem.ring === "center"
                        ? "My One"
                        : currentItem.ring}
                    </p>
                  </div>
                </div>

                {/* AI Prompt Area */}
                <div className="relative pl-6 border-l-4 border-indigo-500">
                  <p className="text-xl text-white italic leading-relaxed">
                    {/* FIX: Display the AI Prompt here, not the original DB item */}
                    "{currentPrompt?.text || "..."}"
                  </p>
                </div>

                {/* Original Prayer Request Context (Optional but helpful) */}
                {currentItem.prayer && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-xs uppercase text-slate-500 mb-1">
                      Original Request:
                    </p>
                    <p className="text-sm text-slate-300">
                      {currentItem.prayer}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl text-white"
                  >
                    <ArrowRight size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-md text-slate-400">
              {currentIndex + 1} of {prayerQueue.length}
            </p>
          </motion.div>
        )}

        {sessionState === "completed" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md space-y-6"
          >
            <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Amen.</h2>
            <p className="text-slate-400 text-lg">
              You've intentionally cared for your orbit today. Great work being
              on mission.
            </p>
            <button
              onClick={onClose}
              className="w-full border border-white text-white text-lg font-bold h-12 hover:bg-white/10 transition-colors rounded-xl"
            >
              Return to Orbit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrayerSession;
