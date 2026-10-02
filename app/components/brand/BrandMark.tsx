import { TileMark } from "./TileMark";

/** The Tabletop brand lockup used as the nav title: mark, wordmark, and a small mono label for this site. */
export function BrandMark() {
	return (
		<span className="group/brand flex items-center gap-3">
			<TileMark />
			<span className="font-semibold">Tabletop</span>
			<span aria-hidden="true" className="h-4 w-px bg-fd-border" />
			<span className="font-mono text-xs tracking-wider text-fd-muted-foreground uppercase">
				DOCS
			</span>
		</span>
	);
}
