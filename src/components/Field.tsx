import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const baseInput =
  "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[baseInput, props.className ?? ""].join(" ")} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[baseInput, "resize-y min-h-[96px]", props.className ?? ""].join(" ")}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={[baseInput, "pr-8", props.className ?? ""].join(" ")} />;
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2",
        props.className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
