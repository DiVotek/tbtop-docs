import type { CSSProperties, PointerEvent } from "react";
import { useCallback, useState } from "react";

const MAX_DEG = 3;

/** A soft pointer-tilt for a stage element: up to ±3° on a fine pointer, nothing on touch or when motion is reduced. */
export function useTilt(): {
	style: CSSProperties;
	onPointerMove: (event: PointerEvent<HTMLElement>) => void;
	onPointerLeave: () => void;
} {
	const [rotate, setRotate] = useState<[number, number]>([0, 0]);

	const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
		if (
			event.pointerType !== "mouse" ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		const rect = event.currentTarget.getBoundingClientRect();
		const x = (event.clientX - rect.left) / rect.width - 0.5;
		const y = (event.clientY - rect.top) / rect.height - 0.5;

		setRotate([-y * MAX_DEG * 2, x * MAX_DEG * 2]);
	}, []);

	const onPointerLeave = useCallback(() => setRotate([0, 0]), []);

	return {
		style: {
			transform: `perspective(1400px) rotateX(${rotate[0].toFixed(2)}deg) rotateY(${rotate[1].toFixed(2)}deg)`,
		},
		onPointerMove,
		onPointerLeave,
	};
}
