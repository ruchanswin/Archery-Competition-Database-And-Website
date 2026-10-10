# Archery Competition Database and Website

The website is built with TypeScript, Express, EJS templates, Bootstrap, and
Supabase-hosted PostgreSQL. PHP pages and PHP database handlers have been
replaced by a Node.js application.

## Requirements

- Node.js 20 or later
- A Supabase project with a PostgreSQL database

## Setup

1. Install dependencies with `npm install`.
2. In the Supabase dashboard, open **Project Settings → Database**, copy the
   connection string for your project, and set it as `DATABASE_URL` in a
   local `.env` file based on `.env.example`. Use the URI format and require
   SSL. Keep the URL private; it contains a database password.
3. In the Supabase dashboard, open **SQL Editor**, run
   [`supabase/schema.sql`](./supabase/schema.sql), and check that it completed.
4. In the SQL Editor, run [`supabase/seed.sql`](./supabase/seed.sql) to load the
   competition, category, class, division, round, distance, and target-face
   records from the latest SQL export.
5. (Optional) Run [`supabase/sample-archers.sql`](./supabase/sample-archers.sql)
   to add clearly fictional archer rows for local testing and copy the matching
   staged memberships into `ArcherCategory`. These are not real competitor
   records.
6. Run `npm run dev` for local development, or run `npm run build` followed by
   `npm start` for a production build.
7. Open `http://localhost:3000`.

## Routes

- `GET /` — select an archer and competition.
- `POST /archer` — show the archer's competition and round details.
- `GET /records` — point-recording page.
- `GET /recorder` — recorder page.
- `GET /api/competitions` — competitions as JSON.
- `GET /api/archers` — archers as JSON.
- `GET /api/archers/:archerId?competitionId=:competitionId` — one archer's
  competition details as JSON.

The Supabase schema and seed data are based on the latest checked-in MySQL
export. That export does not contain real archer details. Its `ArcherCategory`
rows are preserved in `ArcherCategoryImport` rather than inserted into the live
relationship table. For test-only display data, the optional sample archer
script creates fictional rows matching the staged ArcherIDs and copies their
memberships into `ArcherCategory`. Do not use these fictional rows as
competitor records. When you have the real archer details, import them into
`Archer` and then copy the matching staged memberships into `ArcherCategory`.

The app connects server-side using the PostgreSQL connection string; do not put
database credentials or a Supabase service-role key in client-side code.
