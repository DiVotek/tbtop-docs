#!/usr/bin/env tsx
/**
 * Checks that every internal link on every prerendered page resolves to a
 * file that was actually built. Run against `build/client` after `npm run
 * build`, via `npm run check:links` (a gate — see CLAUDE.md).
 *
 * A link resolves when one of these exists under `build/client`:
 *   - `<href>/index.html` (a route, e.g. /docs/api/builder)
 *   - `<href>` itself (a static asset, e.g. /favicon.svg)
 * Links are read from `href="..."` and `src="..."` attributes in the
 * prerendered HTML. External links (http/https/mailto/tel), hash-only
 * links, and non-http(s) protocols are skipped.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(ROOT, "..", "build", "client");

if (!existsSync(BUILD_DIR)) {
	console.error(`Build output not found at ${BUILD_DIR} — run \`npm run build\` first.`);
	process.exit(1);
}

function findHtmlFiles(dir: string): string[] {
	const out: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = path.join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) {
			out.push(...findHtmlFiles(full));
		} else if (entry.endsWith(".html")) {
			out.push(full);
		}
	}
	return out;
}

function extractLinks(html: string): string[] {
	const links: string[] = [];
	const re = /\s(?:href|src)="([^"]+)"/g;
	let match: RegExpExecArray | null;
	// biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
	while ((match = re.exec(html))) {
		links.push(match[1]);
	}
	return links;
}

// A link is internal and checkable when it's a root-relative path, not an
// external URL, mailto/tel link, protocol-relative URL or bare hash.
const INTERNAL_HREF = /^\/(?!\/)/;

const htmlFiles = findHtmlFiles(BUILD_DIR);
let checked = 0;
let broken = 0;

for (const file of htmlFiles) {
	const html = readFileSync(file, "utf8");
	const pageUrl = `/${path.relative(BUILD_DIR, file)}`;
	const links = extractLinks(html).filter(
		(href) => INTERNAL_HREF.test(href) && !href.startsWith("#"),
	);

	for (const href of links) {
		checked++;

		const [pathname] = href.split("#");
		const [cleanPath] = pathname.split("?");
		const trimmed = cleanPath.replace(/^\/+/, "");
		const resolved =
			cleanPath === "/" || cleanPath === ""
				? existsSync(path.join(BUILD_DIR, "index.html"))
				: existsSync(path.join(BUILD_DIR, trimmed)) ||
					existsSync(path.join(BUILD_DIR, trimmed, "index.html"));

		if (!resolved) {
			broken++;
			console.error(`broken link: ${href}  (on ${pageUrl})`);
		}
	}
}

console.log(`Checked ${checked} internal links across ${htmlFiles.length} pages.`);

if (broken > 0) {
	console.error(`${broken} broken link(s) found.`);
	process.exit(1);
}
