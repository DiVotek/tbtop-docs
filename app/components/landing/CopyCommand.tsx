import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

/** A one-line shell command with a copy button; the check mark confirms for a moment, then reverts. */
export function CopyCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) {
			return;
		}

		const timer = window.setTimeout(() => setCopied(false), 1800);

		return () => window.clearTimeout(timer);
	}, [copied]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
		} catch {
			// Clipboard is unavailable (insecure context, permissions) — the
			// command is still selectable text.
		}
	};

	return (
		<div className="inline-flex w-full max-w-full items-center gap-3 rounded-md border border-white/12 bg-bench-deep/80 py-1.5 pr-1.5 pl-3.5 font-mono text-[13px] text-white/85 sm:w-auto">
			<span aria-hidden="true" className="text-amber">
				$
			</span>
			<code className="min-w-0 [scrollbar-width:none] overflow-x-auto whitespace-nowrap">
				{command}
			</code>
			<button
				type="button"
				onClick={copy}
				aria-label={copied ? "Copied" : "Copy command"}
				className="inline-flex size-9 shrink-0 items-center justify-center rounded border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white"
			>
				{copied ? (
					<Check className="size-3.5 text-ok-soft" />
				) : (
					<Copy className="size-3.5" />
				)}
			</button>
		</div>
	);
}
