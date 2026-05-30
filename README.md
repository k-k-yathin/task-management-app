# TaskFlow — Full-Stack Task Management App

A modern task management application with JWT authentication, PostgreSQL, and a responsive React dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, Tailwind CSS, React Router, Axios, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcrypt |

## Features

- **Authentication**: Register, login, logout with JWT and protected routes
- **Tasks**: Full CRUD with title, description, status, priority, and due date
- **Filtering**: Filter by status, search tasks, sort by due date / created date / priority
- **Dashboard**: Statistics overview (total, todo, in progress, completed, overdue)
- **UI**: Responsive sidebar, task cards, loading states, error handling

## Project Structure

```
task-manage-app/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── index.ts
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── types/
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm

## Quick Start

### 1. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user (protected) |

### Tasks (all protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (`?status`, `?search`, `?sortBy`, `?sortOrder`) |
| GET | `/api/tasks/stats` | Dashboard statistics |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Example: Create Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish project",
    "description": "Complete the task management app",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-06-15T00:00:00.000Z"
  }'
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## Production Build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build
```

Serve the `frontend/dist` folder with any static host and point `VITE_API_URL` to your production API.

## License

MIT
