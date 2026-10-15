import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

const XML_ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
};

function urlEntry(path: string): string {
	const loc = `${siteUrl}${path}`.replace(/[&<>"']/g, (char) => XML_ENTITIES[char] ?? char);
	return `<url><loc>${loc}</loc></url>`;
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
