import { NextResponse } from "next/server";

type ReqBody = {
  topic?: string;
  tone?: string;
  count?: number;
  isPlace?: boolean;
  notes?: string;
  relationshipRing?: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing server OpenAI key" },
        { status: 500 },
      );
    }

    const body: ReqBody = await request.json().catch(() => ({}));
    const count = Math.max(1, Math.min(5, body.count ?? 1));
    const isPlace = Boolean(body.isPlace);

    const userContext = isPlace
      ? `Generate a short, specific, and encouraging 1-sentence prayer prompt for this PLACE. The user goes here regularly to meet people. Focus on the user being a light there and meeting new people. Keep it simple. ${
          body.topic ? `Place: ${body.topic}.` : ""
        }`
      : `Generate a short, specific, and encouraging 1-sentence prayer prompt for this person based on their relationship ring and any notes. Keep it simple. ${
          body.relationshipRing
            ? `Relationship ring: ${body.relationshipRing}.`
            : ""
        } ${body.notes ? `Notes: ${body.notes}` : ""}`;

    // Force the model to return only JSON with the requested number of prompts.
    const system = `You are a prayer assistant that must return only valid JSON with a single key "prompts" whose value is an array of strings. Do not include any commentary or extraneous text. Example: {"prompts":["...","..."]}.`;

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `Please produce ${count} distinct 1-sentence prayer prompt(s). ${userContext}`,
      },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      // Handle insufficient quota by returning fallback prompts
      try {
        const parsed = JSON.parse(txt);
        if (parsed?.error?.type === "insufficient_quota") {
          return NextResponse.json({
            prompts: [
              "Pray for healing and renewed strength in their body today.",
              "Ask God to bring clarity and gentle peace as they rest and recover.",
            ],
            fallback: true,
            message: "OpenAI quota exceeded — returning fallback prompts.",
          });
        }
      } catch {
        // ignore parse errors
      }
      return NextResponse.json(
        { error: "OpenAI error", details: txt },
        { status: res.status },
      );
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "";

    let prompts: string[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.prompts)) prompts = parsed.prompts.map(String);
    } catch {
      // fallback: split lines and extract sentences
      prompts = content
        .split(/\r?\n/)
        .map((s: string) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
        .slice(0, count);
    }

    return NextResponse.json({ prompts, raw: json });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown" },
      { status: 500 },
    );
  }
}
