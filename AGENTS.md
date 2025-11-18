# Repository Guidelines

## Project Structure & Module Organization
- `App.tsx`: Expo entry point that mounts `src/app/AppRoot`.
- `src/app`: App composition (providers, navigation). Tabs in `src/app/navigation/RootTabs.tsx`.
- `src/presentation`: UI layer. Screens per tab under `screens/{home,favorites,categories,profile}`; shared UI in `components/`.
- `src/domain`: Entities, repository interfaces, and use cases.
- `src/data`: Data sources and repository implementations (e.g., AsyncStorage-backed user data source).
- `assets/`: Static images and icons.
- Legacy `app/` (expo-router scaffolding) is unused; keep only if needed for reference.

## Build, Test, and Development Commands
- `npm start` (alias `npx expo start`): Launch Metro/Expo dev server with QR code for device/simulator.
- `npm run android` / `npm run ios` / `npm run web`: Start Expo targeting a specific platform.
- `npm run lint`: Run Expo ESLint preset; fails on style or TypeScript-aware lint errors.

## Coding Style & Naming Conventions
- Language: TypeScript/React Native with functional components.
- Imports: Prefer project-relative paths from `src/`; update Babel/TS paths if adding aliases.
- Components/hooks: `PascalCase` for components, `camelCase` for functions/variables, interfaces prefixed with uppercase nouns (no `I` prefix).
- Styling: React Native `StyleSheet.create` or styled alternatives; keep inline styles minimal.
- Linting/formatting: ESLint via `npm run lint`; align with React/Expo defaults (2-space indent, double quotes in TSX per repo pattern).

## Testing Guidelines
- No test suite is configured. If adding tests, prefer Jest with React Native Testing Library.
- Place tests adjacent to modules (`*.test.ts[x]`) or in `__tests__/` mirrors. Ensure Metro/Jest path aliases match Babel/TS paths.

## Commit & Pull Request Guidelines
- Follow Conventional Commits where feasible (`feat:`, `fix:`, `chore:`). Keep subject ≤72 chars; body explains what/why.
- PRs should include: summary of changes, testing performed (`npm run lint`/app run), screenshots or screen recordings for UI changes, and linked issue/task IDs.
- Avoid bundling unrelated changes; one feature/fix per PR improves review speed.

## Architecture Notes
- Clean architecture layering: presentation → domain → data. Presentation depends only on domain contracts; data provides concrete implementations wired in `AppProvidersWithDI`.
- Dependency injection: use `DependenciesProvider` for supplying use cases/repositories; prefer hooks (e.g., `useDependencies`) for consumption.
