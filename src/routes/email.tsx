import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { OutputPanel } from "@/components/OutputPanel";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { Field, TextInput, TextArea, Select, PrimaryButton } from "@/components/Field";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Nexus AI" },
      { name: "description", content: "Draft professional emails in seconds with structured AI prompts." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateAI);
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Concise");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!context.trim()) {
      toast.error("Add some context first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [
            {
              role: "system",
              content:
                "You are an expert business writer. Produce clear, well-structured emails. Always include a Subject line on the first row prefixed with 'Subject: '. Match the requested tone and length.",
            },
            {
              role: "user",
              content: `Recipient role: ${recipient || "Colleague"}\nTone: ${tone}\nLength: ${length}\n\nContext / key points:\n${context}\n\nWrite the email now.`,
            },
          ],
        },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      <PageHeader
        eyebrow="Tool · Communication"
        title="Smart Email Generator"
        description="Define recipient, context, and tone — get a polished draft you can edit before sending."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-4">
          <Field label="Recipient role">
            <TextInput
              placeholder="e.g. Project Manager, Client, Direct Report"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </Field>

          <Field label="Context & key points" hint="Bullet points work best.">
            <TextArea
              rows={6}
              placeholder="Discussing the delay in Q3 deliverables and proposing a new timeline..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tone">
              <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option>Professional</option>
                <option>Friendly</option>
                <option>Diplomatic</option>
                <option>Urgent</option>
                <option>Apologetic</option>
              </Select>
            </Field>
            <Field label="Length">
              <Select value={length} onChange={(e) => setLength(e.target.value)}>
                <option>Concise</option>
                <option>Standard</option>
                <option>Detailed</option>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <PrimaryButton onClick={onGenerate} disabled={loading}>
              <Wand2 className="size-4" />
              {loading ? "Drafting…" : "Generate draft"}
            </PrimaryButton>
          </div>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          filename="email-draft.txt"
          placeholder="Your AI-generated email draft will appear here. Edit it freely before copying."
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
