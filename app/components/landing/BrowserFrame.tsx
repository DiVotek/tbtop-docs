/** A browser window frame around a real product screenshot: three dots, an address pill and the image. */
export function BrowserFrame({
	src,
	alt,
	address,
	priority = false,
	className = "",
	imageClassName = "",
}: {
	src: string;
	alt: string;
	address: string;
	priority?: boolean;
	className?: string;
	/** Constrains the shot — e.g. a fixed `aspect-[…] object-contain` so frames of differently shaped shots keep one height. */
	imageClassName?: string;
}) {
	return (
		<figure
			className={`m-0 overflow-hidden rounded-xl border border-chrome-border bg-chrome shadow-[0_30px_80px_rgba(0,0,0,0.55)] ${className}`}
		>
			<div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-chrome-hairline bg-chrome-sunken px-3.5 py-2">
				<span aria-hidden="true" className="flex gap-1.5">
					<i className="size-2.5 rounded-full bg-chrome-dot" />
					<i className="size-2.5 rounded-full bg-chrome-dot" />
					<i className="size-2.5 rounded-full bg-chrome-dot" />
				</span>
				<span className="mx-auto w-full max-w-[320px] truncate rounded-md bg-chrome-pill px-3 py-1 text-center font-mono text-[11px] text-chrome-text">
					{address}
				</span>
				<span aria-hidden="true" className="w-9" />
			</div>
			<img
				src={src}
				alt={alt}
				loading={priority ? "eager" : "lazy"}
				fetchPriority={priority ? "high" : "auto"}
				decoding="async"
				className={`block w-full ${imageClassName}`}
			/>
		</figure>
	);
}
