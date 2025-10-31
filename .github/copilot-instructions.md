# Copilot Instructions for AI-Agent-MERN-and-Python

## Project Overview
- **Monorepo** with `backend` (Node.js/Express/Mongoose) and `frontend` (React/Vite/Firebase) folders.
- **Backend**: REST API for tasks and users, MongoDB via Mongoose, modular structure (controllers, models, routers, utils).
- **Frontend**: React app using Vite, context for auth, Firebase integration, modular components/pages.

## Key Architectural Patterns
- **Backend**
  - Entry: `backend/index.js` (sets up Express, connects MongoDB)
  - DB connection: `src/connection/mongooseConnection.js`
  - REST endpoints: `src/routers/` (routes), `src/controllers/` (logic), `src/models/` (Mongoose schemas)
  - Example: `taskRouter.js` → `taskController.js` → `taskModel.js`
- **Frontend**
  - Entry: `frontend/src/main.jsx`
  - Routing: `frontend/src/routers/router.jsx`
  - Auth: `frontend/src/context/AuthContext.jsx`, Firebase config in `frontend/src/firebase/`
  - UI: Components in `frontend/src/components/`, pages in `frontend/src/pages/`

## Developer Workflows
- **Backend**
  - Install: `cd backend && npm install`
  - Run: `npm start` (ensure MongoDB is running)
  - Main dev file: `index.js`
- **Frontend**
  - Install: `cd frontend && npm install`
  - Run: `npm run dev`
  - Main dev file: `src/main.jsx`

## Project-Specific Conventions
- **Controllers**: All business logic in `src/controllers/`, no DB logic in routers.
- **Models**: All Mongoose schemas in `src/models/`.
- **Routers**: Only route definitions, import controllers.
- **Frontend**: Use context for auth, keep UI logic in components, page logic in `pages/`.
- **Env config**: Sensitive keys (e.g., Firebase, MongoDB URI) should be in `.env` (not committed).

## Integration Points
- **Frontend ↔ Backend**: Use `frontend/src/utils/getBackendUrl.js` to determine API base URL.
- **Firebase**: Config in `frontend/src/firebase/firebaseConfig.js`.
- **MongoDB**: Connection in `backend/src/connection/mongooseConnection.js`.

## Examples
- To add a new API route: create model → controller → router, then register router in `index.js`.
- To add a new page: create in `frontend/src/pages/`, add route in `router.jsx`, use components as needed.

---
For more, see `frontend/README.md` and code comments. Ask for clarification if a pattern is unclear or missing.
