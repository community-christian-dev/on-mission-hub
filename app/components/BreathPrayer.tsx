import { CountdownCircleTimer } from "react-countdown-circle-timer";

const BreathPrayer = () => {
  const breathIn = "The Lord is my shepherd";
  const breathOut = "I shall not want";

  return (
    <div className="flex flex-col items-center mb-8 gap-2">
      <h2 className="text-2xl font-bold text-white">Breath Prayer</h2>
      <p>Begin your time of prayer with a deep breath in and a slow exhale.</p>
      <p className="flex flex-col items-center text-center text-slate-400">
        As you breathe in, pray<br></br>
        <span className="italic font-serif font-bold text-white">
          "{breathIn}"
        </span>
        <br></br>
        As you breathe out, pray:<br></br>
        <span className="italic font-serif font-bold text-white">
          "{breathOut}"
        </span>
      </p>
    </div>
  );
};

export default BreathPrayer;
