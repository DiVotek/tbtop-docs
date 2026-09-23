import { createGetUrl } from "fumadocs-core/source";

export const appName = "Tabletop Docs";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
	user: "DiVotek",
	repo: "tbtop",
	branch: "main",
};

/**
 * The tbtop/admin release these docs describe. The only place this pins —
 * bump it here, then rerun `npm run sync:api` to refresh content/docs/api.
 */
export const PINNED_TAG = "v0.5.1";

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
	const segments = [...page.slugs, "content.md"];

	return { segments, url: getContentUrl(segments, page.locale) };
}
