#!/usr/bin/env node
// Assembles content/docs/*.mdx + meta.json from docs-raw.json (see dump-docs.php) using
// richtext-to-mdx.mjs for the body. Run: node build-mdx.mjs docs-raw.json <output-dir>
// See README.md for full usage.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { richtextToMarkdown } from "./richtext-to-mdx.mjs";

const [, , rawPath, outDir] = process.argv;
if (!rawPath || !outDir) {
	console.error("usage: node build-mdx.mjs <docs-raw.json> <output-dir>");
	process.exit(1);
}

const pages = JSON.parse(readFileSync(rawPath, "utf8"));

// Old site path (relative to docs/) -> new docs URL. Populated below once the tree is known.
const linkMap = new Map();
for (const p of pages) {
	if (p.path === "docs") continue;
	const newPath = p.path.replace(/^docs\//, "");
	linkMap.set(`/${p.path}`, `/docs/${newPath}`);
}
linkMap.set("/docs", "/docs");
// extensions/cms stays on the marketing site; not part of this doc tree.
linkMap.set("/extensions/cms", "https://tbtop.dev/extensions/cms");

const allUnhandled = [];
const written = [];

const CMS_STUB = `This page is a placeholder for the Tabletop CMS documentation. The CMS is in closed
beta — see [tbtop.dev/extensions/cms](https://tbtop.dev/extensions/cms) for status and how
to request access. Docs land here once the beta opens.
`;

for (const page of pages) {
	if (page.path === "docs") {
		// The Fumadocs /docs index is the template's own generated page; nothing to write here.
		continue;
	}

	const relPath = page.path.replace(/^docs\//, ""); // e.g. getting-started/install
	const isCategory = page.type === "category";
	const CMS_DESCRIPTION = "The Tabletop CMS is in closed beta; its docs land here once it opens.";
	const description =
		page.path === "docs/packages/cms"
			? CMS_DESCRIPTION
			: (page.seoDescription ?? page.summary ?? undefined);

	let body;
	if (page.path === "docs/packages/cms") {
		body = CMS_STUB;
	} else if (isCategory) {
		// Category pages carry no body in the source (see PagesSeeder::editorial()); Fumadocs
		// renders the section index from meta.json, so no MDX file is needed for them either.
		continue;
	} else {
		const { markdown, unhandled } = richtextToMarkdown(page.body.root, linkMap);
		body = markdown;
		for (const u of unhandled) allUnhandled.push(`${page.path}: ${u}`);
	}

	const frontmatter = ["---", `title: ${yamlString(page.title)}`];
	if (description) frontmatter.push(`description: ${yamlString(description)}`);
	frontmatter.push("---", "");

	const mdx = `${frontmatter.join("\n")}\n${body}`;
	const filePath = join(outDir, `${relPath}.mdx`);
	mkdirSync(dirname(filePath), { recursive: true });
	writeFileSync(filePath, mdx, "utf8");

	const words = body.split(/\s+/).filter(Boolean).length;
	written.push({ path: `${relPath}.mdx`, title: page.title, words });
}

writeMetaFiles(pages, outDir);

console.log(JSON.stringify({ written, unhandled: allUnhandled }, null, 2));

function yamlString(s) {
	// Frontmatter values here are short titles/descriptions with no special YAML chars beyond
	// quotes; quote+escape defensively rather than assume.
	return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function writeMetaFiles(pages, outDir) {
	const _byPath = new Map(pages.map((p) => [p.path, p]));

	// Root meta.json: order the top-level docs sections as PagesSeeder::PAGES lists them.
	const topLevel = pages.filter((p) => p.path !== "docs" && !p.path.slice(5).includes("/"));
	writeFileSync(
		join(outDir, "meta.json"),
		`${JSON.stringify(
			{
				title: "Documentation",
				pages: topLevel.map((p) => p.path.replace(/^docs\//, "")),
			},
			null,
			2,
		)}\n`,
	);

	// One meta.json per category, ordering its articles as PagesSeeder::PAGES lists them.
	const categories = pages.filter((p) => p.type === "category" && p.path !== "docs");
	for (const cat of categories) {
		const prefix = `${cat.path}/`;
		const children = pages.filter(
			(p) => p.path.startsWith(prefix) && !p.path.slice(prefix.length).includes("/"),
		);
		const dir = join(outDir, cat.path.replace(/^docs\//, ""));
		mkdirSync(dir, { recursive: true });
		writeFileSync(
			join(dir, "meta.json"),
			`${JSON.stringify(
				{
					title: cat.title,
					pages: children.map((p) => p.path.split("/").pop()),
				},
				null,
				2,
			)}\n`,
		);
	}
}
