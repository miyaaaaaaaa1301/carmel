# Carmels in Communion

A React and Express prototype for the Philippine Federation of Discalced Carmelite Nuns. The client contains the public website and administration dashboard; the server provides API routes backed by PostgreSQL and Prisma.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL for database-backed API features

## Run locally

Install dependencies from the project root:

```powershell
npm install
npm --prefix client install
npm --prefix server install
```

Copy `server/.env.example` to `server/.env` and set the database URL and secrets for your environment. Then prepare the database and start the client and API:

```powershell
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The website runs at http://localhost:5173 and the API runs at http://localhost:4000. The database commands require a running PostgreSQL instance configured in `server/.env`.

To build both applications, run `npm run build`.

## Prototype access

The client includes browser-local prototype authentication. Sign in with `admin@carmel.test` and `CarmelDemo2026!`, or create a Formator account from the sign-in page. These prototype accounts are stored in the current browser's local storage, not in PostgreSQL, and are not suitable for production security. Clearing browser storage removes them.

Database-backed authentication and API routes are separate and require the server configuration above. Never commit `server/.env` or production secrets; only the `.env.example` template belongs in Git.
