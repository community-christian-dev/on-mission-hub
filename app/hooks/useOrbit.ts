import { useState, useEffect } from "react";
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/providers/AuthProvider";
import { OrbitItemType } from "@/app/components/OrbitItem";

export const useOrbit = () => {
    const { user } = useAuth();
    const [items, setItems] = useState<OrbitItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setItems([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, "users", user.uid, "orbitItems"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const newItems: OrbitItemType[] = [];
                snapshot.forEach((doc) => {
                    newItems.push({ id: doc.id, ...doc.data() } as OrbitItemType);
                });
                setItems(newItems);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Error fetching orbit items:", err);
                setError("Failed to load orbit items");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const addItem = async (
        item: Omit<OrbitItemType, "id">
    ): Promise<string | undefined> => {
        if (!user) {
            console.error("No user authenticated");
            return;
        }
        if (!item.ring) {
            console.error("Orbit item is missing required 'ring' field:", item);
            return;
        }
        if (!item.name?.trim()) {
            console.error("Orbit item is missing required 'name' field");
            return;
        }
        try {
            const docRef = await addDoc(
                collection(db, "users", user.uid, "orbitItems"),
                {
                    ...item,
                    createdAt: Timestamp.now(),
                }
            );
            return docRef.id;
        } catch (error) {
            console.error("Error adding item:", error);
            setError("Failed to add item");
        }
    };

    const updateItem = async (
        id: string,
        data: Partial<Omit<OrbitItemType, "id">>
    ) => {
        if (!user) return;
        try {
            const itemRef = doc(db, "users", user.uid, "orbitItems", id);
            await updateDoc(itemRef, data);
        } catch (error) {
            console.error("Error updating item:", error);
            setError("Failed to update item");
        }
    };

    const deleteItem = async (id: string) => {
        if (!user) return;
        try {
            const itemRef = doc(db, "users", user.uid, "orbitItems", id);
            await deleteDoc(itemRef);
        } catch (error) {
            console.error("Error deleting item:", error);
            setError("Failed to delete item");
        }
    };

    return { items, loading, error, addItem, updateItem, deleteItem };
};
