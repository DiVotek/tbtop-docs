import type { HTMLAttributes, ReactNode } from "react";

const TOKEN =
	/('[^']*')|(->\w+)|(\b[A-Z]\w*(?:::\w+)?)|(\bfn\b|\breturn\b|\bconst\b)|(\$\w+)|([^'$A-Za-z>-]+|\w+|.)/g;

const TOKEN_CLASS = [
	"text-amber",
	"text-runtime",
	"text-white",
	"text-acid",
	"text-white/80",
	"text-white/55",
];

/** Minimal token colouring for a few lines of PHP or TSX — strings, `->calls`, `Class::make`, keywords, `$vars`. */
function highlight(line: string): ReactNode[] {
	const parts: ReactNode[] = [];
	let match: RegExpExecArray | null;
	let key = 0;

	TOKEN.lastIndex = 0;

	// biome-ignore lint/suspicious/noAssignInExpressions: idiomatic regex-exec loop
	while ((match = TOKEN.exec(line)) !== null) {
		const group = match.slice(1).findIndex((value) => value !== undefined);

		parts.push(
			<span key={key++} className={TOKEN_CLASS[group] ?? "text-white/55"}>
				{match[0]}
			</span>,
		);
	}

	return parts;
}

/** A code plate with a file tab: fixed lines, mono ≥ 12px, no editor chrome beyond the tab. */
export function CodeCard({
	file,
	lines,
	minLines,
	className = "",
	...rest
}: {
	file: string;
	lines: string[];
	/** Reserve height for this many lines so swapping snippets does not move the layout. */
	minLines?: number;
	className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">) {
	return (
		<div
			{...rest}
			className={`overflow-hidden rounded-lg border border-white/12 bg-bench-deep text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${className}`}
		>
			<div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2 font-mono text-[11px] text-white/55">
				<i aria-hidden="true" className="size-1.5 rounded-full bg-amber" />
				{file}
			</div>
			<pre
				style={
					minLines !== undefined
						? { minHeight: `calc(${minLines}lh + 1.75rem)` }
						: undefined
				}
				className="m-0 overflow-x-auto px-4 py-3.5 font-mono text-[11px] leading-[1.7] md:text-[12.5px] md:leading-[1.65]"
			>
				{lines.map((line, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed static code lines, order never changes
					<code key={index} className="block whitespace-pre">
						{line === "" ? " " : highlight(line)}
					</code>
				))}
			</pre>
		</div>
	);
}
