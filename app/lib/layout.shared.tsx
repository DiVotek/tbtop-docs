import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BrandMark } from "@/components/brand/BrandMark";
import { gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: <BrandMark />,
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
		links: [
			{
				type: "main",
				text: "tbtop.dev",
				url: "https://tbtop.dev",
				external: true,
			},
			{
				type: "main",
				text: "Demo",
				url: "https://demo.tbtop.dev",
				external: true,
			},
		],
	};
}
