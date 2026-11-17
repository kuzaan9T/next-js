# TaskFlow

A simple task manager built with Next.js. Sign up, add tasks and drag them across a Kanban board.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Authentication | Better Auth (email + password and magic links) |
| Database / ORM | MongoDB + Mongoose |
| Advanced feature | Drag-and-drop Kanban board with dnd-kit |
| Validation | Zod |

## Features

- Register, log in with a password or a magic link, log out
- Protected dashboard and API routes, each user only sees their own tasks
- Create, edit and delete tasks with title, description and status
- Drag tasks between To Do, In Progress and Done, order is saved to the database
- Keyboard and touch support for dragging
- Form validation, loading states, error handling and a responsive layout

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy the example env file and fill it in

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   | --- | --- |
   | `MONGODB_URI` | MongoDB connection string including the database name |
   | `BETTER_AUTH_SECRET` | Long random string, generate one with `openssl rand -base64 32` |
   | `BETTER_AUTH_URL` | Base URL of the app, `http://localhost:3000` locally |
   | `RESEND_API_KEY` | Optional. Needed to email magic links. Without it, links are printed in the dev server terminal |
   | `EMAIL_FROM` | Optional sender address for magic link emails |

3. Start the dev server

   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## API

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/sign-up/email` | Register |
| `POST` | `/api/auth/sign-in/email` | Log in with password |
| `POST` | `/api/auth/sign-in/magic-link` | Send a magic link |
| `POST` | `/api/auth/sign-out` | Log out |
| `GET` | `/api/tasks` | List your tasks |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get one task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `PUT` | `/api/tasks/reorder` | Save new positions after a drag |

All task routes return `401` when you are not logged in and `404` for tasks that do not belong to you.

## Project structure

```
app/
  (auth)/login, (auth)/register   auth pages
  dashboard/                      protected board page
  api/auth/[...all]/              Better Auth handler
  api/tasks/                      task CRUD and reorder routes
components/                       board, columns, cards, forms, modal
lib/                              auth, database, validation, API client
models/Task.ts                    Mongoose task model
proxy.ts                          redirects signed out users away from /dashboard
```

## Deploying to Vercel

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), add a database user, allow access from `0.0.0.0/0` under Network Access and copy the connection string. Add a database name to it, for example `.../taskflow?retryWrites=true&w=majority`.
2. Import the GitHub repo on [Vercel](https://vercel.com/new) and set **Root Directory** to `TaskFlow`.
3. Add the environment variables: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your Vercel URL, for example `https://taskflow-yourname.vercel.app`) and, for magic links, `RESEND_API_KEY`.
4. Deploy. If the final URL is different from `BETTER_AUTH_URL`, update the variable and redeploy.
