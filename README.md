# ⭐ ColegaPoints ⭐

**The community ledger for friends, teams, and colleagues.**

ColegaPoints is a lightweight, community-driven point tracking system designed to celebrate contributions, track favors, or just have fun with a "social ledger" among friends. Built with a bold **Neo-Brutalist UI**, it's fast and real-time.

![Neo-Brutalist Design](https://img.shields.io/badge/Design-Neo--Brutalist-black?style=for-the-badge)
![Astro](https://img.shields.io/badge/Astro-6.3.3-BC52EE?style=for-the-badge&logo=astro)
![Turso](https://img.shields.io/badge/Turso-LibSQL-00A3FF?style=for-the-badge&logo=turso)

## ✨ Features

- 🏗️ **Neo-Brutalist UI**: High-contrast, bold design that stands out.
- 🔔 **Push Notifications**: Get notified when you receive points or when new members join.
- 📊 **Ledger System**: Track every point event with reasons and timestamps.
- 📱 **Mobile First**: Fully responsive and optimized for mobile interactions.
- ⚡ **Blazing Fast**: Powered by Astro and LibSQL for near-instant responses.

## 🚀 Quick Start

```sh
# Clone and install
git clone https://github.com/jorbush/colegapoints.git
cd colegapoints
npm install

# Setup environment
cp .env.example .env
# Fill in your Turso and VAPID keys!

# Push schema and start
npm run db:push
npm run dev
```

## 📚 Documentation

For more detailed information, check out our documentation:

- 🏗️ [**Architecture**](docs/architecture.md) - Deep dive into the tech stack and project structure.
- 🔌 [**API Reference**](docs/api.md) - Complete documentation of the available endpoints.
- 🛠️ [**Development & Setup**](docs/development.md) - How to set up, test, and deploy the project.

## 🧞 Commands

| Command             | Action                                      |
| :------------------ | :------------------------------------------ |
| `npm run dev`       | Starts local dev server at `localhost:4321` |
| `npm run build`     | Build your production site to `./dist/`     |
| `npm run test`      | Run the Vitest test suite                   |
| `npm run format`    | Run Prettier to format the codebase         |
| `npm run db:push`   | Push schema changes to the database         |
| `npm run db:studio` | Open Drizzle Studio to browse data          |
