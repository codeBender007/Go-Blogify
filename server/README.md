# Backend (Go + Gin + PostgreSQL + JWT)

## Prerequisites
- Go 1.22+
- PostgreSQL running locally
- `DATABASE_URL` in `.env` set to your Postgres connection string

## Setup
```bash
cp .env.example .env
go mod tidy
go run main.go
```

The server starts at `http://localhost:$PORT` (default 8080).

## API Overview
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (auth)
- `POST /blogs` (auth)
- `GET /blogs` (public, pagination: `?page=1&limit=10`)
- `GET /blogs/:id` (public)
- `PUT /blogs/:id` (auth + owner)
- `DELETE /blogs/:id` (auth + owner)
- `POST /blogs/:id/comments` (auth)
- `GET /blogs/:id/comments` (public)
- `POST /blogs/:id/like` (auth, toggles like/unlike)
```

## Notes
- Auto-migrations run on startup.
- CORS enabled for `http://localhost:5173` (Vite default).
