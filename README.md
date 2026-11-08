# Cinemania Full-Stack Web Platform

![Backend CI](https://github.com/baboopsc/cinemania-fullstack/actions/workflows/backend-ci.yml/badge.svg)

Cinemania is a movie discovery and tracking platform: a responsive frontend that consumes the TMDB API, and a NestJS REST API for users and movie comments.

## Tech Stack
* **Frontend:** JavaScript (Vite), HTML5, CSS3, Axios
* **Backend:** TypeScript (NestJS), TypeORM, PostgreSQL (Neon) with SQLite for local development
* **Testing:** Jest (unit), Supertest (end-to-end API tests)
* **DevOps:** Docker, Docker Compose, GitHub Actions CI
* **External API:** TMDB

## Project Structure
* `/frontend` – Vite-based UI, modular CSS, TMDB data consumption
* `/backend` – NestJS REST API: users and comments, input validation, tests
* `/.github/workflows/backend-ci.yml` – builds the API and runs all tests on every push, against both SQLite and PostgreSQL

## API Endpoints
| Method | Path | Description |
|---|---|---|
| `POST` | `/users` | Create a user (`username`, `email`); duplicate email → 409 |
| `GET` | `/users` | List users |
| `GET` | `/users/:id` | Get one user; unknown id → 404 |
| `POST` | `/comments` | Add a comment (`movieId`, `content`, optional `rating` 0–10, `userId`) |
| `GET` | `/comments/:movieId` | List a movie's comments with their authors, newest first |

Invalid input returns `400 Bad Request`.

## Running the backend locally
```bash
cd backend
npm install
cp .env.example .env   # optional: set DATABASE_URL to use PostgreSQL / Neon
npm run start:dev      # http://localhost:3000
```
Without `DATABASE_URL` the API uses a local SQLite file, so no database install is needed.

## Tests
```bash
cd backend
npm test           # unit tests
npm run test:e2e   # end-to-end API tests (in-memory SQLite)
```
> The e2e tests reset the database schema. Never run them with your production `DATABASE_URL`.

## Docker
```bash
docker compose up --build   # API + PostgreSQL, API on http://localhost:3000
```

## Contributors
* Ali Muhsin Mışraklı
* Okan Karahan
