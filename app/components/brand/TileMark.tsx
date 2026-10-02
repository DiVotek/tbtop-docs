import type { CSSProperties } from "react";

// Brand order, left to right, as on tbtop.dev; lime and pink appear only in logo marks.
const TILES = ["bg-violet", "bg-pink", "bg-amber", "bg-lime", "bg-cyan"];

/** The mini logo mark: five tile-coloured squares; while the brand lockup is hovered they spread and lift without moving the layout. */
export function TileMark() {
	return (
		<span aria-hidden="true" className="flex gap-[3px]">
			{TILES.map((tile, index) => (
				<i
					key={tile}
					style={{ "--spread": `${index - 2}px` } as CSSProperties}
					className={`block size-[9px] rounded-[2.5px] ${tile} motion-safe:transition-[translate] motion-safe:duration-200 motion-safe:group-hover/brand:translate-x-(--spread) motion-safe:group-hover/brand:-translate-y-px`}
				/>
			))}
		</span>
	);
}
