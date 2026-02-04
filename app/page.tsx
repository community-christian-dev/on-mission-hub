"use client";

import ConcentricRings from "./components/ConcentricRings";
import Header from "./components/Header";
import EditModal from "./components/EditModal";
import { useState } from "react";
import { RingData } from "./data/RingData";
import { OrbitItemType } from "./components/OrbitItem";
import { AnimatePresence } from "framer-motion";
import ReadingModal from "./components/ReadingModal";
import PrayerModal from "./components/PrayerModal";
import MockItems from "./data/MockItems";
import MonthlyActionModal from "./components/MonthlyActionModal";
import AdminPage from "./admin/page";

export default function Home() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ring: RingData[0].id,
    prayer: "",
  });

  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isMonthlyActionModalOpen, setIsMonthlyActionModalOpen] =
    useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);

  const openEditModal = (item?: OrbitItemType) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        ring: item.ring,
        prayer: item.prayer || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", ring: RingData[0].id, prayer: "" });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    alert("Item Saved");
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    alert("Item Deleted");
    setIsEditModalOpen(false);
  };

  return (
    // <AdminPage />
    <div className="flex min-h-screen flex-col items-center bg-zinc-900">
      <Header
        openEditModal={openEditModal}
        openReadingModal={() => setIsReadingModalOpen(true)}
        openMonthlyActionModal={() => setIsMonthlyActionModalOpen(true)}
        openPrayerModal={() => setIsPrayerModalOpen(true)}
      />
      <ConcentricRings onItemClick={openEditModal} />
      <AnimatePresence>
        <EditModal
          key={"edit"}
          editingId={editingId}
          closeModal={() => setIsEditModalOpen(false)}
          formData={formData}
          handleDelete={handleDelete}
          handleSave={handleSave}
          isOpen={isEditModalOpen}
          setFormData={setFormData}
        />
        <ReadingModal
          isOpen={isReadingModalOpen}
          closeModal={() => setIsReadingModalOpen(false)}
        />
        <PrayerModal
          isOpen={isPrayerModalOpen}
          prayerQueue={MockItems}
          closeModal={() => setIsPrayerModalOpen(false)}
        />
        <MonthlyActionModal
          isOpen={isMonthlyActionModalOpen}
          closeModal={() => setIsMonthlyActionModalOpen(false)}
        />
      </AnimatePresence>
    </div>
  );
}
