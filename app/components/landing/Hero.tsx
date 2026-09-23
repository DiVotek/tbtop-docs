import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CopyCommand } from "./CopyCommand";
import type { HeroChip } from "./HeroStage";
import { HeroStage } from "./HeroStage";
import { StageBackdrop } from "./StageBackdrop";

export interface HeroProps {
	eyebrow: string | null;
	heading: string;
	accent: string | null;
	lead: string | null;
	bullets: HeroChip[];
	command: string | null;
	facts: string[];
}

/** The landing page's opening section: copy, two CTAs and the install command on the left, the product stage on the right. */
export function Hero({ eyebrow, heading, accent, lead, bullets, command, facts }: HeroProps) {
	return (
		<section
			id="top"
			className="relative overflow-hidden bg-surface pt-20 pb-16 text-text md:pt-28 md:pb-20"
		>
			<StageBackdrop />

			<div className="relative mx-auto max-w-6xl px-4">
				<div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
					<div className="max-w-[600px] min-w-0">
						{eyebrow ? (
							<p className="m-0 inline-flex items-center gap-2.5 rounded-full border border-border-default bg-surface-raised py-1.5 pr-3.5 pl-2.5 font-mono text-[11px] font-medium tracking-[0.08em] text-text-secondary uppercase motion-safe:animate-rise-in sm:tracking-[0.12em]">
								<span aria-hidden="true" className="relative flex size-2">
									<span className="absolute inset-0 rounded-full bg-amber/60 motion-safe:animate-ping" />
									<span className="relative size-2 rounded-full bg-amber" />
								</span>
								{eyebrow}
							</p>
						) : null}

						<h1
							style={{ animationDelay: "80ms" }}
							className="m-0 mt-7 text-[clamp(2.5rem,4.3vw,3.7rem)] leading-[1.04] font-extrabold tracking-[-0.04em] text-balance motion-safe:animate-rise-in"
						>
							{heading}
							{accent ? (
								<span className="block font-medium text-accent-strong">
									{accent}
								</span>
							) : null}
						</h1>

						{lead ? (
							<p
								style={{ animationDelay: "160ms" }}
								className="m-0 mt-6 max-w-[560px] text-[19px] leading-[1.6] text-text-secondary motion-safe:animate-rise-in"
							>
								{lead}
							</p>
						) : null}

						<div
							style={{ animationDelay: "240ms" }}
							className="mt-8 flex flex-col gap-3 motion-safe:animate-rise-in sm:flex-row"
						>
							<Link
								to="/docs"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-amber px-6 text-[14px] font-semibold text-on-accent transition-colors hover:bg-white"
							>
								Get started
								<ArrowRight className="size-4" />
							</Link>
							<a
								href="https://demo.tbtop.dev"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface-raised px-6 text-[14px] font-semibold text-text transition-colors hover:border-runtime/50 hover:bg-runtime/8"
							>
								Try the demo
							</a>
						</div>

						{command ? (
							<div
								style={{ animationDelay: "320ms" }}
								className="mt-8 motion-safe:animate-rise-in"
							>
								<CopyCommand command={command} />
							</div>
						) : null}

						{facts.length > 0 ? (
							<p
								style={{ animationDelay: "380ms" }}
								className="m-0 mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-text-tertiary motion-safe:animate-rise-in"
							>
								{facts.map((fact, index) => (
									<span key={fact} className="flex items-center gap-2.5">
										{fact}
										{index < facts.length - 1 ? (
											<span aria-hidden="true" className="text-text/25">
												·
											</span>
										) : null}
									</span>
								))}
							</p>
						) : null}
					</div>

					<HeroStage chips={bullets} />
				</div>
			</div>
		</section>
	);
}
