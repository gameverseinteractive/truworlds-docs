# TruWorlds Documentation

This repository holds the source of the guides and code examples on [create.truworlds.com/docs](https://create.truworlds.com/docs). Every push to `main` is published to the site.

Anyone can contribute: corrections to existing guides (typos, outdated information, sections that confused you), new guides about building worlds, TruWorlds Creator or TruScript, and code examples for the API reference.

## What is where

```
content/
  guides/
    toc.yaml                 the sections and pages, in order
    index.md                 the landing page of the guides
    index.webp               its banner
    default.webp             the thumbnail of every page without its own
    <section>/index.md       a section's own page
    <section>/<page>.md      a page
    <section>/<page>.webp    the page's thumbnail (optional)
  examples/
    <Type>/<Member>.md       one code example shown on an API reference page
scripts/
  validate.mjs               checks content/ (CI runs it on every pull request)
  preview.mjs                shows the guides as the site lays them out
```

### toc.yaml

`content/guides/toc.yaml` lists the pages and sections in the order the site shows them. Any list, the top level or a section's `pages:`, may hold pages and sections, at any depth:

```yaml
- section: engine
  title: "Engine concepts"
  pages:
    - path: engine/index
      title: "Engine concepts"
      description: "How a world is made of instances, their members and data types"
    - path: engine/instance-tree
      title: "The instance tree"
      description: "The tree under game, classes and IsA, and finding instances in it"
    - section: engine/advanced
      title: "Advanced"
      pages:
        - path: engine/advanced/index
          title: "Advanced"
          description: "Topics once the basics are familiar"
- path: glossary
  title: "Glossary"
  description: "Every term in the manual, defined once"
```

- An entry has `path:` (a page) or `section:` (a section), never both.
- A page's or section's path is its parent section's path, a slash and a name; at the top level, just a name. A name is lowercase letters, digits and hyphens. A path has no `.md`.
- `assets` is not allowed at the top level (the site uses it for images), and `index` is not a top-level page: the landing is `content/guides/index.md`, outside the toc.
- No two entries share a URL. A page and a section with the same path clash.
- Each section needs its `<path>/index` page directly in its `pages:`. Without one, the site leaves the section out. A section with no other pages is fine.
- A problem entry is left out together with everything under it, and `validate` names it.
- A page's `title` and `description` must match its front matter exactly.
- A `.md` file under `content/guides` that is not in `toc.yaml` does not show on the site. The landing page, `content/guides/index.md`, is the one exception.

## Writing a page

Pages are Markdown with a few rules.

**Front matter.** A page starts with `title` and `description`, and no other keys. Quote a value that contains a colon followed by a space:

```markdown
---
title: Lighting
description: "Light a whole world: the sun, ambient light, shadows and a day cycle"
---

# Lighting
```

**Headings.** One `#` heading, the page title, right after the front matter. Sections use `##` and `###`. Nothing deeper. Every heading gets an anchor made from its text, for example `## Hit results` becomes `#hit-results`. A repeated heading gets `-1`, `-2` and so on.

**Callouts.** A blockquote whose first line is `[!NOTE]`, `[!TIP]` or `[!WARNING]`, alone on that line:

```markdown
> [!TIP]
> Start a playtest often.
```

**Code.** Code goes in a ` ```truscript ` fence.

**Links to other pages.** Use the relative path of the `.md` file, optionally with a heading anchor: `[Signals](../engine/properties-methods-signals.md#signals)`. A link to a section's `index.md` goes to the section.

**Links to the API reference.** `api:` followed by a class, data type or enum, and optionally a member: `[Connect](api:Signal.Connect)`, `[Part](api:Part)`. `global/` and `builtin/` prefixes link to globals and built-in modules, for example `api:global/print`.

**Placeholders.** A picture that is still to be made is an HTML comment of exactly this form. The site shows nothing for it; the preview shows a labeled box.

```markdown
<!-- screenshot: the Explorer with the Model expanded -->
<!-- diagram: a ray drawn as an arrow from the origin to the hit point -->
```

No other HTML is allowed, including other comments.

### Examples

A file in `content/examples/<Type>/<Member>.md` holds exactly one ` ```truscript ` fence and is shown on that member's API reference page.

## Thumbnails

A page's thumbnail is a WebP image beside its `.md` file with the same name: `physics/raycasting.webp` for `physics/raycasting.md`, `physics/index.webp` for the Physics section and `index.webp` for the landing. A page without its own image uses the nearest `default.webp` up the folders. PNG works too, but WebP wins when both exist.

Make every thumbnail **3000×600** (5:1).

- The page banner shows the whole image at 5:1.
- The card in a section's list shows the centered 2:1 crop, **x 900–2100** (the full height).
- Keep text and anything important inside the content safe area, **x 950–2050, y 50–550**, so it shows in both.

## Preview

```
node scripts/preview.mjs
```

Then open http://localhost:4321/docs/guides. Use `--port 4322` if 4321 is taken. The preview needs no install, renders pages the way the site does, and reloads the browser when a file changes. It differs from the site in two ways: placeholders show as labeled boxes, and a banner at the top of a page lists its problems, starting with everything `validate.mjs` fails on. `api:` links point at the class page on create.truworlds.com.

## Validate

```
node scripts/validate.mjs
node --test "scripts/test/*.test.mjs"
```

`validate.mjs` prints one line per problem, naming the file, and exits with 1 if there are any. It reports:

- a missing `content/guides/toc.yaml`, or one that is not a list of pages and sections; an entry that breaks the rules above (a bad name, a path outside its parent section, a section without its `index` page, a path listed twice)
- a missing `content/guides/index.md`
- a page in `toc.yaml` without a file, and a guide `.md` not in `toc.yaml`
- front matter that is missing or has keys other than `title` and `description`, and a title or description that differs from `toc.yaml`
- a link to a page that is not in `toc.yaml`, or to a heading that does not exist
- raw HTML other than the two placeholder comments
- a heading deeper than `###`
- a callout other than NOTE, TIP and WARNING
- an example file without exactly one ` ```truscript ` fence

`api:` targets are not checked here; the site checks them against the API reference.

Both scripts run on Node 22 or later with no `npm install`.

## Vendored libraries

`scripts/vendor/` holds two libraries, each bundled once into a single ES module so the scripts need no install:

- `markdown-it.mjs`: markdown-it 14.1.0, with its dependencies entities 4.5.0, linkify-it 5.0.2, mdurl 2.1.0, punycode.js 2.3.1 and uc.micro 2.1.0
- `yaml.mjs`: yaml 2.6.1

Their licenses are in `scripts/vendor/licenses/`. To rebuild them, in an empty folder outside this repository:

```sh
npm init -y
npm install --save-exact markdown-it@14.1.0 yaml@2.6.1 esbuild@0.24.2
echo "export { default } from 'markdown-it';" > markdown-it-entry.mjs
echo "export { parse, stringify } from 'yaml';" > yaml-entry.mjs
npx esbuild markdown-it-entry.mjs --bundle --format=esm --platform=node --target=node22 --legal-comments=inline \
  "--banner:js=// markdown-it 14.1.0 with entities 4.5.0, linkify-it 5.0.2, mdurl 2.1.0, punycode.js 2.3.1 and uc.micro 2.1.0, bundled by esbuild 0.24.2. Licenses: licenses/. Rebuild: README.md." \
  --outfile=<repo>/scripts/vendor/markdown-it.mjs
npx esbuild yaml-entry.mjs --bundle --format=esm --platform=node --target=node22 --legal-comments=inline \
  "--banner:js=// yaml 2.6.1, bundled by esbuild 0.24.2. License: licenses/yaml.LICENSE. Rebuild: README.md." \
  --outfile=<repo>/scripts/vendor/yaml.mjs
```

Then copy each package's license file from `node_modules/<package>/` to `scripts/vendor/licenses/<package>.LICENSE` (`LICENSE` for most, `LICENSE.txt` for uc.micro, `LICENSE-MIT.txt` for punycode.js). If npm resolves different versions of the dependencies, update the banner and the list above.

## Licenses

- The prose in this project is licensed under CC-BY-4.0, see [LICENSE](LICENSE).
- The code samples in this project are licensed under MIT, see [LICENSE-CODE](LICENSE-CODE).
- The vendored libraries in `scripts/vendor/` keep their own licenses: markdown-it, linkify-it, mdurl, punycode.js and uc.micro are MIT, entities is BSD-2-Clause, and yaml is ISC. See `scripts/vendor/licenses/`.

By opening a pull request you agree that your contribution is licensed the same way.
