# ResourceHub backend

This backend is built for the ResourceHub frontend and is designed to run with PostgreSQL locally.

## 1) Start PostgreSQL
Make sure PostgreSQL is running locally, and create a database named `resourcehub`.

Example:

```bash
createdb resourcehub
```

## 2) Create the tables
Run the SQL in `database/schema.sql` against the `resourcehub` database.

Example:

```bash
psql -d resourcehub -f database/schema.sql
```

## 3) Configure environment
Copy `.env.example` to `.env` and adjust values if needed.

```bash
copy .env.example .env
```

## 4) Install and run
```bash
npm install
npm run dev
```

The API runs on:
- http://localhost:5000/api/health
- http://localhost:5000/api/resources
- http://localhost:5000/api/bookings

## Available routes
- GET /api/health
- GET /api/resources
- GET /api/resources/:id
- GET /api/resources/:id/bookings
- GET /api/bookings
- GET /api/bookings/:id
- POST /api/bookings
- PUT /api/bookings/:id/status
- DELETE /api/bookings/:id
- POST /api/resources

If PostgreSQL is not available, the server falls back to in-memory demo data so the frontend still works during development.
