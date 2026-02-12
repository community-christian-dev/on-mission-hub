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
    where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export interface MonthlyAction {
    id: string; // Format: YYYY-MM
    title: string;
    content: string; // HTML content
    month: number;
    year: number;
    releaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Fetch all monthly actions
export function useMonthlyActions() {
    return useQuery({
        queryKey: ["monthlyActions"],
        queryFn: async (): Promise<MonthlyAction[]> => {
            const q = query(
                collection(db, "monthlyActions"),
                orderBy("releaseDate", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    content: data.content,
                    month: data.month,
                    year: data.year,
                    releaseDate: data.releaseDate?.toDate() || new Date(),
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                };
            });
        },
    });
}

// Add or update a monthly action
export function useSaveMonthlyAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            month,
            year,
            title,
            content,
            releaseDate,
        }: {
            month: number;
            year: number;
            title: string;
            content: string;
            releaseDate?: Date;
        }) => {
            const id = `${year}-${String(month).padStart(2, "0")}`;
            const actionRef = doc(db, "monthlyActions", id);
            const now = Timestamp.now();

            // Use provided release date or default to 1st of month
            const releaseTimestamp = releaseDate
                ? Timestamp.fromDate(releaseDate)
                : Timestamp.fromDate(new Date(year, month - 1, 1));

            await setDoc(
                actionRef,
                {
                    title,
                    content,
                    month,
                    year,
                    releaseDate: releaseTimestamp,
                    updatedAt: now,
                    createdAt: now,
                },
                { merge: true }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["monthlyActions"] });
        },
    });
}

// Delete a monthly action
export function useDeleteMonthlyAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteDoc(doc(db, "monthlyActions", id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["monthlyActions"] });
        },
    });
}
