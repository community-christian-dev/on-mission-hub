import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bibleId = url.searchParams.get("bibleId") || "111";
    const passage = url.searchParams.get("passage") || "JHN.3";
    const format = url.searchParams.get("format") || "html";

    const apiKey = process.env.YOUVERSION_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing server API key" },
        { status: 500 },
      );
    }

    const externalUrl = `https://api.youversion.com/v1/bibles/${encodeURIComponent(
      bibleId,
    )}/passages/${encodeURIComponent(passage)}?format=${encodeURIComponent(
      format,
    )}&include_headings=false&include_notes=false`;

    const res = await fetch(externalUrl, {
      headers: { "X-YVP-App-Key": apiKey },
      next: { revalidate: 60 * 5 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Upstream error", details: text },
        { status: res.status },
      );
    }

    const body = await res.json();
    // return upstream body as-is — the client hook will normalize
    return NextResponse.json(body);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
