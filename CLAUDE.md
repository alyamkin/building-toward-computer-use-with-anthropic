# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

An npm-workspaces monorepo (`client/` + `server/`) that serves as a learning project building toward Claude computer use. Currently it's a single-turn "Ask Claude" chat: a React UI posts a question to an Express API, which calls the Anthropic Messages API and returns the raw `Message` object.

## Commands

Run from the repo root (Node version in `.nvmrc`; `engines` requires >= 20.11):

- `npm run dev`: client (Vite, :5173) and server (tsx watch, :3000) together via `concurrently`
- `npm run dev:client` / `npm run dev:server`: just one side
- `npm run build`: builds the client (`tsc -b && vite build`), then the server (`tsc` → `server/dist`)
- `npm start`: runs the built server (`node dist/index.js`)
- `npm run typecheck`: both workspaces
- `npm run lint`: ESLint, **client only** (the server has no linter)
- `npm run format` / `npm run format:check`: Prettier (no semicolons, single quotes, 100 cols, trailing commas)

There is no test framework set up yet.

## Environment

The server loads `server/.env` through `tsx --env-file=.env`, so this only happens in `dev`. `npm start` doesn't load it, so the variables have to be set in the environment. `server/src/config/env.ts` is the single source of truth for config. `ANTHROPIC_API_KEY` is required and the server throws at boot if it's missing. Every variable belongs in `server/.env.example` (copy it to `.env`). The Anthropic SDK client (`new Anthropic()`) also reads that key from the environment on its own.

## Architecture

**Request flow:** The browser calls `/api/...`. In dev, the Vite proxy (`client/vite.config.ts`) forwards these calls to `localhost:3000`, so the client never hardcodes the server origin. On the server, `app.ts` mounts all routes under `/api`, then `notFoundHandler`, then `errorHandler` (which must stay last).

**Server layering** (`server/src/`), one file per resource in each layer:
- `routes/<resource>.ts`: the Express `Router`. Each one is registered in `routes/index.ts` (e.g. `/todos`, `/anthropic`).
- `controllers/<resource>Controller.ts`: thin `RequestHandler`s that pull data from `req` and call the service. They're async and can just `throw`, because Express 5 forwards rejected promises to the error handler.
- `services/<resource>Service.ts`: the logic and external calls. `anthropicService.ts` wraps the Anthropic SDK and hardcodes the model and `max_tokens`. `todoService.ts` is an in-memory store.
- Errors: throw `HttpError` (or the `badRequest` / `notFound` helpers from `middleware/httpError.ts`). `errorHandler` turns them into `{ message }` JSON. In production it hides the message of any 5xx.

The server is ESM with `module: NodeNext` and `verbatimModuleSyntax`. Relative imports **must use the `.js` extension** (`'./routes/index.js'`), and type-only imports must use `import type`.

**Client** (`client/src/`): React 19, Vite, and Tailwind v4 (through `@tailwindcss/vite`, so there's no Tailwind config file).
- `api/client.ts`: a small `fetch` wrapper (`api.get/post/delete`) that prefixes `/api` and throws `ApiError` using the server's `{ message }`.
- `features/<feature>/`: a `useX` hook that owns the state and API calls, plus a component that renders it. `chat` is the one wired into `App.tsx`. `todos` is the scaffold example and isn't rendered.
- `useChat` gets back the full Anthropic `Message` and joins its `text` content blocks on the client. Each request is single-turn: no conversation history is sent.
