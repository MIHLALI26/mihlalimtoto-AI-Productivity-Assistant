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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Nexus AI" },
      { name: "description", content: "Break any goal into a sequenced, prioritized task plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(generateAI);
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [horizon, setHorizon] = useState("This week");
  const [style, setStyle] = useState("Sequential");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!goal.trim()) {
      toast.error("Describe the goal you want to plan.");
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
                "You are an expert project planner. Output a Markdown task plan with: a one-line objective, then a numbered list of tasks. Each task: '**Task** — priority (P1/P2/P3) — estimated effort — owner placeholder'. End with a 'Risks' section.",
            },
            {
              role: "user",
              content: `Goal: ${goal}\nTime horizon: ${horizon}\nPlanning style: ${style}\nExtra context: ${context || "(none)"}`,
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
        eyebrow="Tool · Planning"
        title="AI Task Planner"
        description="Tell the assistant what you're trying to accomplish — get an ordered, prioritized plan back."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-4">
          <Field label="Objective / goal">
            <TextInput
              placeholder="Launch the Q3 brand refresh internally"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </Field>

          <Field label="Background & constraints" hint="Optional. The more you share, the sharper the plan.">
            <TextArea
              rows={5}
              placeholder="Two designers, one engineer. Approval needed from legal before publishing..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Time horizon">
              <Select value={horizon} onChange={(e) => setHorizon(e.target.value)}>
                <option>Today</option>
                <option>This week</option>
                <option>This sprint (2 weeks)</option>
                <option>This quarter</option>
              </Select>
            </Field>
            <Field label="Style">
              <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option>Sequential</option>
                <option>Parallel tracks</option>
                <option>Agile / iterative</option>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <PrimaryButton onClick={onGenerate} disabled={loading}>
              <Wand2 className="size-4" />
              {loading ? "Planning…" : "Generate plan"}
            </PrimaryButton>
          </div>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          rows={20}
          filename="task-plan.md"
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
