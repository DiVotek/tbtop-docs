import type { ReactNode } from "react";
import { useState } from "react";

/** Fades between renders of `children` when `id` changes; the outgoing copy holds the same grid cell until the fade-in ends, so an opaque child never flickers. Called for the outgoing id too, so `children` must render from the id alone. */
export function Crossfade<Id extends string>({
	id,
	className = "",
	children,
}: {
	id: Id;
	className?: string;
	children: (id: Id) => ReactNode;
}) {
	const [shown, setShown] = useState<{
		current: Id;
		previous: Id | null;
	}>({ current: id, previous: null });

	if (shown.current !== id) {
		setShown({ current: id, previous: shown.current });
	}

	return (
		<div className={`grid min-w-0 ${className}`}>
			{shown.previous !== null && shown.previous !== id ? (
				<div
					key={`out-${shown.previous}`}
					aria-hidden="true"
					className="pointer-events-none min-w-0 [grid-area:1/1] motion-reduce:hidden"
				>
					{children(shown.previous)}
				</div>
			) : null}
			<div
				key={id}
				aria-live="polite"
				onAnimationEnd={() => setShown((state) => ({ ...state, previous: null }))}
				className="min-w-0 [grid-area:1/1] motion-safe:animate-soft-fade"
			>
				{children(id)}
			</div>
		</div>
	);
}
