# Development & Setup

Follow these steps to set up ColegaPoints for local development.

## Prerequisites

- **Node.js**: v22.12.0 or higher
- **Package Manager**: npm

## Getting Started

1. **Clone the repository**:
   ```sh
   git clone https://github.com/jorbush/colegapoints.git
   cd colegapoints
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your values.
   ```sh
   cp .env.example .env
   ```

4. **Set up Turso Database**:
   - Create a database on [Turso](https://turso.tech).
   - Get the URL and Auth Token and add them to your `.env`.
   - Push the schema:
     ```sh
     npm run db:push
     ```

5. **Generate VAPID Keys**:
   Web Push requires VAPID keys for authentication.
   ```sh
   npx web-push generate-vapid-keys
   ```
   Add the public and private keys to your `.env`.

6. **Start the development server**:
   ```sh
   npm run dev
   ```

## Formatting

We use **Prettier** with the `prettier-plugin-astro` and `prettier-plugin-tailwindcss` plugins to ensure consistent styling.

- **Check formatting**: `npm run format:check`
- **Fix formatting**: `npm run format`

## Testing

We use **Vitest** for unit and integration testing.

- **Run all tests**: `npm run test`
- **Watch mode**: `npx vitest`

Tests are located in the `tests/` directory and mirror the application structure.

## Deployment

The project is configured for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Configure the environment variables (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, etc.) in the Vercel dashboard.
3. Vercel will automatically detect the Astro configuration and deploy.
4. Ensure you use the `@astrojs/vercel` adapter (already configured).
