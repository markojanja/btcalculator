# BTCalculator

BTCalculator is a full‑stack task management and trading utility application built for customer support team. It combines a Kanban‑style task board, a role‑based admin dashboard, real‑time notifications, and a set of trading calculators (PIP, Profit & Loss, Margin, Swap) to streamline support workflows and speed up trading‑related responses.

## Project Description

BTCalculator centralizes ticket handling and trading calculations into a single, secure interface. Support agents can create and move tasks on a Kanban board, attach formatted content and images, comment on tasks, and run quick financial calculations. Admins use a dedicated dashboard to manage users, clients, and tasks. Real‑time notifications keep teams synchronized.

## Features

- Kanban board with draggable tasks and lifecycle management
- Task editor with rich text (image paste/upload) and client assignment
- In‑task commenting system
- Real‑time notifications for assignments, comments and status changes (Socket.IO/WebSockets)
- Admin dashboard for user, client and task management
- Trading tools: PIP, Profit & Loss (PnL), Margin, Swap calculators
- Role‑based authentication and permissioning (Admin, Manager, Support)
- Image uploads via Cloudinary
- Optimistic UI updates for a responsive experience

## Technologies Used

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, React‑Quill
- Backend: Node.js, Express, Prisma ORM
- Database: PostgreSQL
- Realtime: Socket.IO / WebSockets
- Auth: Passport (session) or JWT (configurable)
- Image hosting: Cloudinary
- Dev tooling: VS Code, Git, Postman, Prisma Migrate

## Usage

- Register or sign in. Admin accounts can manage users and clients via the Admin Dashboard.
- Use the Kanban board to create, assign, and move tasks between columns (TODO, IN_PROGRESS, CS_TICKET, IT_TICKET).
- Open a task to edit title, assign client, update status/priority, add rich descriptions and images, and view/add comments.
- Use the Tools section to run PIP, PnL, Margin and Swap calculations with immediate results.
- Real‑time notifications inform users about assignments, status updates.

## Demo / Screenshots

## Challenges and Learnings

- Integrating React‑Quill with custom image upload and paste/drop behavior required creating robust upload handlers and sanitization.
- Implementing optimistic UI updates improved UX but required explicit rollback/error handling when backend requests fail.
- Building real‑time notifications taught socket lifecycle management, reconnection strategies, and event design.
- Designing a Prisma schema for tasks, clients and comments reinforced relational modeling and safe migrations.
- Securing rich HTML output with sanitization (e.g., DOMPurify) to prevent XSS while preserving formatting.
