# Architecture Guide

ColegaPoints is built with a modern, high-performance stack focusing on developer experience and speed.

## Tech Stack

- **Framework**: [Astro 5.0+](https://astro.build)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (Neo-Brutalist design)
- **Database**: [LibSQL](https://github.com/tursodatabase/libsql-client-ts) (via Turso)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **i18n**: Built-in Astro routing for multilingual support (English, Spanish, Catalan)
- **Push Notifications**: Web Push API

## Project Structure

```text
/
├── docs/           # Documentation
├── public/         # Static assets
├── src/
│   ├── components/ # Reusable UI components
│   ├── db/         # Database schema and client configuration
│   ├── layouts/    # Page layouts
│   ├── lib/        # Shared utilities and logic
│   ├── pages/      # Application routes and API endpoints
│   └── styles/     # Global CSS and Tailwind configuration
├── tests/          # Vitest test suite
├── astro.config.mjs
├── drizzle.config.ts
└── package.json
```

## Data Model

The application uses three primary tables:

1. **Groups**: Community spaces identified by a short `nanoid` slug.
2. **Members**: Individuals within a group, featuring an avatar emoji and optional push subscription.
3. **PointEvents**: A ledger of point transactions (`delta`) between members.

For more details, see [src/db/schema.ts](file:///Users/jordi/dev/colegapoints/src/db/schema.ts).

## Push Notifications

Real-time updates are handled via the Web Push API. When a member joins or receives points, the server triggers notifications to other group members who have subscribed.
