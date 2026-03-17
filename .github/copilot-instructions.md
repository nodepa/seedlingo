# Copilot Instructions for Seedlingo

## Copilot Behavior

Do not run `git commit` (or any command that creates a commit) without explicit permission from the user, even in agent mode.

## Repository Overview

Seedlingo is a monorepo for an adult first-language digital literacy learning platform. It has two independent packages:

- **`app/`** — Learning application (Vue 3 + Ionic + Vite, PWA + Android via Capacitor)
- **`editor/`** — Content editor (Nuxt 3 + Tailwind + AWS Amplify)

Each package has its own `package.json` and `node_modules`. Run commands from within the respective directory.

## Commands

### App (`cd app`)

```bash
npm run dev              # Dev server at http://localhost:5173
npm run build            # Production build (includes lint)
npm run lint             # ESLint
npm run lint:tsc         # TypeScript type check
npm run test:unit        # Vitest unit + component tests
npm run test:unit:coverage  # With v8 coverage
npm run test:e2e         # Cypress E2E against built app (localhost:4173)
npm run test:e2e:dev     # Cypress E2E against dev server
npm run verify:content   # Validate content JSON structure
```

**Single test:**
```bash
npm run test:unit -- tests/unit/Content.test.ts
npm run test:unit -- tests/component/UnitsMenu.test.ts
npm run test:e2e:dev -- --spec tests/e2e/specs/matching.ts
```

### Editor (`cd editor`)

```bash
npm run dev              # Dev server at http://localhost:3000
npm run build            # Production build
npm run sandbox          # Local AWS Amplify sandbox
```

## Architecture

### App

Exercise types are self-contained feature modules under `src/`:

```
src/
├── MultipleChoice/     # ┐
├── Matching/           # ├─ Each has: components/, data/, utils/, *Types.ts
├── Cloze/              # │
├── Comprehension/      # ┘
├── common/             # Shared: animations, components, directives, router,
│                       #         store (Vuex 4), styles, types, utils
├── Content/            # Content loader (JSON-driven curriculum)
├── Instructions/       # Overlay tutorial system
└── views/              # Route-level components (HomeView, ExerciseSession…)
```

The curriculum is loaded from `content/` (JSON files, licensed separately under CC-BY-SA 4.0). Content validation runs via `npm run verify:content`.

State is managed with **Vuex 4** (`common/store/`). The app is a PWA with Workbox service worker and is also packaged as an Android APK via Capacitor.

#### Content system & exercise generation

The content directory contains three JSON file types that form a hierarchy:

- **`ContentSpec.json`** — root config: lists units (name, MDI icon, intro audio, path to unit spec file) and points to `WordSpec.json`
- **`WordSpec.json`** — all words keyed by UUID: `{ "<uuid>": { word, audio?, picture?, symbol? } }`
- **`Unit*.json`** — per-unit exercise list with counts per type and an `exercises` array

Words are referenced in exercises using `{ "display-text": "uuid" }` objects, allowing validation that the text matches the UUID.

At runtime, `Content.ts` imports all JSON and audio files statically at build time. Audio files are embedded as inline data URIs (`.mp3.audio` imports) — there is no runtime file serving. This is what makes the app fully offline-capable without complex service worker caching.

`ExerciseProvider` reads the relevant `Unit*.json`, randomly selects an exercise from the available pool, looks up word objects from `WordSpec`, and returns a typed exercise object. `ExerciseSession.vue` then dynamically mounts the matching exercise component.

The `Explanation` exercise type is special: at runtime the app randomly presents it as either `ExplanationMatching` or `ExplanationMultipleChoice`, so one content definition covers two exercise formats.

Material Design icon names in JSON are prefixed with `mdi` (e.g. `"mdiNumeric1"`). The `formatVersion` field (currently `"1.4.0"`) in each JSON file governs schema compatibility.

### Editor

Nuxt 3 file-based routing. Pages: `index` (dashboard), `login`, `exercises`. AWS Amplify provides auth and data. Valibot is used for runtime type validation of content schemas.

## Key Conventions

### Naming

- **App components**: PascalCase (`MultipleChoice.vue`, `ExerciseButton.vue`)
- **Editor components**: kebab-case (`word-form.vue`, `unit-form.vue`)
- **Type files**: `*Types.ts` suffix (e.g., `MultipleChoiceTypes.ts`, `ContentTypes.ts`)
- **Store modules**: PascalCase (`InstructionsModeStore`, `RootStore`)
- **Path alias**: `@/*` → `src/*` in both packages

### TypeScript

Strict mode is enabled in both packages. Use explicit types; avoid `any`.

### Code Style

Prettier config (both packages): single quotes, 2-space indent, 80-char print width, trailing commas, semicolons. ESLint enforces Vue 3 recommended rules. `console.log` and `debugger` are banned by ESLint.

### Tests

- Unit/component tests live in `app/tests/unit/` and `app/tests/component/` using Vitest + Happy DOM.
- E2E tests live in `app/tests/e2e/specs/` using Cypress. Cypress runs at mobile viewport (375×812).
- Component tests use Vue Test Utils.

### Content

The `content/` directory is licensed under CC-BY-SA 4.0, separate from the MIT-licensed code. When adding or modifying content files, use type `content:` in the commit message.
