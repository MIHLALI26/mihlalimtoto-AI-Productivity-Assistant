import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/summarizer", label: "Notes Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Desk", icon: Search },
  { to: "/chatbot", label: "AI Chat", icon: MessageSquare },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary grid place-items-center font-display font-bold text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold tracking-tight text-base">Nexus AI</span>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-muted">
              Workplace OS
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-muted/80">
          Workspace
        </div>
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                  ? "bg-sidebar-active text-sidebar-foreground"
                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-active/60",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="size-9 rounded-full bg-primary/30 grid place-items-center text-xs font-semibold text-sidebar-foreground">
            AR
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Alex Rivera</span>
            <span className="text-[10px] text-sidebar-muted">Pro Plan · Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
