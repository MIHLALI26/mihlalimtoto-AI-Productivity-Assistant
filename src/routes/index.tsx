import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { AIDisclaimer } from "../components/AIDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nexus AI" },
      {
        name: "description",
        content: "Your AI workplace command center: emails, summaries, tasks, research, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails from a few bullet points and a tone.",
    accent: "from-indigo-500/20 to-indigo-500/0",
  },
  {
    to: "/summarizer" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw transcripts into executive summaries and action items.",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    to: "/planner" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    desc: "Break a goal into sequenced, prioritized tasks with timelines.",
    accent: "from-amber-500/20 to-amber-500/0",
  },
  {
    to: "/research" as const,
    icon: Search,
    title: "AI Research Assistant",
    desc: "Get structured briefings, key facts, and counterpoints on any topic.",
    accent: "from-sky-500/20 to-sky-500/0",
  },
  {
    to: "/chatbot" as const,
    icon: MessageSquare,
    title: "AI Chat",
    desc: "Open-ended conversation for whatever the moment requires.",
    accent: "from-rose-500/20 to-rose-500/0",
  },
];

function Dashboard() {
  return (
    <>
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-foreground font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
            <Activity className="size-3" /> AI Online
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 space-y-8">
        <section>
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            Good morning, Alex
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-balance max-w-3xl">
            Your AI workplace, ready when you are.
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl text-pretty">
            Five focused tools that handle the busywork — drafting, summarizing, planning,
            researching, and chatting — so you can spend your day on what actually matters.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="group relative overflow-hidden bg-surface rounded-xl border border-border shadow-sm p-6 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative flex items-start justify-between">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <Icon className="size-5" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="relative mt-4 font-display font-bold text-foreground">{t.title}</h3>
                <p className="relative mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </Link>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-primary" />
              <h3 className="font-display font-bold">What's new</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <span className="font-medium text-foreground">Editable outputs</span>{" "}
                  <span className="text-muted-foreground">
                    — every AI response is yours to refine before sending.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <span className="font-medium text-foreground">Structured prompts</span>{" "}
                  <span className="text-muted-foreground">
                    — guided fields so you get useful results on the first try.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <span className="font-medium text-foreground">Chat assistant</span>{" "}
                  <span className="text-muted-foreground">
                    — ask anything in a conversational thread.
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <AIDisclaimer />
        </section>
      </div>
    </>
  );
}
