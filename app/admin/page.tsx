"use client";

import React, { useState, useEffect, use } from "react";
import { Trash2, Calendar, Save } from "lucide-react";

interface Reading {
  id: string; // The date string (YYYY-MM-DD)
  reference: string;
}

export default function AdminPage() {
  // Form State
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");

  // List State
  const [readings, setReadings] = useState<Reading[]>([]);

  const handleSave = () => {
    alert("Reading Saved");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Calendar className="text-sky-500" /> Scripture Schedule
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: FORM */}
          <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 h-fit">
            <h2 className="text(-xl font-bold text-white mb-4">Add Reading</h2>
            <form onSubmit={handleSave} className="space-y-4"></form>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 text-white focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Scripture Reference
              </label>
              <input
                type="text"
                placeholder="e.g. John 3:16 or Psalm 23"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-white focus:border-sky-500 outline-none"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Must be a valid format for YouVersion API
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold p-3 rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={18} /> Save Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
