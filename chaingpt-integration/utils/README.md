# Utils — ChainGPT Transport

Low-level helpers to communicate with ChainGPT reliably.

- http.ts — Fetch wrapper with retries, timeouts, and JSON guards
- cache.ts — Request hashing and short-lived result cache
- rateLimit.ts — Token bucket for client-side throttling

> Lore: The maintenance ducts where reliability gremlins are tamed.