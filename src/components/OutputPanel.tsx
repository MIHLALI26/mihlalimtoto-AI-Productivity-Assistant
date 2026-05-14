import { Copy, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface OutputPanelProps {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  placeholder?: string;
  filename?: string;
  rows?: number;
}

export function OutputPanel({
  value,
  onChange,
  loading,
  placeholder = "AI output will appear here. You can edit it before using.",
  filename = "nexus-ai-output.txt",
  rows = 14,
}: OutputPanelProps) {
  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-xs font-semibold">Editable AI Output</span>
          {loading ? (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider animate-pulse">
              Generating
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Copy className="size-3" /> Copy
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!value}
            className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Download className="size-3" /> Export
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-5 text-sm leading-relaxed bg-surface text-foreground focus:outline-none resize-y font-sans"
      />
    </div>
  );
}
