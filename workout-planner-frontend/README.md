# Maximize Motors — Dealership CRM

Framework-free ES-module frontend served by **Bun**, custom-tailored for automotive dealership management.
Talks to the Spring Boot backend at `http://localhost:8081/api` via the built-in reverse proxy in `server.ts`.

## Dealership Architecture & Module Mapping
| Dealership CRM Page | Backend Entity & API Route | Description |
|---|---|---|
| **Overview & KPIs** | `/dashboard` (Aggregated) | Live showroom KPIs, sales pipeline funnel, recent leads & activities |
| **Vehicle Inventory** | `/products` | Vehicle models, categories, MSRP, dealer discounts, and lot stock |
| **Buyers** | `/customers` | Client database, contact info, purchase opportunities, and test drives |
| **Potential Buyers** | `/leads` | Prospect pipeline, acquisition sources, qualification status, and vehicle interests |
| **Sales Pipeline** | `/opportunities` | Deal stages (`OPEN` → `NEGOTIATION` → `WON` → `LOST`), estimated values, and close dates |
| **Activities & Test Drives** | `/activities` | Scheduled showroom appointments, follow-up calls, and vehicle test drives |
| **Dealership Campaigns** | `/campaigns` | Seasonal sales events, financing promotions, and marketing budgets |
| **Sales Staff** | `/users` | Dealership sales advisors, managers, direct contact phone numbers, and permissions |

## Run
```bash
bun --version          # bun 1.4+ recommended
cp .env.example .env   # configure PORT=3000, BACKEND_URL=http://localhost:8081
bun run dev            # starts frontend with live reload on port 3000
```
Open [http://localhost:3000](http://localhost:3000) and log in with your sales staff credentials.

## Connect to the backend
1. Start your Spring Boot backend on port 8081 (with PostgreSQL running).
2. Start this frontend (`bun run dev`).
3. The frontend proxy in `server.ts` routes all `/api/*` requests directly to `http://localhost:8081/api/*`, eliminating cross-origin (CORS) complications.

## Integration Enhancements Implemented
- **Normalized Response Handling**: Robustly handles both raw JSON arrays (`[...]`) and Spring Data `Page<T>` responses (`{ content: [...], totalElements: N }`).
- **Preserved String Phone Numbers**: Staff, Buyer, and Lead phone numbers preserve leading zeros and international formatting rather than being coerced into JavaScript numbers.
- **Automotive UI & Design System**: Refined graphite/charcoal backdrop, warm white cards, restrained crimson accents, SVG icon system, responsive layout, and mobile drawer.
- **Live Search & Skeleton Loaders**: Shimmering skeleton loaders replace plain spinners, and instant table search allows quick filtering across all dealership records.
