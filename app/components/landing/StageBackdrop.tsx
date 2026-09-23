/** Ambient hero backdrop: two soft radial glows (amber, runtime), a faint dot field and dashed column rules aligned to the content container. */
export function StageBackdrop() {
	return (
		<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
			<div className="absolute -top-48 left-1/2 h-[620px] w-[980px] -translate-x-[72%] rounded-full bg-amber/12 blur-[150px]" />
			<div className="absolute top-24 right-0 h-[560px] w-[680px] translate-x-1/3 rounded-full bg-runtime/10 blur-[150px]" />
			<div
				className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0,black_60%,transparent_100%)] opacity-70"
				style={{
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.085) 1px, transparent 1px)",
					backgroundSize: "22px 22px",
				}}
			/>
			<div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
				{["left-4", "left-1/4", "left-1/2", "left-3/4", "right-4"].map((position) => (
					<i
						key={position}
						className={`absolute inset-y-0 border-l border-dashed border-border-hairline ${position}`}
					/>
				))}
			</div>
		</div>
	);
}
