import { PINNED_TAG } from "./shared";

/** The token install docs write where the pinned release version goes. */
export const PINNED_VERSION_TOKEN = "__PINNED_VERSION__";

const PINNED_VERSION = PINNED_TAG.replace(/^v/, "");

type Node = { type: string; value?: unknown; children?: Node[] };

const LITERAL_TYPES = new Set(["text", "inlineCode", "code"]);

function replaceToken(node: Node): void {
	if (LITERAL_TYPES.has(node.type) && typeof node.value === "string") {
		node.value = node.value.replaceAll(PINNED_VERSION_TOKEN, PINNED_VERSION);
	}
	for (const child of node.children ?? []) replaceToken(child);
}

/**
 * Replaces `__PINNED_VERSION__` in prose and code with `PINNED_TAG` minus its
 * `v`, so install commands follow the pinned release without hand edits.
 */
export function remarkPinnedVersion() {
	return replaceToken;
}
