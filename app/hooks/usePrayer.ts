import { useMutation } from "@tanstack/react-query";

interface OrbitItem {
    id: string;
    name: string;
    ring: string;
    prayer?: string;
}

interface PrayerPrompt {
    itemId: string;
    text: string;
}

export function useGeneratePrayerPrompts() {
    return useMutation({
        mutationFn: async (items: OrbitItem[]): Promise<PrayerPrompt[]> => {
            const res = await fetch("/api/ai/prayer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            if (!res.ok) {
                throw new Error("Failed to generate prayer prompts");
            }

            const data = await res.json();
            return data.prompts;
        },
    });
}