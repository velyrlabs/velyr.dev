# velyr.dev

The website and documentation for [Velyr](https://github.com/velyrlabs/velyr), a security-first JavaScript and TypeScript runtime written in Rust.

Next.js (App Router, React Server Components), MDX compiled at build time, Shiki highlighting, and a WebGPU hero built with [vgpu](https://vgpu.sh). Deploys on Cloudflare (Workers static assets) as a fully static export.

## Develop

```sh
pnpm i
pnpm dev      # http://localhost:3000
pnpm build    # production build to out/; this is the verification step
```

## Deploy (Cloudflare)

The site is a static export (`output: "export"`) served by Cloudflare Workers static assets, configured in `wrangler.jsonc`. Run `pnpm exec wrangler login` once, then:

```sh
pnpm preview  # build, then serve out/ locally with wrangler dev
pnpm deploy   # build, then wrangler deploy
```

Security headers live in `public/_headers`.

Shaders live in `gpu/gate/*.wgsl` and are prepared at build time by `wgslTurbopackRule()` from `@vgpu/wgsl/next`. Validate them against a real device with `npx vgpu check gpu/gate/scene.wgsl --require-validation`.

## Where things live

| Path | What |
| --- | --- |
| `content/guide`, `content/config`, `content/plugins` | Documentation pages (MDX) |
| `content/_fixtures` | Renderer fixtures, built at `/fixtures/<name>` with `noindex`; never in nav or search |
| `lib/navigation.ts` | The sidebar and pager order for every section |
| `lib/features.ts` | Home page feature cards and their status |
| `lib/site.ts` | `REPO_URL`, version, tagline |
| `mdx-components.tsx` | Global MDX components |
| `public/brand` | Mark and lockup downloads |

## Content contract

- One file per page: `content/{guide,config,plugins}/<slug>.mdx`. `index.mdx` is the section root. URLs have no `/docs` prefix: `/guide`, `/guide/cli`, `/config/permissions`, `/plugins/api`.
- Files or folders whose name starts with `_` are not routed.
- Frontmatter:
  ```yaml
  title: Permissions            # required, becomes the H1
  description: How grants work  # required, lead paragraph and meta description
  status: available             # optional: available | experimental | planned
  ```
- Do not write a `#` H1. Start at `##`; `##` and `###` get slugified ids and appear in "On this page".
- Components, no imports needed:
  - `<Status value="available|experimental|planned" />`
  - `<Callout type="note|tip|warning|danger" title="optional">...</Callout>`
  - `<Steps>` around an ordered list
  - `<CodeGroup>` around several fenced blocks; each block's `title` is its tab label
- Fenced code: a language plus optional meta, for example ` ```ts title="main.ts" {2,4-5} ` for a title bar and highlighted lines. Every block gets a copy button.
- GFM tables, inline code, relative links (`/guide/permissions`) and anchors (`#section`) work as usual.
- A page listed in `lib/navigation.ts` without an MDX file still shows in the sidebar and returns the 404 page until it is written.

## Notes

- `REPO_URL` and `SITE_REPO_URL` in `lib/site.ts` point at the `velyrlabs` GitHub org; `SITE_REPO_URL` (the "edit this page" link) assumes the site repo is `velyrlabs/velyr.dev`. Confirm it exists before launch.
- `assets/archivo-500.ttf` is a static subset of Archivo (SIL Open Font License 1.1) used only by the Open Graph image. The lockup wordmark in `public/brand` and `lib/wordmark-path.ts` is outlined from Archivo 800 at width 125%.
- The gate blur taps and pipeline shape are adapted from the vgpu `nextjs-flare` example.
