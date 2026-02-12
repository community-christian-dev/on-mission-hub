"use client";

import ConcentricRings from "./components/ConcentricRings";
import Header from "./components/Header";
import EditModal from "./components/EditModal";
import { useState } from "react";
import { RingData } from "./data/RingData";
import { OrbitItemType } from "./components/OrbitItem";
import { AnimatePresence } from "framer-motion";
import ReadingModal from "./components/ReadingModal";
import PrayerModal from "./components/Prayer/PrayerModal";
import MonthlyActionModal from "./components/MonthlyActionModal";
import AdminPage from "./admin/page";
import { useOrbit } from "./hooks/useOrbit";
import PrayerSession from "./components/Prayer/PrayerSession";

export default function Home() {
  const { items, addItem, updateItem, deleteItem } = useOrbit();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ring: RingData[0]?.id || "center",
    prayer: "",
  });

  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isMonthlyActionModalOpen, setIsMonthlyActionModalOpen] =
    useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isPrayerModalLoading, setIsPrayerModalLoading] = useState(false);
  const [isPrayerSessionOpen, setIsPrayerSessionOpen] = useState(false);
  const [prayerQueue, setPrayerQueue] = useState<OrbitItemType[]>([]);

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
      setFormData({ name: "", ring: RingData[0]?.id || "center", prayer: "" });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (editingId) {
      await updateItem(editingId, formData);
    } else {
      await addItem(formData);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (editingId) {
      await deleteItem(editingId);
    }
    setIsEditModalOpen(false);
  };

  const getRandomItems = (num: number) => {
    const shuffledItems = [...items];

    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [
        shuffledItems[j],
        shuffledItems[i],
      ];
    }

    return shuffledItems.slice(0, num);
  };

  return (
    // <AdminPage />
    <div className="flex min-h-screen flex-col items-center bg-zinc-900">
      <Header
        openEditModal={openEditModal}
        openReadingModal={() => setIsReadingModalOpen(true)}
        openMonthlyActionModal={() => setIsMonthlyActionModalOpen(true)}
        openPrayerModal={() => setIsPrayerSessionOpen(true)}
      />
      <ConcentricRings onItemClick={openEditModal} items={items} />
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
          key="reading"
          isOpen={isReadingModalOpen}
          closeModal={() => setIsReadingModalOpen(false)}
        />
        <MonthlyActionModal
          key="monthly"
          isOpen={isMonthlyActionModalOpen}
          closeModal={() => setIsMonthlyActionModalOpen(false)}
        />
        {isPrayerSessionOpen && (
          <PrayerSession
            key="prayer-session"
            items={items}
            onClose={() => setIsPrayerSessionOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
