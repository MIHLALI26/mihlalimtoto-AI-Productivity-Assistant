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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Nexus AI" },
      { name: "description", content: "Get structured research briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(generateAI);
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [depth, setDepth] = useState("Briefing (1 page)");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic to research.");
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
                "You are a research analyst. Produce a Markdown briefing with sections: ## Overview, ## Key Facts (bulleted), ## Counterpoints / Risks, ## Open Questions. Be neutral, hedge uncertainty, and DO NOT fabricate citations or statistics — if uncertain, say so.",
            },
            {
              role: "user",
              content: `Topic: ${topic}\nAngle / specific question: ${angle || "(general overview)"}\nDepth: ${depth}`,
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
        eyebrow="Tool · Research"
        title="AI Research Assistant"
        description="Quickly gather structured background, facts, and counterpoints on any topic — then refine."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-4">
          <Field label="Topic">
            <TextInput
              placeholder="e.g. Decentralized SaaS infrastructure trends"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Field>

          <Field label="Specific angle or question" hint="Optional — narrows the briefing.">
            <TextArea
              rows={4}
              placeholder="Focus on adoption in APAC enterprise customers."
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            />
          </Field>

          <Field label="Depth">
            <Select value={depth} onChange={(e) => setDepth(e.target.value)}>
              <option>TL;DR (3 bullets)</option>
              <option>Briefing (1 page)</option>
              <option>Deep dive</option>
            </Select>
          </Field>

          <div className="flex justify-end pt-2">
            <PrimaryButton onClick={onGenerate} disabled={loading}>
              <Wand2 className="size-4" />
              {loading ? "Researching…" : "Run research"}
            </PrimaryButton>
          </div>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          rows={20}
          filename="research-brief.md"
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
