import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Send, Sparkles, User } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIDisclaimer } from "@/components/AIDisclaimer";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chat — Nexus AI" },
      { name: "description", content: "Open-ended AI chat for whatever your workday needs." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are Nexus, a concise, helpful workplace assistant. Answer in clean Markdown, use short paragraphs, and ask a clarifying question only when the request is genuinely ambiguous.";

function ChatPage() {
  const run = useServerFn(generateAI);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Nexus. Ask me anything about your work: drafting, planning, analyzing, or just thinking out loud.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [{ role: "system", content: SYSTEM }, ...next],
        },
      });
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 flex flex-col min-h-0">
      <PageHeader
        eyebrow="Tool · Conversation"
        title="AI Chat"
        description="A general-purpose conversation thread with your workplace assistant."
      />

      <div className="flex-1 bg-surface rounded-xl border border-border shadow-sm flex flex-col min-h-[60vh] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Sparkles className="size-4" />
                </div>
              )}
              <div
                className={[
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm",
                ].join(" ")}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="size-8 rounded-lg bg-foreground/10 text-foreground grid place-items-center shrink-0">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Sparkles className="size-4" />
              </div>
              <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
                <span className="inline-flex gap-1">
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.1s]" />
                  <span className="size-1.5 rounded-full bg-current animate-bounce" />
                </span>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="border-t border-border p-3 md:p-4 flex gap-2 bg-background/50"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Message Nexus… (Shift+Enter for new line)"
            className="flex-1 resize-none px-4 py-3 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary max-h-40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="size-11 shrink-0 grid place-items-center bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>

      <AIDisclaimer />
    </div>
  );
}
