import { NextRequest, NextResponse } from "next/server";
import { webSearch } from "@/lib/search";
import { answerWithCitations } from "@/lib/llm";
import { imageSearch } from "@/lib/imageSearch"; // ⬅️ add this import

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const docs = await webSearch(query, 5);
    const images = await imageSearch(query, 5); // ⬅️ fetch images
    if (docs.length === 0) {
      return NextResponse.json({ answer: "No results found.", citations: [] });
    }

    // return NextResponse.json({ web: docs });
    const aggregate = await answerWithCitations(query, docs);
    // Potentially could feed the images into the LLM as well for a unique decriptive answer
    return NextResponse.json({"aggregate": aggregate, "web": docs, "images": images});
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
