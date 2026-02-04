import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface PrayerModalProps {
  isOpen: boolean;
  prayerQueue: any[];
  closeModal: () => void;
}

const PrayerModal = ({ isOpen, prayerQueue, closeModal }: PrayerModalProps) => {
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
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white bg-blue-500">
                {prayerQueue[0].name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {prayerQueue[0].name}
                </h2>
                <p className="text-sm text-slate-400">{prayerQueue[0].ring} </p>
              </div>
            </div>
            <div className="mb-10 relative pl-6 border-l-4 border-indigo-500">
              <p className="text-lg text-slate-200 italic leading-relaxed">
                "{prayerQueue[0].prayer || "No prayer provided."}"
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrayerModal;
