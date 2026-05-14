import { ShieldAlert } from "lucide-react";

export function AIDisclaimer() {
  return (
    <div className="bg-foreground text-background/80 p-4 rounded-xl flex items-start gap-3">
      <div className="size-7 shrink-0 rounded-lg bg-background/10 grid place-items-center text-background">
        <ShieldAlert className="size-4" />
      </div>
      <p className="text-[11px] leading-relaxed">
        <strong className="text-background font-semibold">Responsible AI:</strong> Nexus AI is
        designed to assist, not replace, professional judgment. Outputs may contain inaccuracies,
        bias, or outdated information — please review and edit all AI-generated content before
        sending or sharing. Avoid submitting confidential client data, credentials, or regulated PII.
      </p>
    </div>
  );
}
