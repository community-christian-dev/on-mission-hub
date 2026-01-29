"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, limit } from 'firebase/firestore';
import { Trash2, Calendar, Save } from 'lucide-react';

interface Reading {
  id: string; // The date string (YYYY-MM-DD)
  reference: string;
}

export default function AdminPage() {
  // Form State
  const [date, setDate] = useState('');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  
  // List State
  const [readings, setReadings] = useState<Reading[]>([]);

  // Load data immediately on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      // Get upcoming readings
      const q = query(collection(db, "daily_readings"), limit(20)); 
      const querySnapshot = await getDocs(q);
      const list: Reading[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Reading);
      });
      // Sort locally by date
      list.sort((a, b) => a.id.localeCompare(b.id));
      setReadings(list);
    } catch (e) {
      console.error("Error fetching readings:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reference) return;

    setStatus('Saving...');
    try {
      // Write to Firestore: ID is the date, data contains the reference
      await setDoc(doc(db, "daily_readings", date), {
        reference: reference
      });
      
      setStatus('Saved!');
      setReference(''); // Clear input so you can type the next one easily
      fetchReadings();  // Refresh list
      
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      console.error(error);
      setStatus('Error saving');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete reading for ${id}?`)) return;
    try {
      await deleteDoc(doc(db, "daily_readings", id));
      fetchReadings();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Calendar className="text-blue-500" /> Scripture Schedule
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT: FORM */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Add Reading</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Scripture Reference</label>
                <input 
                  type="text" 
                  placeholder="e.g. John 3:16 or Psalm 23" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Must be a valid format for Bible-API.com</p>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={18} /> Save Reading
              </button>
              {status && <p className={`text-center text-sm ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{status}</p>}
            </form>
          </div>

          {/* RIGHT: LIST */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Upcoming Schedule</h2>
            <div className="space-y-3">
              {readings.length === 0 && <p className="text-slate-500 italic">No readings scheduled.</p>}
              {readings.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg group">
                  <div>
                    <div className="text-slate-400 text-xs font-mono mb-1">{r.id}</div>
                    <div className="text-white font-serif font-medium text-lg">{r.reference}</div>
                  </div>
                  <button 
                    onClick={() => handleDelete(r.id)}
                    className="text-slate-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}