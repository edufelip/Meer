# Repository Tests

- inMemoryRepositories.test.ts — Repos: InMemoryCategory/GuideContent/ThriftStore; Flows: list/filter/paginate sample data; get by id/search/nearby/favorites; unsupported create/update errors.
- repositories.test.ts — Repos: Category/GuideContent/Profile/User/Support/Feedback/Favorite/ThriftStore; Flows: caching behavior; delegation to remote/local; favorites queue sync and failure handling; ThriftStore cache freshness, dedupe, and background refresh.
