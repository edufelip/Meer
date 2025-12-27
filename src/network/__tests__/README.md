# Network Tests

- apiBaseUrl.test.ts — Module: apiBaseUrl; Flows: default base URL; override load/normalize; invalid override handling; set override; no-op on prod base URL.
- httpClient.test.ts — Module: httpClient; Flows: JSON request defaults; custom content-type; FormData handling; 204 returns undefined; error parsing and HttpError mapping.
- endpoints.test.ts — Module: endpoints; Flows: URL builders for thrift stores, articles, auth.
