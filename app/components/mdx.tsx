import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { NodeAlpha, StackOnly, StackTab, StackTabs } from "@/components/cms";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		StackTabs,
		StackTab,
		NodeAlpha,
		StackOnly,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
