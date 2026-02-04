import PrayerButton from "./PrayerButton";
import ReadingButton from "./ReadingButton";
import MonthlyActionButton from "./MonthlyActionButton";

interface HeaderProps {
  openEditModal: () => void;
  openReadingModal: () => void;
  openMonthlyActionModal: () => void;
  openPrayerModal: () => void;
}

const Header = ({
  openReadingModal,
  openMonthlyActionModal,
  openPrayerModal,
}: HeaderProps) => {
  return (
    // 1. Changed 'flex-wrap' to 'flex-nowrap' to force single line
    <nav className="absolute top-4 flex flex-nowrap items-center justify-between w-full px-6 gap-2 z-20 pointer-events-none">
      {/* Left Group */}
      {/* 2. Added 'shrink-0' so the logo text never collapses/wraps */}
      <div className="z-20 pointer-events-auto flex flex-row items-center gap-2 shrink-0">
        <div className="text-2xl font-display font-bold tracking-tight text-white">
          On<span className="text-sky-500">Mission</span>
        </div>
      </div>

      {/* Right Group */}
      {/* 3. Added responsive scaling:
             - 'origin-right': Scaling anchors to the right edge (doesn't float away)
             - 'scale-75': Scales buttons down to 75% size by default (mobile)
             - 'sm:scale-100': Returns to 100% size on screens larger than 'sm' 
             - 'shrink-0': Prevents flexbox from trying to squash the div width
      */}
      <div className="flex flex-row items-center justify-end gap-2 z-20 pointer-events-auto">
        <MonthlyActionButton openReadingModal={openMonthlyActionModal} />
        <ReadingButton openReadingModal={openReadingModal} />
        <PrayerButton openPrayerModal={openPrayerModal} />
      </div>
    </nav>
  );
};

export default Header;
