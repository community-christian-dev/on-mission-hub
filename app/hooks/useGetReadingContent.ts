"use client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type ReadingPayload = {
  content?: string;
  reference?: string;
  [k: string]: any;
};

const fetchReading = async (
  bibleId: string,
  passage: string,
): Promise<ReadingPayload> => {
  const q = new URLSearchParams({ bibleId, passage, format: "text" });
  const res = await fetch(`/api/reading?${q.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch reading (${res.status})`);
  const body = await res.json();

  let payload: any = body;
  if (body?.data != null)
    payload = Array.isArray(body.data) ? body.data[0] : body.data;
  else if (body?.passages != null)
    payload = Array.isArray(body.passages) ? body.passages[0] : body.passages;

  return (payload || {}) as ReadingPayload;
};

export const useGetReadingContent = (
  bibleId = "111",
  passage = "JHN.6",
  options?: UseQueryOptions<ReadingPayload>,
) =>
  useQuery<ReadingPayload>({
    queryKey: ["reading", bibleId, passage],
    queryFn: () => fetchReading(bibleId, passage),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
