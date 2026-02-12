import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OrbitItem {
  id: string;
  name: string;
  ring: string;
  prayer?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body as { items: OrbitItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ prompts: [] });
    }

    // Generate prayer prompts using OpenAI
    const prompts = await Promise.all(
      items.map(async (item) => {
        try {
          const isPlace = item.ring === "places";
          const systemPrompt = isPlace ?
            "You are a prayer assistant. Write a brief 1-2 sentence prayer for the user to pray in the first person. The subject is a PLACE they visit. Focus on the user being a light there and meeting new people. Start with 'Lord' or 'Father'." :
            "You are a prayer assistant. Write a brief 1-2 sentence prayer for the user to pray in the first person for a specific PERSON. Use their name and include their specific request if provided. Start with 'Lord' or 'Father'.";

          const userPrompt = `Generate a prayer prompt for ${item.name}, who is in my "${item.ring}" circle.${item.prayer ? ` They've shared this prayer request: "${item.prayer}"` : ""
            }`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.8,
            max_tokens: 150,
          });

          const text = completion.choices[0]?.message?.content ||
            `Pray for ${item.name}'s well-being and that you might be a light in their life today.`;

          return {
            itemId: item.id,
            text: text.trim(),
          };
        } catch (error) {
          console.error(`Error generating prompt for ${item.name}:`, error);
          // Fallback prompt if OpenAI fails for this item
          return {
            itemId: item.id,
            text: `Pray for ${item.name}'s well-being and that you might be a light in their life today.`,
          };
        }
      })
    );

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Error in prayer API:", error);
    return NextResponse.json(
      { error: "Failed to generate prayer prompts" },
      { status: 500 }
    );
  }
}