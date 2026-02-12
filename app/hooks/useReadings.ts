import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export interface Reading {
    id: string; // Date in YYYY-MM-DD format
    reference: string;
    createdAt: Date;
    updatedAt: Date;
}

// Fetch all readings
export function useReadings() {
    return useQuery({
        queryKey: ["readings"],
        queryFn: async (): Promise<Reading[]> => {
            const snapshot = await getDocs(collection(db, "readings"));
            const readings = snapshot.docs.map((doc) => ({
                id: doc.id,
                reference: doc.data().reference,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            }));
            // Sort by date in JavaScript instead of Firestore
            return readings.sort((a, b) => a.id.localeCompare(b.id));
        },
    });
}

// Add or update a reading
export function useSaveReading() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            date,
            reference,
        }: {
            date: string;
            reference: string;
        }) => {
            const readingRef = doc(db, "readings", date);
            const now = Timestamp.now();

            // Check if document exists to preserve createdAt
            const snapshot = await getDocs(
                query(collection(db, "readings"))
            );
            const exists = snapshot.docs.some((doc) => doc.id === date);

            if (exists) {
                // Update existing
                await setDoc(
                    readingRef,
                    {
                        reference,
                        updatedAt: now,
                    },
                    { merge: true }
                );
            } else {
                // Create new
                await setDoc(readingRef, {
                    reference,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["readings"] });
        },
    });
}

// Delete a reading
export function useDeleteReading() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (date: string) => {
            await deleteDoc(doc(db, "readings", date));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["readings"] });
        },
    });
}
