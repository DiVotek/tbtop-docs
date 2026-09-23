import { GridMark } from "./GridMark";

/** The Tabletop brand lockup used as the nav title: mark, wordmark, and a small mono label for this site. */
export function BrandMark() {
	return (
		<span className="flex items-center gap-3">
			<GridMark accent="amber" />
			<span className="font-semibold">Tabletop</span>
			<span aria-hidden="true" className="h-4 w-px bg-fd-border" />
			<span className="font-mono text-xs tracking-wider text-fd-muted-foreground uppercase">
				DOCS
			</span>
		</span>
	);
}
