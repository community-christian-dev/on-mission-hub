import { motion } from "framer-motion";

interface StartPageProps {
  onClick: () => void;
}

const StartPage = ({ onClick }: StartPageProps) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        exit={{ opacity: 0 }}
        className="text-2xl font-bold text-white"
      >
        Guided Prayer
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        exit={{ opacity: 0 }}
        className="text-lg text-slate-400 text-center"
      >
        The following excercises will guide you through praying through your
        orbit, and for those in your daily life.
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1.5 }}
        transition={{ duration: 1, delay: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
        className="items-center font-bold px-12 py-2 gap-3 text-md text-xl rounded-xl transition-colors bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
      >
        Begin
      </motion.button>
    </div>
  );
};

export default StartPage;
