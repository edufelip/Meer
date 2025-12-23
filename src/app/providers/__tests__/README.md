# App Provider Tests

- AppProviders.test.tsx — Component: AppProviders; Flows: renders children without token; boots with token and validates; syncs favorites on mount and app active; clears auth session and navigates to login on validation failure.
- AppProvidersWithDI.test.tsx — Components: DependenciesProvider/useDependencies; Flows: throws when hook used outside provider; exposes dependencies inside provider.
