# Home Screen Tests

- HomeScreen.test.tsx — Screen: HomeScreen; Flows: renders header; shows offline banner; fetches home data and caches after location; navigates to contents with pagination payload; filters by neighborhood chip; navigates to thrift detail (nearby + featured); search icon navigates to search; nearby map CTA navigates to categoryStores; view-all-stores CTA uses coords and default coords when location unavailable; guide card navigates to content detail.

Detox IDs:
- home-nearby-<storeId> — nearby list item press for thrift detail navigation.
