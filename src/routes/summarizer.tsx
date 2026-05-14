import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { OutputPanel } from "@/components/OutputPanel";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { Field, TextArea, Select, PrimaryButton } from "@/components/Field";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Nexus AI" },
      {
        name: "description",
        content: "Turn raw meeting transcripts into clean summaries and action items.",
      },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const run = useServerFn(generateAI);
  const [transcript, setTranscript] = useState("");
  const [depth, setDepth] = useState("Executive Summary");
  const [audience, setAudience] = useState("Internal Team");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!transcript.trim()) {
      toast.error("Paste a transcript or notes first.");
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
                "You are a meticulous meeting analyst. Output Markdown with three sections: ## Summary, ## Decisions, ## Action Items (each item: '- [ ] Owner — task — due'). Keep it factual and concise.",
            },
            {
              role: "user",
              content: `Summary depth: ${depth}\nAudience: ${audience}\n\nTranscript / notes:\n${transcript}`,
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
        eyebrow="Tool · Knowledge"
        title="Meeting Notes Summarizer"
        description="Paste a transcript or rough notes and get a structured summary with clear next steps."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-4">
          <Field label="Transcript or raw notes">
            <TextArea
              rows={14}
              placeholder="Paste meeting transcript or bullet notes here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Summary depth">
              <Select value={depth} onChange={(e) => setDepth(e.target.value)}>
                <option>Executive Summary</option>
                <option>Detailed Recap</option>
                <option>Action Items Only</option>
              </Select>
            </Field>
            <Field label="Audience">
              <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option>Internal Team</option>
                <option>Leadership</option>
                <option>External Client</option>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <PrimaryButton onClick={onGenerate} disabled={loading}>
              <Wand2 className="size-4" />
              {loading ? "Summarizing…" : "Summarize"}
            </PrimaryButton>
          </div>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          rows={20}
          filename="meeting-summary.md"
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
