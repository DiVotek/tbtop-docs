# Docs migration scripts

Converts the 19 `docs/...` pages that `tbtop.dev`'s `database/seeders/PagesSeeder.php` used
to seed (removed in commit `b6239a3`, "move the docs off the site") into MDX + `meta.json` for
a Fumadocs `content/docs` tree.

## Pipeline

1. **`dump-docs.php`** — loads `PagesSeeder` from a worktree of the host repo checked out at
   `b6239a3^` (the last commit before the docs blocks were removed) and calls its private
   `editorial()`/`seo()` methods via reflection for each `docs/...` path in its `PAGES` table.
   Emits one JSON array with `{path, type, title, summary, seoDescription, body}` per page,
   where `body` is the page's Lexical richtext `root` node (or `null` for a category page,
   which the seeder never gave a body).
2. **`richtext-to-mdx.mjs`** — pure function `richtextToMarkdown(root, linkMap)` that turns
   one Lexical `root` node into Markdown/MDX. Node coverage mirrors
   `vendor/tbtop/cms/src/Richtext/RichtextNodeRenderer.php` exactly: `paragraph`, `heading`
   (h1–h6), `quote`, `list`/`listitem` (bullet or number, nestable), `code`, `linebreak`,
   `text` (bold/italic/code/underline/strikethrough via the format bitmask), `link`/`autolink`.
   There is no table node in that renderer, so none is handled here — if the source ever grows
   one, `richtextToMarkdown` reports it in its `unhandled` array rather than silently dropping
   it. `{`, `}` and `<` in prose are backslash-escaped (MDX would otherwise parse them as
   JSX/expressions); inline code and code blocks are left literal.
3. **`build-mdx.mjs`** — reads the JSON from step 1, calls step 2 for every article, and writes
   `content/docs/**/*.mdx` (frontmatter `title` + `description`) plus one `meta.json` per
   level, ordering pages exactly as `PagesSeeder::PAGES` lists them. Category pages (`docs`,
   `docs/getting-started`, `docs/authoring`, `docs/extending`, `docs/packages`) get no `.mdx`
   file — they carried no body in the source, and Fumadocs renders a section index from
   `meta.json` alone. `docs/packages/cms` is special-cased to a short "coming soon" stub
   linking to `https://tbtop.dev/extensions/cms`, since `tbtop/cms` is private and this repo
   documents `tbtop/admin` only. A link map rewrites every old `/docs/...` path to the new
   `/docs/...` path (dropping the leading `docs/` segment) and points `/extensions/cms` at the
   marketing site; a link to any other page outside this set (e.g. `/license`, removed on the
   marketing site) is dropped, keeping its link text as plain prose.

## Rerunning

Needs PHP (with the host's Composer-installed `vendor/`) and Node 18+.

```bash
# 1. Worktree of the host repo at the pre-removal commit, with vendor/ symlinked in
git -C /path/to/tbtop.dev worktree add /tmp/host-worktree b6239a3^
ln -s /path/to/tbtop.dev/vendor /tmp/host-worktree/vendor

# 2. Dump the richtext JSON
php dump-docs.php > docs-raw.json
#   (dump-docs.php assumes the worktree is at ../host-worktree relative to this
#   directory — adjust the two `require` paths at its top if yours lives elsewhere)

# 3. Build the MDX tree
node build-mdx.mjs docs-raw.json /path/to/tbtop-docs/content/docs

# 4. Remove the worktree
git -C /path/to/tbtop.dev worktree remove /tmp/host-worktree
```

`richtext-to-mdx.mjs` can also be run standalone on one page for debugging:

```bash
node -e "console.log(JSON.stringify(require('./docs-raw.json'... )))" # or slice manually
node richtext-to-mdx.mjs <one-root.json> <link-map.json>
```

## What needed a judgment call

- **Category pages** (5 of the 19) carry no body in the source at all — `editorial()` returns
  `body: null` for every `docs/...` path with exactly one slash after `docs/`. They become
  `meta.json` entries only, no `.mdx` file, which is how Fumadocs expects a section index to
  work.
- **13 of the 14 articles** are the seeder's literal stub body, `"This page is being
  written."` (`PagesSeeder::stubDocument()`) — carried over as-is, per the "convert as-is"
  brief. Only `docs/getting-started/install` has real content.
- **`docs/packages/cms`** is replaced with a short stub pointing at
  `https://tbtop.dev/extensions/cms`, per this migration's brief (`tbtop/cms` is private and
  out of scope for this repo's docs).
