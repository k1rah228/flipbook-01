import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // text
  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  const generatedText = chat.choices[0].message.content;

  // image
  const img = await openai.images.generate({
    prompt,
    n: 1,
    size: "512x512",
  });

  return NextResponse.json({
    text: generatedText,
    imageUrl: img.data[0].url,
  });
}
