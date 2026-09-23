import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: appName,
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
