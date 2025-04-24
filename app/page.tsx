"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

type Page = { text: string; imageUrl: string };

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const promptRef = useRef<HTMLInputElement>(null);

  const addPage = async () => {
    const prompt = promptRef.current?.value.trim();
    if (!prompt) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = (await res.json()) as Page;
    setPages((p) => [...p, data]);
    if (promptRef.current) promptRef.current.value = "";
  };

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
      <h1>AI Flipbook</h1>

      <input
        ref={promptRef}
        placeholder="Enter a prompt"
        style={{ width: 300, marginRight: 10, padding: 6 }}
      />
      <button onClick={addPage} style={{ padding: "6px 12px" }}>
        Add page
      </button>

      {pages.length > 0 && (
        <div style={{ marginTop: 40 }}>
{/* ① tell TypeScript to ignore the next line */}
{/* @ts-ignore */}
<HTMLFlipBook width={300} height={400}>
  {pages.map((p, i) => (
    <div key={i} style={{ padding: 10 }}>
      <img src={p.imageUrl} style={{ width: "100%" }} />
      <p>{p.text}</p>
    </div>
  ))}
</HTMLFlipBook>
        </div>
      )}
    </main>
  );
}
