import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Globe, MonitorPlay } from "lucide-react";
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
				type: "icon",
				label: "tbtop.dev",
				text: "tbtop.dev",
				icon: <Globe />,
				url: "https://tbtop.dev",
				external: true,
			},
			{
				type: "icon",
				label: "Demo",
				text: "Demo",
				icon: <MonitorPlay />,
				url: "https://demo.tbtop.dev",
				external: true,
			},
		],
	};
}
