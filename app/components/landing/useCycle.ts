import { useCallback, useEffect, useState } from "react";

/** Cycles `[0, length)` every `ms` from `startAt` (default 0); `prefers-reduced-motion` pins at `startAt`, or the last index when `startAt` is omitted. A manual pick stops the cycle for good — the reader chose a tab, so it must stay. */
export function useCycle(
	length: number,
	ms: number,
	startAt?: number,
): [number, (index: number) => void] {
	const reducedMotion = () =>
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const [index, setIndex] = useState(() =>
		startAt !== undefined ? startAt : reducedMotion() ? length - 1 : 0,
	);
	const [isPaused, setIsPaused] = useState(false);

	const pick = useCallback((next: number) => {
		setIsPaused(true);
		setIndex(next);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reducedMotion is a fresh closure every render; adding it would reset the interval on every render instead of only on length/ms/isPaused changes
	useEffect(() => {
		if (isPaused || reducedMotion()) {
			return;
		}

		let timer: number | undefined;

		const start = () => {
			timer = window.setInterval(() => {
				setIndex((current) => (current + 1) % length);
			}, ms);
		};

		const stop = () => {
			if (timer !== undefined) {
				window.clearInterval(timer);
				timer = undefined;
			}
		};

		const onVisibilityChange = () => {
			if (document.hidden) {
				stop();
			} else {
				start();
			}
		};

		if (!document.hidden) {
			start();
		}

		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			stop();
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [length, ms, isPaused]);

	return [index, pick];
}
