import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  model: z.string().optional(),
});

export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: data.model ?? "google/gemini-3-flash-preview",
        messages: data.messages,
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      if (res.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to your workspace.");
      }
      const text = await res.text();
      console.error("AI gateway error:", res.status, text);
      throw new Error("AI request failed. Please try again.");
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });
