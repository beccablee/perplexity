import Groq from "groq-sdk";

import { env } from "./env";
import { WebDoc, AskOutput } from "./types";

const groq = new Groq({ apiKey: env.GROQ_API_KEY! });

export async function answerWithCitations(
  query: string,
  docs: WebDoc[]
): Promise<AskOutput> {
  // Flatten docs into a readable context
  const context = docs
    .map(
      (d) =>
        `[${d.id}] ${d.title}\n${(d.snippet ?? "")
          .replace(/\s+/g, " ")
          .slice(0, 600)}\nURL: ${d.url}`
    )
    .join("\n\n");

  const messages = [
    {
      role: "system",
      content:
        "You are a research assistant and you speak like an educator. Answer the prompt based on the provided sources and cite them in line. Structure it concisely and prioritize readability. Return your response as valid JSON with an 'answer' field and a 'citations' array.",
    },
    {
      role: "user",
      content: `Question: ${query}\n\nSources:\n${context}\n\nProvide a comprehensive answer based on these sources. Return strictly valid JSON in this format:
        {
          "answer": "Your detailed answer here, referencing sources and separating concepts with unformatted titles and line breaks to clearly distinguish them.",
          "citations": [{"id": "source_id", "url": "https://...", "title": "Source Title"}]
        }`,
    },
  ] as const;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages as any,
    temperature: 0.4, // higher = more natural responses
    response_format: { type: "json_object" }, // Added: Force JSON output
  });

  const text = completion.choices?.[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(text) as AskOutput;
    
    // Validate the response structure
    if (!parsed.answer || !Array.isArray(parsed.citations)) {
      throw new Error("Invalid response structure");
    }
    
    return parsed;
  } catch (error) {
    console.warn("Groq returned invalid JSON:", text);
    console.error("Parse error:", error);
    
    // Fallback: try to extract meaningful content
    return {
      answer: text || "Unable to generate a response. Please try again.",
      citations: [],
    };
  }
}