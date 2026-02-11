import AddOrbitItemButton from "./AddOrbitItemButton";
import PrayerButton from "./PrayerButton";

interface ButtonBarProps {
  openEditModal: () => void;
}

const ButtonBar = ({ openEditModal }: ButtonBarProps) => {
  return (
    <div className="absolute top-6 right-6 flex flex-row items-center justify-end gap-4">
      <PrayerButton />
      <AddOrbitItemButton onClick={() => openEditModal()} />
    </div>
  );
};

export default ButtonBar;
