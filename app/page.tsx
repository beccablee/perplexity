"use client";
import { useState } from "react";
import Image from "next/image";

type Citation = { id: string; url: string; title?: string };
type Resp = { answer: string; citations: Citation[] };
type Result = { id: string; title: string; url: string; snippet?: string, image?: string, favicon?: string };

export default function Home() {

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<Resp | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [hideSearch, setHideSearch] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResp(null);
    setResults([]);
    setImages([]);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setImages(data.images);
      setHideSearch(true);
      setResults(data.web);
      setResp(data.aggregate);
      // note images not being returned form general web
      // console.log("RES", JSON.stringify(data.web[0]));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <div className="mx-auto min-h-screen flex max-w-3xl flex-col items-center justify-center px-4 py-24 sm:py-36">
        {
          !hideSearch ? 
            <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              perplexity
            </h1>
          : null
        }
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
        
        {
          !hideSearch ?
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="submit"
              disabled={!query || loading}
              className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </form> :
          <div className="flex flex-row items-center">
            <p className="text-gray-400">You asked: {query}</p>
            <button
              onClick={() => {
                setHideSearch(false);
                setResp(null);
                setResults([]);
                setImages([]);
                setQuery("");
              }}
              className="px-4 py-2 text-white text-xs font-semibold rounded bg-amber-500 ml-4"
            >
              New Question
            </button>
          </div>
          }

        {error && <p className="text-red-600 mt-2">Error: {error}</p>}

        {/* Image Results */}
        {!!images.length && (
          <div className="mt-6">
            {/* hide scrollbar (optional) */}
            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-3 min-w-max">
                {images.map((img: any) => (
                  <a
                    key={img.id}
                    href={img.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="relative h-28 w-44 flex-none overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                  >
                    <Image
                      src={img.thumbnail}
                      alt={img.title || "image"}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="176px"  // matches w-44
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WEB results */}
        {!!results.length && (
          <div className="-mx-8 mt-6 w-[calc(100%+16rem)] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">            
            {results.slice(0, 5).map((r) => (
              <a
                key={r.id}
                href={r.url}
                className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 hover:bg-zinc-800 transition"
              >
                {/* row for favicon website with icons centered on row */}
                <div className="flex items-center gap-2">
                  {r.favicon && (
                    <div className="relative h-5 w-5">
                      <Image
                        src={r.favicon}
                        alt={r.title || "favicon"}
                        fill
                        className="object-contain rounded-4xl"
                        unoptimized
                      />
                    </div>
                  )}
                  <h2 className="text-xs font-semibold text-yellow-400 line-clamp-2">
                    {r.title}
                  </h2>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-3 mt-1">{r.snippet}</p>
                <p className="text-[10px] text-zinc-500 mt-2 truncate">{r.url}</p>
              </a>
            ))}
          </div>
        )}

        {/* AGGREGATED / AI results */}
        {resp && (
          <section className="space-y-3 pt-6">
            <p className="whitespace-pre-wrap leading-normal">{resp.answer}</p>
            <div className="text-sm text-gray-600">
              Sources:&nbsp;
              {resp.citations.map((c, i) => (
                <a key={i} href={c.url} target="_blank" className="underline mr-2">
                  [{i + 1}] {c.title ?? c.url}
                </a>
              ))}
            </div>
          </section>
        )}
        
      </div>
    </div>
  );
}
