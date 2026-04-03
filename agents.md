# Project

Last updated: 2026-03-11

## Overview

- `Spring Breeze` is an Astro 5 static personal blog with TypeScript, MDX, and Tailwind CSS v4.
- The UI uses a Nintendo / pixel-art visual language defined mostly in `src/styles/global.css`.
- Deployment targets are split between GitHub Pages (`/blog`) and Vercel (`/`).

## Common Commands

```bash
bun run dev
bun run build
bun run preview
bun run lint
bun run format:check
```

## Root Map

- `astro.config.mjs`: Astro site config, base-path switching, markdown pipeline, integrations.
- `package.json`: project scripts and dependency list.
- `tsconfig.json`: strict Astro TS config with `@/*` and `@blogimages/*` aliases.
- `vercel.json`: pins Bun on Vercel.
- `opencode.jsonc`: local OpenCode MCP / LSP settings.
- `src/pages/`: all Astro routes.
- `src/components/`: reusable UI components.
- `src/layouts/`: shared page layouts.
- `src/content/`: Astro content collections and blog posts.
- `src/plugins/`: custom remark plugins.
- `src/scripts/`: runtime helpers and custom web components.
- `src/styles/global.css`: theme tokens and shared utilities.
- `public/`: static assets, icons, manifest, and demo files.

<!-- MANUAL ADDITIONS START -->

## AI Development Rules

### Context7 MCP Usage

Always use the **Context7 MCP server (`context7`)** when performing any of the following tasks:

- Looking up library or API documentation
- Generating code that depends on external libraries or frameworks
- Providing setup or installation steps
- Explaining configuration or environment setup
- Writing integration examples for SDKs or packages

The agent should **automatically consult Context7 first** instead of relying on internal knowledge when documentation may be outdated.

Prefer Context7 results for:

- framework APIs
- SDK usage
- package configuration
- dependency installation
- migration guides

If Context7 provides documentation or examples, base the generated code and instructions on that information.

<!-- MANUAL ADDITIONS END -->
