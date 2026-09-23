import { Check } from "lucide-react";
import { BrowserFrame } from "./BrowserFrame";
import { CodeCard } from "./CodeCard";
import { Crossfade } from "./Crossfade";
import type { HeroSnippet } from "./snippets";
import { SNIPPET_CODE } from "./snippets";
import { useCycle } from "./useCycle";
import { useTilt } from "./useTilt";

// Reserve the tallest snippet's height so switching chips never moves the layout.
const SNIPPET_LINES = Math.max(
	...Object.values(SNIPPET_CODE).map((snippet) => snippet.lines.length),
);

export interface HeroChip {
	text: string;
	snippet: HeroSnippet | null;
}

const STEP_MS = 3400;

/** The hero's right column: capability chips that double as tabs, the real page editor in a browser frame, and a code plate that fades to the active chip's snippet. */
export function HeroStage({ chips }: { chips: HeroChip[] }) {
	const tabs = chips.filter(
		(chip): chip is HeroChip & { snippet: HeroSnippet } => chip.snippet !== null,
	);
	const [active, pick] = useCycle(Math.max(tabs.length, 1), STEP_MS, 0);
	const tilt = useTilt();
	const snippet = tabs[active]?.snippet ?? null;

	return (
		<div className="relative min-w-0">
			{chips.length > 0 ? (
				<ul className="m-0 mb-5 flex list-none flex-wrap gap-2 p-0">
					{chips.map((chip, index) => {
						const tabIndex = tabs.indexOf(chip as HeroChip & { snippet: HeroSnippet });
						const isActive = tabIndex === active;
						const base =
							"inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 font-mono text-[11px] backdrop-blur transition-colors duration-500 ease-out motion-safe:animate-rise-in md:min-h-8";

						return (
							<li
								key={chip.text}
								style={{
									animationDelay: `${260 + index * 45}ms`,
								}}
								className="contents"
							>
								{tabIndex === -1 ? (
									<span
										className={`${base} border-border-default bg-surface/60 text-text-secondary`}
									>
										<Check
											aria-hidden="true"
											className="size-3 text-accent-strong"
										/>
										{chip.text}
									</span>
								) : (
									<button
										type="button"
										aria-pressed={isActive}
										onClick={() => pick(tabIndex)}
										className={`${base} cursor-pointer ${
											isActive
												? "border-amber/60 bg-amber/12 text-accent-strong"
												: "border-border-default bg-surface/60 text-text-secondary hover:border-border-emphasis hover:text-text"
										}`}
									>
										<Check
											aria-hidden="true"
											className={`size-3 transition-colors duration-500 ${
												isActive ? "text-accent-strong" : "text-text-muted"
											}`}
										/>
										{chip.text}
									</button>
								)}
							</li>
						);
					})}
				</ul>
			) : null}

			<div
				onPointerMove={tilt.onPointerMove}
				onPointerLeave={tilt.onPointerLeave}
				style={{ ...tilt.style, animationDelay: "320ms" }}
				className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-safe:animate-rise-in lg:pb-24"
			>
				<BrowserFrame
					priority
					src="/images/home/admin-editor.webp"
					alt="The Tabletop admin: a page editor with block tabs, an SEO tab and a publication panel with schedule fields"
					address="yourapp.test/admin/pages/1/edit"
					className="lg:ml-10"
				/>

				{snippet ? (
					<Crossfade
						id={snippet}
						className="mt-4 lg:absolute lg:bottom-0 lg:left-0 lg:w-[78%] lg:[transform:translateZ(30px)]"
					>
						{(id) => (
							<CodeCard
								file={SNIPPET_CODE[id].file}
								lines={SNIPPET_CODE[id].lines}
								minLines={SNIPPET_LINES}
							/>
						)}
					</Crossfade>
				) : null}
			</div>
		</div>
	);
}
