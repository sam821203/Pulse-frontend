# Pulse

A real-time stock tracking and analysis platform built with Vue3. It provides real-time stock tracking, financial data analysis, technical charts, and a visual interface, allowing users to easily view the latest stock dynamics and financial indicators. The backend is built with Nest.js and MongoDB, integrating [臺灣證券交易所 OpenAPI](https://openapi.twse.com.tw/), [證券櫃檯買賣中心 OpenAPI](https://www.tpex.org.tw/openapi/), Taiwan OTC Exchange OpenAPI, and Taiwan Stock Exchange for real-time stock data and financial reports.

## Features

**Real-Time Stock Tracking:** Allows users to track the real-time price movements and historical trends of specific stocks.

**Financial Data Analysis:** Displays the company's financial reports and analyzes key financial indicators.

**Technical Charts:** Presents technical indicators of stocks using charts to assist investment decisions.

## Technology Stack

**Frontend:** Vue3, Vue Router, Pinia, Axios, RxJS

**Backend:** Nest.js, MongoDB

**Data Visualization:** D3.js

## Project Setup

```sh
npm install
```

### TypeScript type declarations

Some `.d.ts` files are **generated locally** and listed in `.gitignore` (they are not committed):

- `src/auto-imports.d.ts` — from [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) (auto-imported Vue / Vue Router APIs)
- `src/components.d.ts` — from [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) (auto-registered components)

The hand-written [`env.d.ts`](env.d.ts) **is** tracked in git (Vite client types and `*.vue` module declarations).

After a fresh clone, run **one** of the following before `npm run type-check` or IDE type-checking, so those generated files exist:

```sh
npm run dev
```

or

```sh
npm run build-only
```

Vite plugins write the files on startup or build (see [`vite.config.ts`](vite.config.ts)).

### Cursor agent skills (optional)

This repo tracks **project-specific** Cursor rules under `.cursor/` (committed). **Agent skills** from the open ecosystem are listed in `skills-lock.json` but installed under `.agents/skills/`, which is gitignored.

After cloning on a new machine, install the locked skills into the project (requires [Node.js](https://nodejs.org/) for `npx`):

```sh
npx skills add sickn33/antigravity-awesome-skills --skill claude-d3js-skill -a cursor -y
npx skills add harlan-zw/vue-ecosystem-skills --skill primevue-skilld -a cursor -y
npx skills add hairyf/skills --skill tailwindcss -a cursor -y
npx skills add wshobson/agents --skill typescript-advanced-types -a cursor -y
npx skills add github/awesome-copilot --skill unit-test-vue-pinia -a cursor -y
npx skills add antfu/skills --skill vue --skill vite --skill vitest -a cursor -y
npx skills add hyf0/vue-skills --skill vue-best-practices --skill vue-debug-guides --skill vue-pinia-best-practices -a cursor -y
npx skills add teachingai/full-stack-skills --skill vue-router-v4 -a cursor -y
```

Verify installation:

```sh
npx skills list -a cursor
```

Restart Cursor or open a new Agent chat so skills are discovered. To update installed skills later: `npx skills update -a cursor -y`.

> **Note:** Some upstream skills target newer tool versions (e.g. Tailwind v4, Vitest 3) than this project’s `package.json`. Treat `package.json` as the source of truth for runtime versions.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
