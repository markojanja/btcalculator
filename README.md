# BTCalculator

A full-stack support-operations platform for trading customer-support teams. BTCalculator combines a Kanban task board, real-time notifications, a knowledge base, client management, an admin dashboard, and a suite of trading calculators (PIP, Profit & Loss, Margin, Swap) in one secure web app.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Data Model](#data-model)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Challenges and Learnings](#challenges-and-learnings)

## Features

**Task management**
- Kanban board with drag-and-drop tasks across `TODO`, `IN_PROGRESS`, `CS_TICKET`, `IT_TICKET` and `COMPLETED` statuses, with `LOW` / `MEDIUM` / `HIGH` priority
- Rich-text task editor (React Quill) with image paste, drop, resize and upload
- Per-task comment threads with edit and delete
- Client assignment on tasks and a shift handover view
- Optimistic UI updates for a responsive board

**Real-time collaboration**
- Socket.IO notifications delivered to per-user and per-role rooms

**Trading tools**
- PIP value, Profit & Loss, Margin and Swap calculators
- Converter tool that processes a JSON symbol file and an XLSX swap table and produces a downloadable result

**Knowledge base**
- User guides with rich content and server-side PDF export (Puppeteer, sanitized HTML)
- New-features / release announcements

**Administration**
- Role-based access control: `ADMIN`, `MANAGER`, `SUPPORT`
- Admin dashboard with task overviews and charts (Chart.js)
- User, client (platform, server, status) and content management
- Per-user profile statistics
- Light / dark theme

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite 6, React Router 7, Tailwind CSS 4, shadcn/ui (Radix UI, Base UI), React Quill, Chart.js, Axios, Socket.IO client, DOMPurify |
| Backend | Node.js (ESM), Express 4, Passport (local strategy), express-session, Socket.IO, Multer, Puppeteer, SheetJS (xlsx), JSDOM + DOMPurify |
| Database | PostgreSQL via Prisma ORM; sessions persisted with `@quixo3/prisma-session-store` |
| Media | Cloudinary (client-side unsigned uploads) |

## Project Structure

```
btcalculator/
├── backend/
│   ├── config/         # Passport and Multer configuration
│   ├── controllers/    # Request handlers
│   ├── db/             # Prisma client
│   ├── middleware/     # isAuth, error handler
│   ├── prisma/         # schema.prisma and migrations
│   ├── routes/         # Express routers
│   ├── services/       # PDF generation, notifications, admin data
│   ├── utils/
│   ├── populate_db.js  # Seed script
│   └── server.js       # Express + Socket.IO entry point
└── frontend/
    ├── components/ui/  # shadcn/ui primitives
    └── src/
        ├── components/ # Kanban, editors, cards, modals
        ├── contexts/   # Auth, Kanban, Notification, Theme, Nav
        ├── hooks/
        ├── pages/      # Route-level views (calculators, admin, guides…)
        └── utils/      # Calculation logic, helpers, constants
```

## Getting Started

### Prerequisites

- Node.js 20.6+ (the backend uses `node --env-file`)
- PostgreSQL
- A Cloudinary account with an unsigned upload preset (for image uploads)

### 1. Clone

```bash
git clone <repository-url>
cd btcalculator
```

### 2. Backend

```bash
cd backend
npm install
# create backend/.env (see Environment Variables)
npm run migrate      # prisma generate + migrate deploy
npm run seed         # optional: create initial admin users
npm run dev          # http://localhost:3500
```

The seed script (`populate_db.js`) creates hard-coded admin accounts with the password taken from `DB_KEYS`. Edit it to suit your team before running it.

### 3. Frontend

```bash
cd frontend
npm install
# create frontend/.env (see Environment Variables)
npm run dev          # Vite dev server
```

## Environment Variables

**`backend/.env`**

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `DATABASE_URL_PROD` | Production connection string, if used |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `CORS` | Allowed frontend origin, e.g. `http://localhost:5173` |
| `PORT` | API port (default `3500`) |
| `NODE_ENV` | `production` enables secure, cross-site cookies and proxy trust |
| `DB_KEYS` | Initial password used by the seed script |

**`frontend/.env`**

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the API |
| `VITE_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_UPLOAD_PRESET` | Cloudinary unsigned upload preset |
| `VITE_API_KEY` | Cloudinary API key |

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | Start API with file watching |
| backend | `npm start` | Start API using `.env` |
| backend | `npm run migrate` | Generate Prisma client and apply migrations |
| backend | `npm run seed` | Seed initial users |
| backend | `npm run build` | Install dependencies and Chrome for Puppeteer (deploy build step) |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run preview` | Preview the production build |
| frontend | `npm run lint` | Run ESLint |

## API Overview

All routes except `/auth/*` require an authenticated session.

| Area | Endpoints |
| --- | --- |
| Auth | `GET /auth/status`, `POST /auth/login`, `POST /auth/logout` |
| Tasks | `GET /tasks/my_tasks`, `POST /tasks/add_task`, `PUT /tasks/edit_task`, `PUT /tasks/delete_task/:id`, `GET /tasks/handover` |
| Comments | `GET /tasks/:id/comments/all`, `POST /tasks/:id/comments/new`, `PUT`/`DELETE /tasks/comments/:id` |
| Users | `GET /users/all`, `POST /users/new`, `GET`/`PUT /users/:id/edit`, `GET /stats/users/:id` |
| Clients | `GET /clients/`, `GET /clients/active`, `POST /clients/new` |
| Guides | `GET /guides`, `GET /guides/:id`, `POST /guides/new`, `GET /guides/:id/pdf` |
| Features | `GET /features/all`, `GET /features/:id`, `POST /features/new` |
| Admin | `GET /admindata`, `GET /admindata/tasks/:type`, `GET /admindata/task/:id` |
| Converter | `POST /` (multipart: `jsonFile`, `xlsxFile`), `GET /downloads/:filename` |

## Data Model

Prisma models: `User`, `Tasks`, `TaskComments`, `Clients`, `Guides`, `Features` and `Session`. Tasks belong to a user and optionally a client; comments belong to a task and a user. See [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

## Deployment

- **Frontend:** built with Vite and deployable to Netlify; [frontend/netlify.toml](frontend/netlify.toml) rewrites all routes to `index.html` for client-side routing.
- **Backend:** deployable to a Node host such as Render. Set `NODE_ENV=production` and use `npm run build` so Puppeteer's Chrome is installed. Cross-site cookies require HTTPS and a `CORS` value matching the frontend origin.

## Screenshots

_Add screenshots of the Kanban board, admin dashboard and calculators here._

## Challenges and Learnings

- Integrating React Quill with custom image upload, paste and drop handlers.
- Optimistic UI updates with explicit rollback when backend requests fail.
- Socket lifecycle management and room-based event design for notifications.
- Relational modeling and safe migrations with Prisma.
- Preventing XSS in rich HTML content through DOMPurify sanitization, including before PDF rendering.
