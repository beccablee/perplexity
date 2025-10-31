export type WebImage = {
  id: string;
  title?: string;
  source?: string;
  link?: string;        // page url
  thumbnail: string;    // small img (safe for grid)
  original?: string;    // big img
};

export async function imageSearch(query: string, k = 8): Promise<WebImage[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_images");
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(k));
  url.searchParams.set("api_key", process.env.SERPAPI_API_KEY!);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`SerpAPI image search failed: ${res.status}`);

  const data = await res.json();
  const items = data.images_results ?? [];

  return items.slice(0, k).map((r: any, i: number) => ({
    id: `img${i + 1}`,
    title: r.title,
    source: r.source,
    link: r.link,                // landing page
    thumbnail: r.thumbnail,      // grid-friendly
    original: r.original ?? r.thumbnail,
  }));
}
