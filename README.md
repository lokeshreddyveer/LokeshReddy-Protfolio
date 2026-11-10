# Lokesh Reddy — Generative AI Engineering Portfolio

Source code for [lokeshreddy.dev](https://lokeshreddy.dev), an interactive portfolio covering production GenAI systems, engineering case studies, independent apps, and technical writing.

## What’s included

- Portfolio pages for projects, experience, architecture, security, apps, notes, and contact.
- Reddy, the portfolio assistant, with contextual answers and portfolio-grounded fallback responses.
- Interactive engineering studio, playground, RAG debugger, and agent trace.
- Direct chat, comments, likes, reading history, and portfolio analytics.

## Stack

Next.js 16, React 19, TypeScript, Vinext, Tailwind CSS, Cloudflare Workers, and optional Cloudflare D1/R2 storage.

## Local development

Requirements: Node.js 22.13 or later and pnpm 11.

```sh
pnpm install
npm run dev
```

Build and preview the Worker locally:

```sh
npm run build
npm start
```

Other useful scripts:

- `npm run lint` — lint the project.
- `npm run lint:articles` — check article content contracts.
- `npm run test:reddy` — run the Reddy regression checks.
- `npm run test:movies` — run the movie-feature tests.

## Reddy without an LLM

Set the server-side Site environment variable `REDDY_LLM_ENABLED=false` to stop Reddy’s main chat and portfolio Q&A routes from calling any configured LLM provider. The chat UI, built-in replies, and portfolio fallback answers remain available. The separate GenAI Playground is not controlled by this flag.

The live portfolio is currently configured with `REDDY_LLM_ENABLED=false` for fallback-only testing. To restore live Reddy responses, set the variable to `true` (or remove it) in the Site environment, then deploy a saved version. Provider credentials must remain in server-side environment variables and must never be committed or exposed in browser code.

## Deployment

The production portfolio runs on Cloudflare Workers. Production runtime variables are configured in the Site environment; do not commit secrets or local runtime files.
