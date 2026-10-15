import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

function urlEntry(path: string): string {
	return `<url><loc>${siteUrl}${path}</loc></url>`;
}

export function loader() {
	const entries = source.getPages().map((page) => urlEntry(page.url));
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

	return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
