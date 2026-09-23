import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Hero } from "@/components/landing/Hero";
import { baseOptions } from "@/lib/layout.shared";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "Tabletop Docs" },
		{
			name: "description",
			content: "Documentation for tbtop/admin, the PHP admin panel framework.",
		},
	];
}

export default function Home() {
	return (
		<HomeLayout {...baseOptions()}>
			<Hero
				eyebrow="Public beta · Open source"
				heading="Admin panels for Laravel,"
				accent="written in PHP. Rendered in React."
				lead="Describe pages, tables, forms and actions in a PHP DSL; Tabletop renders them as a React admin. We build every client project on it, and our own CMS — closed beta today, public next."
				bullets={[
					{ text: "26 field kinds", snippet: "fields" },
					{ text: "Tables & filters", snippet: "tables" },
					{ text: "Actions & modals", snippet: "actions" },
					{ text: "Multi-panel", snippet: "panels" },
					{ text: "Command palette", snippet: "palette" },
					{ text: "Notifications", snippet: "notifications" },
					{ text: "Locales", snippet: "locales" },
					{ text: "Your React components", snippet: "extend" },
				]}
				command="composer require tbtop/admin"
				facts={["MIT licence", "Laravel 11–13", "PHP 8.4+", "Self-hosted"]}
			/>
		</HomeLayout>
	);
}
