import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
          {eyebrow}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground text-balance">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl text-pretty">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
