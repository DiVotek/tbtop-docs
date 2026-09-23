const ACCENT_CLASS: Record<"amber" | "acid" | "blue", string> = {
	amber: "bg-amber",
	acid: "bg-acid",
	blue: "bg-blue",
};

/** 3x2 grid of squares; the sixth cell is filled and offset as the brand's mark. */
export function GridMark({ accent }: { accent: "amber" | "acid" | "blue" }) {
	return (
		<span aria-hidden="true" className="grid grid-cols-3 grid-rows-2 gap-0.5">
			{Array.from({ length: 5 }, (_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid, order never changes
				<span key={index} className="size-1.5 rounded-[1px] bg-current opacity-20" />
			))}
			<span
				className={`size-1.5 translate-x-0.5 translate-y-0.5 rounded-[1px] ${ACCENT_CLASS[accent]}`}
			/>
		</span>
	);
}
