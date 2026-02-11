import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { motion } from "framer-motion";

const BreathPrayer = () => {
  const breathIn = "The Lord is my shepherd";
  const breathOut = "I shall not want";

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-2xl font-bold text-white">Breath Prayer</h2>
      <p className="flex text-center text-slate-400">
        Begin your time of prayer with a deep breath in and a slow exhale.
      </p>
      <br></br>
      <p className="flex flex-col items-center text-center text-slate-400">
        As you breathe in, pray<br></br>
        <span className="font-serif font-bold text-white">"{breathIn}"</span>
        <br></br>
        As you breathe out, pray:<br></br>
        <span className="font-serif font-bold text-white">"{breathOut}"</span>
      </p>
      <div className="absolute bottom-4 left-4 pt-4">
        <CountdownCircleTimer
          isPlaying
          duration={20}
          colors="#667eea"
          strokeWidth={4}
          size={30}
        />{" "}
      </div>
    </div>
  );
};

export default BreathPrayer;
