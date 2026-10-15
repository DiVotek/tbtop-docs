import { llms, loader } from "fumadocs-core/source";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { remarkPinnedVersion } from "./remark-pinned-version";
import { docsRoute } from "./shared";

export const docs = defineDocs({
	dir: "content/docs",
	docs: {
		async: true,
		mdxOptions: applyMdxPreset({
			remarkPlugins: (plugins) => [remarkPinnedVersion, ...plugins],
		}),
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
});

export const source = loader({
	source: docs.toFumadocsSource(),
	baseUrl: docsRoute,
});

export const docsLlms = llms(source, {
	renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
