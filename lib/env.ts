import { z } from "zod";

const EnvSchema = z.object({
  // OPENAI_API_KEY: z.string().min(10, "OPENAI_API_KEY missing"),
  GROQ_API_KEY: z.string().min(10, "GROQ_API_KEY missing"),
  SERPAPI_API_KEY: z.string().min(10, "SERPAPI_API_KEY missing"),
});

export const env = EnvSchema.parse({
  // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
});
