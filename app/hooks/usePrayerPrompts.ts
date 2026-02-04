"use client";
import { useMutation } from "@tanstack/react-query";

type Req = { topic?: string; tone?: string; count?: number };
type Res = { prompts: string[]; raw?: any };

const callApi = async (payload: Req) => {
  const res = await fetch("/api/ai/prayer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return (await res.json()) as Res;
};

export const usePrayerPrompts = () =>
  useMutation<Res, Error, Req>({
    mutationFn: (payload: Req) => callApi(payload),
  });
