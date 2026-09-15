# DevLog

## What It Is

DevLog is a web app for recording programming bugs, errors, and their solutions so I can refer to them when I face similar problems again.

## The Problem It Solves

While learning and building projects, I often encounter errors that take time to solve, but later I forget what caused them or how I fixed them. DevLog stores these problems and solutions in one place so I can quickly refer back to them instead of solving the same issue from scratch.

## What I Intentionally Excluded

- User authentication: This is a personal MVP, so adding login, sessions, or JWT authentication would introduce unnecessary backend complexity without improving the core problem.
- Search and filtering: The initial version focuses on the core CRUD workflow. Advanced search can be added later if the number of saved bugs becomes large.

## Tech Stack

- Backend: Node.js + Express
- Database: SQLite
- Frontend: HTML + CSS + Vanilla JavaScript
- Backend Deployment: Render
- Frontend Deployment: Netlify

## Live Deployment

**Frontend:** https://lively-cascaron-901bb3.netlify.app

**Backend:** https://devlog-backend-u7xo.onrender.com

## CRUD Routes

- POST /bugs
- GET /bugs
- PUT /bugs/:id
- DELETE /bugs/:id

## Health Check

- GET /health
