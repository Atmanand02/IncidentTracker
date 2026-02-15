# Software Engineer Assignment – Submission

**Candidate:** [Your Full Name]

**Date:** February 2026

---

## GitHub Repository

**Link:** [PASTE YOUR GITHUB REPO URL HERE]

Example: `https://github.com/yourusername/incident-tracker-mini-app`

---

## Project: Incident Tracker Mini App

Full-stack web application for creating, browsing, and managing production incidents.

- **Frontend:** React (Vite), React Router, TanStack Query, React Hook Form, Zod  
- **Backend:** Java Spring Boot, JPA, MySQL / H2  
- **Features:** Paginated list, filters, search, sort, create incident, view/edit incident  

### How to run

1. **Backend:** `cd backend` → `mvn spring-boot:run` (or with `-Dspring-boot.run.profiles=h2` for H2).  
2. **Frontend:** `cd frontend` → create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8080` → `npm install` → `npm run dev`.  
3. Open the URL shown (e.g. http://localhost:5173).

Full setup, API overview, and design notes are in the **README.md** in the repository.

---

*Submitted as part of the Software Engineer Drive Assignment.*
