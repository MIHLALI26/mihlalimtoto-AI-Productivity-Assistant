import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
} from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/email", label: "Email", icon: Mail },
  { to: "/summarizer", label: "Notes", icon: FileText },
  { to: "/planner", label: "Tasks", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chatbot", label: "Chat", icon: MessageSquare },
] as const;

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar text-sidebar-foreground border-t border-white/10 flex items-stretch justify-around px-1 py-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={[
              "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-md text-[10px] font-medium",
              active ? "text-sidebar-foreground bg-sidebar-active" : "text-sidebar-muted",
            ].join(" ")}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
