#!/usr/bin/env node
// Converts a Lexical richtext root (as dumped by dump-docs.php) to Markdown/MDX prose.
// Node coverage mirrors vendor/tbtop/cms RichtextNodeRenderer: paragraph, heading (h1-h6),
// quote, list/listitem (bullet + number, nestable), code, linebreak, text, link/autolink.
// No table node exists in that renderer, so none is handled here.
// See README.md in this directory for usage and for what maps a /docs/... link and drops
// a link to a removed page while keeping its text.

import { readFileSync } from "node:fs";

const FORMAT_TAGS = [
	[1, "strong"],
	[2, "em"],
	[16, "code"],
	[8, "u"],
	[4, "s"],
];

const unhandled = new Set();

function escapeMdx(text) {
	// MDX parses {, } and < in prose as JSX/expressions; code spans/blocks are exempt.
	return text.replace(/[{}<]/g, (ch) => ({ "{": "\\{", "}": "\\}", "<": "\\<" })[ch]);
}

function renderText(node) {
	let text = escapeMdx(node.text ?? "");
	const format = node.format ?? 0;

	if ((format & 16) !== 0) {
		// Inline code is a literal span: no MDX escaping inside it, and no other marks nest in it.
		return `\`${(node.text ?? "").replaceAll("`", "`")}\``;
	}

	for (const [bit, tag] of FORMAT_TAGS) {
		if ((format & bit) === 0) continue;
		if (tag === "strong") text = `**${text}**`;
		else if (tag === "em") text = `*${text}*`;
		else if (tag === "u") text = `<u>${text}</u>`;
		else if (tag === "s") text = `~~${text}~~`;
	}

	return text;
}

function mapLink(url, linkMap) {
	if (url == null) return { href: null, drop: false };
	if (/^https?:\/\//.test(url) || url.startsWith("mailto:") || url.startsWith("/.well-known/")) {
		return { href: url, drop: false };
	}
	if (linkMap.has(url)) {
		return { href: linkMap.get(url), drop: false };
	}
	// A link to a page this migration doesn't carry forward (e.g. /license): keep the text, drop the link.
	unhandled.add(`link:${url}`);
	return { href: null, drop: true };
}

function renderInline(children, linkMap) {
	return children.map((child) => renderInlineNode(child, linkMap)).join("");
}

function renderInlineNode(node, linkMap) {
	switch (node.type) {
		case "text":
			return renderText(node);
		case "linebreak":
			return "\\\n";
		case "link":
		case "autolink": {
			const inner = renderInline(node.children ?? [], linkMap);
			const { href, drop } = mapLink(node.url, linkMap);
			return drop ? inner : `[${inner}](${href})`;
		}
		default:
			unhandled.add(`inline-node:${node.type}`);
			return renderInline(node.children ?? [], linkMap);
	}
}

function renderList(node, linkMap, depth) {
	const ordered = node.listType === "number";
	const start = ordered && Number.isInteger(node.start) && node.start > 1 ? node.start : 1;
	const indent = "  ".repeat(depth);
	const lines = [];
	let n = start;

	for (const item of node.children ?? []) {
		if (item.type !== "listitem") {
			unhandled.add(`list-child:${item.type}`);
			continue;
		}
		const marker = ordered ? `${n}.` : "-";
		n++;

		// A listitem's children are a mix of inline nodes (the item's own text) and,
		// for a nested list, a nested `list` block — split them so the nested list
		// renders as indented lines under the marker instead of inline.
		const inlineChildren = (item.children ?? []).filter((c) => c.type !== "list");
		const nestedLists = (item.children ?? []).filter((c) => c.type === "list");

		const text = renderInline(inlineChildren, linkMap);
		lines.push(`${indent}${marker} ${text}`);

		for (const nested of nestedLists) {
			lines.push(renderList(nested, linkMap, depth + 1));
		}
	}

	return lines.join("\n");
}

function renderBlock(node, linkMap) {
	switch (node.type) {
		case "paragraph":
			return renderInline(node.children ?? [], linkMap);
		case "heading": {
			const level = /^h[1-6]$/.test(node.tag ?? "") ? Number(node.tag[1]) : 2;
			return `${"#".repeat(level)} ${renderInline(node.children ?? [], linkMap)}`;
		}
		case "quote":
			return renderInline(node.children ?? [], linkMap)
				.split("\n")
				.map((line) => `> ${line}`)
				.join("\n");
		case "list":
			return renderList(node, linkMap, 0);
		case "code": {
			const code = (node.children ?? []).map((c) => c.text ?? "").join("");
			// The seeder's code() helper never sets a language (see PagesSeeder::code()).
			const lang = node.language ?? "";
			return `\`\`\`${lang}\n${code}\n\`\`\``;
		}
		default:
			unhandled.add(`block-node:${node.type}`);
			return renderInline(node.children ?? [], linkMap);
	}
}

export function richtextToMarkdown(root, linkMap) {
	unhandled.clear();
	const blocks = (root.children ?? []).map((node) => renderBlock(node, linkMap));
	return { markdown: `${blocks.join("\n\n")}\n`, unhandled: [...unhandled] };
}

// CLI: node richtext-to-mdx.mjs <root-json-file> <link-map-json-file>
if (import.meta.url === `file://${process.argv[1]}`) {
	const [, , rootPath, linkMapPath] = process.argv;
	const root = JSON.parse(readFileSync(rootPath, "utf8"));
	const linkMap = new Map(Object.entries(JSON.parse(readFileSync(linkMapPath, "utf8"))));
	const { markdown, unhandled: u } = richtextToMarkdown(root, linkMap);
	process.stdout.write(markdown);
	if (u.length) process.stderr.write(`unhandled: ${JSON.stringify(u)}\n`);
}
