import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
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
			<div className="p-4 flex flex-col items-center justify-center text-center flex-1">
				<h1 className="text-xl font-bold mb-2">Tabletop Docs</h1>
				<p className="text-fd-muted-foreground mb-4">
					tbtop/admin is a PHP DSL for building admin panels, with a React client.
				</p>
				<div className="flex items-center gap-3">
					<Link
						className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
						to="/docs"
					>
						Read the Docs
					</Link>
					<a
						className="text-sm border border-fd-border rounded-full font-medium px-4 py-2.5"
						href="https://tbtop.dev"
					>
						tbtop.dev
					</a>
				</div>
			</div>
		</HomeLayout>
	);
}
