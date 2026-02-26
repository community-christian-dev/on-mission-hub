"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { RingData } from "../data/RingData";
import { useState } from "react";

interface FormData {
  name: string;
  ring: string;
  prayer: string;
}

interface Props {
  closeModal: () => void;
  editingId: string | null;
  formData: FormData;
  handleDelete: (id: string) => void;
  handleSave: (e?: React.SyntheticEvent) => void;
  isOpen: boolean;
  setFormData: (newFormData: FormData) => void;
}

const EditModal = ({
  closeModal,
  editingId,
  formData,
  handleDelete,
  handleSave,
  isOpen,
  setFormData,
}: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.ring) {
      newErrors.ring = "Orbit Level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSave(e);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Item" : "Add to Orbit"}
              </h2>
              <button
                className="text-zinc-400 hover:text-white"
                onClick={closeModal}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Name / Place
                </label>
                <input
                  autoFocus
                  type="text"
                  maxLength={100}
                  value={formData.name || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`w-full bg-zinc-800 border rounded-lg p-3 text-white focus:outline-none focus:ring-1 transition-colors ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-zinc-700 focus:ring-zinc-600"
                  }`}
                  placeholder="e.g. Alex, Kroger, etc."
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Orbit Level
                </label>
                <select
                  value={formData.ring}
                  onChange={(e) =>
                    setFormData({ ...formData, ring: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-600 appearance-none"
                >
                  {RingData.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Prayer Request
                </label>
                <textarea
                  rows={5}
                  value={formData.prayer}
                  onChange={(e) =>
                    setFormData({ ...formData, prayer: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
                  placeholder="Optional prayer request..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingId)}
                    className="flex items-center justify-center p-3 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;
