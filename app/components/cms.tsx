import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

/** The two stacks tbtop/cms ships for, in the order every tab row shows them. */
const STACKS = ["Laravel", "Node"];

/**
 * Laravel / Node code tabs for the CMS guides. Every instance shares one
 * group and persists it, so a reader picks a stack once and every page
 * after that opens on it. Children are `<Tab value="Laravel">` / `<Tab value="Node">`.
 */
export function StackTabs({ children }: { children: ReactNode }) {
	return (
		<Tabs groupId="cms-stack" persist items={STACKS}>
			{children}
		</Tabs>
	);
}

export { Tab as StackTab };

/** The banner every Node CMS page carries while @tbtop/cms is in alpha. */
export function NodeAlpha() {
	return (
		<Callout type="warn" title="Alpha">
			The Node package is in alpha: its API may change between minor versions. Pin an exact
			version and read the changelog before you upgrade.
		</Callout>
	);
}

/** Marks a section that exists in one stack only. */
export function StackOnly({ stack }: { stack: "Laravel" | "Node" }) {
	return (
		<Callout type="info" title={`${stack} only`}>
			This feature exists in the {stack} package only.
		</Callout>
	);
}
