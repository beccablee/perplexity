import { env } from "./env";
import { WebDoc } from "./types";

export async function webSearch(query: string, k = 5): Promise<WebDoc[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(k));
  url.searchParams.set("api_key", env.SERPAPI_API_KEY!);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("SerpAPI request failed");
  const data = await res.json();
  const organic_res = data.organic_results ?? [];

  return organic_res.slice(0, k).map((r: any, i: number) => ({
    id: `s${i + 1}`,
    title: r.title,
    url: r.link,
    snippet: r.snippet,
    image: r.image || null,
    favicon: r.favicon || null,
  }));
}
