"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Sparkles, ArrowRight, Loader2, BookOpen } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { db, auth } from '@/lib/firebase'; // Ensure this path matches your project structure
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc 
} from 'firebase/firestore';

// --- TYPES ---
type RingId = 'center' | 'friends' | 'acquaintances' | 'strangers' | 'places';

interface OrbitItem {
  id: string; 
  name: string;
  ring: RingId;
  prayer?: string;
  generatedPrompt?: string;
}

interface BibleReading {
  reference: string;
  text: string;
  translation_name: string;
}

// --- CONFIGURATION ---
const RINGS = [
  { id: 'center', label: 'My One', color: 'bg-yellow-500', ringColor: 'border-yellow-500/50', radius: 0, startAngle: 0 },
  { id: 'friends', label: 'Friends', color: 'bg-blue-600', ringColor: 'border-blue-500/30', radius: 110, startAngle: 45 },
  { id: 'acquaintances', label: 'Acquaintances', color: 'bg-teal-600', ringColor: 'border-teal-500/30', radius: 175, startAngle: 120 },
  { id: 'strangers', label: 'Strangers', color: 'bg-purple-600', ringColor: 'border-purple-500/30', radius: 240, startAngle: 200 },
  { id: 'places', label: 'Places', color: 'bg-orange-600', ringColor: 'border-orange-500/30', radius: 305, startAngle: 300 },
];

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function OrbitVisualizer() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<OrbitItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedRing, setSelectedRing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', ring: 'friends', prayer: '' });

  // Prayer Mode States
  const [isPrayerModeOpen, setIsPrayerModeOpen] = useState(false);
  const [prayerQueue, setPrayerQueue] = useState<OrbitItem[]>([]);
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Daily Reading States
  const [isReadingOpen, setIsReadingOpen] = useState(false);
  const [readingData, setReadingData] = useState<BibleReading | null>(null);
  const [loadingReading, setLoadingReading] = useState(false);
  const [todaysReference, setTodaysReference] = useState<string | null>(null); // Stores the reference if it exists
  const [checkingReading, setCheckingReading] = useState(true); // Initial load state for the button

  useEffect(() => { 
    setMounted(true); 

    // 1. AUTH & DATA LISTENER
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Listen to User's Orbit Items
        const q = query(collection(db, `users/${currentUser.uid}/orbit_items`));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const loadedItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as OrbitItem[];
          setItems(loadedItems);
          setLoadingItems(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        await signInAnonymously(auth);
      }
    });

    // 2. CHECK FOR DAILY READING (IMMEDIATELY)
    const checkReading = async () => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const docRef = doc(db, "daily_readings", today);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTodaysReference(docSnap.data().reference);
            } else {
                setTodaysReference(null);
            }
        } catch (error) {
            console.error("Error checking reading:", error);
        } finally {
            setCheckingReading(false);
        }
    };
    checkReading();

    return () => unsubscribeAuth();
  }, []);

  // --- API: FETCH READING CONTENT ---
  const openDailyReading = async () => {
    if (!todaysReference) return;
    setIsReadingOpen(true);
    if (readingData && readingData.reference === todaysReference) return; // Don't refetch if already loaded

    setLoadingReading(true);
    
    try {
      // Call Free Bible API
      const res = await fetch(`https://bible-api.com/${todaysReference}?translation=web`);
      const data = await res.json();
      
      setReadingData({
        reference: data.reference,
        text: data.text,
        translation_name: data.translation_name
      });
    } catch (e) {
      console.error("Failed to fetch reading", e);
    } finally {
      setLoadingReading(false);
    }
  };

  // --- MOCK API: GENERATE PROMPTS ---
  const generatePrompts = async (selectedItems: OrbitItem[]): Promise<OrbitItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemsWithPrompts = selectedItems.map(item => {
          if (item.prayer) return item;
          let aiPrompt = "";
          switch(item.ring) {
            case 'center': aiPrompt = `Lord, I lift up ${item.name}, my 'One'. Open their heart to your grace today.`; break;
            case 'friends': aiPrompt = `Pray for ${item.name}'s daily walk, that they would feel encouraged and strengthened.`; break;
            case 'places': aiPrompt = `Pray that God would use you as a light when you visit ${item.name} this week.`; break;
            case 'strangers': aiPrompt = `Pray for an opportunity to show kindness to ${item.name} the next time you cross paths.`; break;
            default: aiPrompt = `Bless ${item.name} today and meet them right where they are.`;
          }
          return { ...item, generatedPrompt: aiPrompt };
        });
        resolve(itemsWithPrompts);
      }, 1500); 
    });
  };

  // --- START PRAYER LOGIC ---
  const startPrayer = async () => {
    if (items.length === 0) {
        alert("Add some people to your orbit first!");
        return;
    }
    setIsGenerating(true);

    let selection: OrbitItem[] = [];
    const centers = items.filter(i => i.ring === 'center');
    if (centers.length > 0) selection.push(shuffle(centers)[0]);

    const others = items.filter(i => i.ring !== 'center' || !selection.includes(i));
    const shuffledOthers = shuffle(others);
    
    while (selection.length < 3 && shuffledOthers.length > 0) {
      const next = shuffledOthers.pop();
      if (next) selection.push(next);
    }

    const itemsWithPrompts = await generatePrompts(selection);
    setPrayerQueue(itemsWithPrompts);
    setCurrentPrayerIndex(0);
    setIsGenerating(false);
    setIsPrayerModeOpen(true);
  };

  const nextPrayer = () => {
    if (currentPrayerIndex < prayerQueue.length - 1) {
      setCurrentPrayerIndex(currentPrayerIndex + 1);
    } else {
      setIsPrayerModeOpen(false);
      setPrayerQueue([]);
      setCurrentPrayerIndex(0);
    }
  };

  const getPosition = (ringId: string, index: number, totalInRing: number) => {
    const ring = RINGS.find(r => r.id === ringId);
    let radius = ring?.radius || 0;
    if (ringId === 'center' && totalInRing > 1) radius = 50; 
    const angleStep = (2 * Math.PI) / (totalInRing || 1);
    const startOffset = ((ring?.startAngle || 0) * Math.PI) / 180; 
    const angle = (index * angleStep) - (Math.PI / 2) + startOffset;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  // --- FIREBASE CRUD ---
  const openEditModal = (item?: OrbitItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ name: item.name, ring: item.ring, prayer: item.prayer || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', ring: 'friends', prayer: '' });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !user) return;

    try {
        if (editingId) {
            // UPDATE EXISTING
            const itemRef = doc(db, `users/${user.uid}/orbit_items`, editingId);
            await updateDoc(itemRef, {
                name: formData.name,
                ring: formData.ring,
                prayer: formData.prayer
            });
        } else {
            // CREATE NEW
            await addDoc(collection(db, `users/${user.uid}/orbit_items`), {
                name: formData.name,
                ring: formData.ring,
                prayer: formData.prayer,
                createdAt: new Date()
            });
        }
        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Error saving orbit item:", error);
    }
  };

  const handleDelete = async () => {
    if (editingId && user) {
        try {
            await deleteDoc(doc(db, `users/${user.uid}/orbit_items`, editingId));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-slate-950 font-sans">
      
      {/* HEADER Left */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Orbit</h1>
        <p className="text-slate-400 text-sm mb-4">Tap a name to edit</p>
      </div>

      {/* DAILY WORD BUTTON / STATUS */}
      <div className="absolute top-24 left-6 z-20 pointer-events-auto">
        {!checkingReading && todaysReference ? (
            <motion.button
                onClick={openDailyReading}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 py-2 px-4 rounded-full transition-all text-sm font-medium"
            >
                <BookOpen size={16} />
                <span>Daily Word</span>
            </motion.button>
        ) : !checkingReading ? (
            <div className="text-slate-500 text-sm italic py-2 px-1">
                No scripture readings today
            </div>
        ) : null}
      </div>
      
      {/* START PRAYER BUTTON (Top Right) */}
      <motion.button
        onClick={startPrayer}
        disabled={isGenerating || loadingItems}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className={`absolute top-6 right-6 z-20 flex items-center gap-2 font-bold py-2 px-4 rounded-full shadow-lg transition-all
          ${isGenerating ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40'}
        `}
      >
        {isGenerating ? (
           <> <Loader2 size={18} className="animate-spin" /> Generating... </>
        ) : (
           <> <Sparkles size={18} /> Start Prayer </>
        )}
      </motion.button>

      {/* --- VISUALIZER --- */}
      <div className="relative flex items-center justify-center w-0 h-0 scale-[0.60] sm:scale-[0.85] md:scale-100 transition-transform duration-300">
        
        {/* RINGS */}
        {RINGS.map((ring, index) => {
          if (ring.id === 'center') return null; 
          const size = ring.radius * 2; 
          const isSelected = selectedRing === ring.id;
          return (
            <motion.div
              key={ring.id}
              onClick={() => setSelectedRing(isSelected ? null : ring.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`absolute rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${ring.ringColor} 
                ${isSelected ? 'bg-white/5 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'hover:border-white/40'}
                cursor-pointer
              `}
              style={{ width: `${size}px`, height: `${size}px`, zIndex: 10 }}
            />
          );
        })}

        {/* CENTER GLOW */}
        <div className="absolute z-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* LOADING STATE */}
        {loadingItems && (
            <div className="absolute z-40 text-blue-500 animate-pulse">
                <Loader2 size={40} className="animate-spin" />
            </div>
        )}

        {/* ITEMS */}
        {!loadingItems && items.map((item) => {
            const itemsInThisRing = items.filter(i => i.ring === item.ring);
            const indexInRing = itemsInThisRing.findIndex(i => i.id === item.id);
            const { x, y } = getPosition(item.ring, indexInRing, itemsInThisRing.length);
            const ringConfig = RINGS.find(r => r.id === item.ring);

            return (
                <motion.div
                    key={item.id}
                    className={`absolute flex items-center justify-center w-0 h-0 z-30 group`}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, x, y }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div 
                      onClick={() => openEditModal(item)}
                      className={`
                        relative whitespace-nowrap px-3 py-1.5 rounded-full shadow-lg cursor-pointer
                        ${ringConfig?.color || 'bg-gray-500'}
                        text-white text-xs font-bold tracking-wide
                        border border-white/20 hover:scale-110 hover:border-white transition-all
                      `}
                    >
                        {item.name}
                        {item.prayer && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900" />}
                    </div>
                </motion.div>
            )
        })}
      </div>
      
      {/* ADD BUTTON */}
      <motion.button 
        onClick={() => openEditModal()}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="absolute bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/50 z-40 hover:bg-blue-500"
      >
        <Plus size={28} />
      </motion.button>

      {/* --- CRUD MODAL --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">{editingId ? 'Edit Entry' : 'Add to Orbit'}</h2><button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
              <form onSubmit={handleSave} className="space-y-4">
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Name / Place</label><input autoFocus type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sarah" /></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Orbit Level</label><select value={formData.ring} onChange={(e) => setFormData({...formData, ring: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">{RINGS.map(r => (<option key={r.id} value={r.id}>{r.label}</option>))}</select></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Prayer Request</label><textarea rows={5} value={formData.prayer} onChange={(e) => setFormData({...formData, prayer: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Optional..." /></div>
                <div className="flex gap-3 pt-2">{editingId && (<button type="button" onClick={handleDelete} className="flex items-center justify-center p-3 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50"><Trash2 size={20} /></button>)}<button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg">Save Entry</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PRAYER MODE MODAL --- */}
      <AnimatePresence>
        {isPrayerModeOpen && prayerQueue.length > 0 && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsPrayerModeOpen(false)} />
            <motion.div key={prayerQueue[currentPrayerIndex].id} initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: -20, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-md bg-slate-900/50 border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <button onClick={() => setIsPrayerModeOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
              <div className="flex items-center space-x-4 mb-8">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white ${RINGS.find(r => r.id === prayerQueue[currentPrayerIndex].ring)?.color}`}>{prayerQueue[currentPrayerIndex].name.charAt(0).toUpperCase()}</div>
                <div><h2 className="text-2xl font-bold text-white">{prayerQueue[currentPrayerIndex].name}</h2><p className="text-sm text-slate-400">{RINGS.find(r => r.id === prayerQueue[currentPrayerIndex].ring)?.label}</p></div>
              </div>
              <div className="mb-10 relative pl-6 border-l-4 border-indigo-500"><p className="text-lg text-slate-200 italic leading-relaxed">"{prayerQueue[currentPrayerIndex].prayer || prayerQueue[currentPrayerIndex].generatedPrompt}"</p></div>
              <div className="flex justify-between items-center"><p className="text-sm text-slate-500 font-medium">{currentPrayerIndex + 1} of {prayerQueue.length}</p><button onClick={nextPrayer} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all">{currentPrayerIndex === prayerQueue.length - 1 ? 'Finish' : 'Amen, Next'} <ArrowRight size={18} /></button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- READING MODAL --- */}
      <AnimatePresence>
        {isReadingOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsReadingOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50"><div><h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen size={20} className="text-blue-500" />Daily Word</h2><p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Today's Reading</p></div><button onClick={() => setIsReadingOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
              <div className="p-8 overflow-y-auto custom-scrollbar">{loadingReading ? (<div className="flex flex-col items-center justify-center py-12 space-y-4"><Loader2 size={32} className="text-blue-500 animate-spin" /><p className="text-slate-400">Opening the scroll...</p></div>) : readingData ? (<div className="prose prose-invert max-w-none"><h3 className="text-2xl font-serif text-slate-100 mb-2">{readingData.reference}</h3><p className="text-sm text-slate-500 mb-6 font-mono">{readingData.translation_name}</p><div className="text-lg leading-relaxed text-slate-300 font-serif whitespace-pre-line">{readingData.text}</div></div>) : (<div className="text-center text-slate-500">Failed to load reading. Please try again.</div>)}</div>
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end"><button onClick={() => setIsReadingOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">Close</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}