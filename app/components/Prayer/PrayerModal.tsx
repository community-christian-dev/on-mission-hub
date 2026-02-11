import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useState } from "react";
import PrayerPrompt from "./PrayerPrompt";
import StartPage from "./StartPage";
import BreathPrayer from "./BreathPrayer";

interface PrayerModalProps {
  isOpen: boolean;
  isLoading: boolean;
  prayerQueue: any[];
  closeModal: () => void;
}

const PrayerModal = ({ isOpen, prayerQueue, closeModal }: PrayerModalProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // 1. UPDATE PAGE COUNT LOGIC
  // Page 0 = Start, Page 1 = Breath, Page 2+ = Queue
  const numPages = (prayerQueue?.length || 0) + 2;

  const handleClose = () => {
    closeModal();
    setCurrentPageIndex(0);
  };

  const handleNext = () => {
    if (currentPageIndex < numPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      handleClose();
    }
  };

  // 2. HELPER FUNCTION TO MANAGE MULTIPLE VIEWS
  const renderContent = () => {
    switch (currentPageIndex) {
      case 0:
        return <StartPage onClick={handleNext} />;

      case 1:
        return <BreathPrayer />;

      default:
        // Calculate queue index:
        // Page 2 corresponds to queue[0], Page 3 to queue[1], etc.
        const queueIndex = currentPageIndex - 2;
        const prayerItem = prayerQueue[queueIndex];

        // Safety check in case queue is empty or index is off
        if (!prayerItem) return null;

        return (
          <PrayerPrompt
            name={prayerItem.name}
            ring={prayerItem.ring}
            prayer={prayerItem.prayer}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              layout: {
                duration: 0.5,
                type: "spring",
                bounce: 0,
              },
              opacity: { duration: 0.2 },
            }}
            style={{ borderRadius: "1.5rem" }}
            className="relative w-full max-w-md bg-slate-900/50 border border-indigo-500/30 p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] backdrop-blur-xl overflow-hidden"
          >
            <motion.div
              layout="position"
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
            />

            <motion.button
              layout="position"
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20"
              onClick={handleClose}
            >
              <X size={20} />
            </motion.button>

            {/* 3. SIMPLIFIED ANIMATION WRAPPER */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentPageIndex}
                className="w-full" // Keeps layout stable during absolute positioning
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                {/* Clean function call instead of nested ternaries */}
                {renderContent()}
              </motion.div>
            </AnimatePresence>

            {/* 4. NAVIGATION BUTTONS */}
            {currentPageIndex !== 0 && (
              <motion.div layout="position" className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="flex gap-1 items-center font-bold py-2 px-5 rounded-xl text-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                >
                  {currentPageIndex === numPages - 1 ? (
                    "Finish"
                  ) : (
                    <>
                      Next <ArrowRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrayerModal;
