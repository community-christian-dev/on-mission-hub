import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useState } from "react";
import PrayerPrompt from "./PrayerPrompt";
import BreathPrayer from "./BreathPrayer";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface PrayerModalProps {
  isOpen: boolean;
  isLoading: boolean;
  prayerQueue: any[];
  closeModal: () => void;
}

const colorMap: { [key: string]: string } = {
  center: "bg-yellow-500",
  friends: "bg-blue-500",
  acquaintances: "bg-teal-500",
  strangers: "bg-purple-500",
  places: "bg-orange-500",
};

const PrayerModal = ({ isOpen, prayerQueue, closeModal }: PrayerModalProps) => {
  const [isBreathPrayer, setIsBreathPrayer] = useState(true);
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);

  const handleNext = () => {
    if (currentPrayerIndex < prayerQueue.length - 1) {
      setCurrentPrayerIndex(currentPrayerIndex + 1);
    } else {
      closeModal();
      setCurrentPrayerIndex(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && prayerQueue.length > 0 && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            // key={prayerQueue[currentPrayerIndex].id}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-slate-900/50 border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <button
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            {isBreathPrayer ? (
              <div className="absolute bottom-4 right-4">
                <CountdownCircleTimer
                  isPlaying
                  duration={20}
                  colors={"#615fff"}
                  size={32}
                  strokeWidth={4}
                  onComplete={() => setIsBreathPrayer(false)}
                />
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="absolute bottom-4 right-4 flex gap-1 items-center justify-center font-bold py-1 px-4 text-lg rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              >
                Next <ArrowRight size={16} strokeWidth={4} />
              </button>
            )}

            {currentPrayerIndex === 0 ? (
              <BreathPrayer />
            ) : (
              <PrayerPrompt
                name={prayerQueue[currentPrayerIndex - 1].name}
                ring={prayerQueue[currentPrayerIndex - 1].ring}
                prayer={prayerQueue[currentPrayerIndex - 1].prayer}
              />
            )}
            {/* <PrayerPrompt
              name={prayerQueue[currentPrayerIndex].name}
              ring={prayerQueue[currentPrayerIndex].ring}
              prayer={prayerQueue[currentPrayerIndex].prayer}
            /> */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrayerModal;
