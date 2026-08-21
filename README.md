# Student & Employee Management System

A full-stack, production-style admin dashboard for managing students and employees,
built with React (Vite + Bootstrap 5) on the frontend and Node.js / Express / MySQL
on the backend, secured with JWT authentication.

---

## 1. Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18 (Vite), Bootstrap 5, vanilla CSS (glassmorphism / dark-light theme), React Router, Axios |
| Backend   | Node.js, Express.js |
| Database  | MySQL (via `mysql2`) |
| Auth      | JWT (`jsonwebtoken`) + `bcrypt` password hashing |
| Validation| `express-validator` (backend) + inline validation (frontend) |

## 2. Project Structure

```
sms-project/
├── backend/
│   ├── config/          # DB pool + environment config
│   ├── controllers/     # Route handlers (auth, students, employees)
│   ├── database/        # schema.sql + seedAdmin.js
│   ├── middleware/      # JWT auth, error handling, validators
│   ├── models/          # SQL data-access layer
│   ├── routes/          # Express routers
│   ├── utils/           # ApiError, asyncHandler, generateToken
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Sidebar, Navbar, modals, badges, etc.
    │   ├── context/      # AuthContext
    │   ├── hooks/        # useAuth, useTheme, useScrollReveal
    │   ├── layouts/       # AdminLayout (sidebar + navbar shell)
    │   ├── pages/         # Login, Dashboard, Students/*, Employees/*, etc.
    │   ├── services/      # Axios instance + API service modules
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    └── package.json
```

## 3. Features

- **JWT-based Admin Authentication** — login with email or username, bcrypt-hashed
  passwords, protected API routes and protected React routes (auto-redirect to
  `/login` on 401 / missing token).
- **Admin Dashboard** — animated stat cards (Total/Active Students & Employees),
  recent-records tables, responsive sidebar + topbar with dark/light mode toggle.
- **Student Management (full CRUD)** — add, view, edit, delete, search, and filter
  by course / year / status.
- **Employee Management (full CRUD)** — add, view, edit, delete, search, and filter
  by department / employee type / status.
- **Search & Filter page** — a dedicated tabbed page to search across students or
  employees.
- **UI polish** — glassmorphism cards, custom cursor (desktop), scroll-reveal
  utility, floating WhatsApp/Call buttons, confirmation modal before delete,
  toast success/error messages, empty states, loading spinners, pagination.
- **Validation** — both frontend (inline field errors) and backend
  (`express-validator`), including required fields, email format, phone format,
  and uniqueness checks on Student ID / Employee ID / email.
- **Security** — bcrypt password hashing, JWT auth middleware on all admin routes,
  parameterized SQL queries (no SQL injection), CORS restricted to the frontend
  origin, `.env` kept out of Git via `.gitignore`.

## 4. Prerequisites

- Node.js 18+ and npm
- MySQL 8+ (or MySQL 5.7+) running locally or accessible remotely

## 5. Database Setup

1. Start MySQL and open a shell:
   ```bash
   mysql -u root -p
   ```
2. Run the schema file (creates the `sms_db` database and all tables):
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
   or, inside the MySQL shell:
   ```sql
   SOURCE backend/database/schema.sql;
   ```

## 6. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your real MySQL credentials and a strong `JWT_SECRET`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sms_db
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173
```

Seed the first admin account (reads `DEFAULT_ADMIN_*` from `.env`):

```bash
npm run seed
```

This prints the admin email + password it created — use these to log in.
**Change this password in any real deployment.**

Start the API server:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 7. Frontend Setup

In a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` should point at your backend:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. You'll be redirected to `/login`.
Log in with the admin credentials printed by `npm run seed`.

## 8. REST API Reference

All routes below (except `/api/auth/login`) require header:
`Authorization: Bearer <token>`

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | `{ identifier, password }` → `{ token, admin }` |
| POST | `/api/auth/logout` | Invalidate client-side session |
| GET  | `/api/auth/profile` | Get current admin profile |

### Students
| Method | Route | Description |
|---|---|---|
| GET | `/api/students` | List, with `?search=&course=&year=&internship=&status=&page=&limit=&sortBy=&sortDir=` |
| GET | `/api/students/stats` | Dashboard totals + recent 5 |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Employees
| Method | Route | Description |
|---|---|---|
| GET | `/api/employees` | List, with `?search=&department=&employeeType=&status=&page=&limit=&sortBy=&sortDir=` |
| GET | `/api/employees/stats` | Dashboard totals + recent 5 |
| GET | `/api/employees/:id` | Get one employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## 9. Notes on Placeholder Content

Form field placeholders such as `[Placeholder: Student's Full Name]` are
intentional hints for whoever enters real data — they are not sample data
seeded into the database. **No mock data is created automatically**; every
record you see in the app comes from what you enter through the UI, backed
by real REST calls to MySQL, per the project requirements.

The floating WhatsApp and Call buttons in `frontend/src/components/FloatingActions.jsx`
use placeholder phone numbers (`+91 00000 00000`) — replace them with a real
support number before deploying.

## 10. Git / Version Control

Both `backend/.gitignore` and `frontend/.gitignore` exclude `node_modules/` and
`.env`. Only `.env.example` files are committed. To initialize:

```bash
cd sms-project
git init
git add .
git commit -m "Initial commit: Student & Employee Management System"
```

## 11. Production Build (Frontend)

```bash
cd frontend
npm run build      # outputs static files to frontend/dist
npm run preview    # preview the production build locally
```

Serve `frontend/dist` with any static host (Nginx, Vercel, Netlify, etc.), and
point `VITE_API_BASE_URL` at your deployed backend's URL before building.

## 12. Troubleshooting

- **"Failed to connect to MySQL"** — verify MySQL is running and the
  `DB_*` values in `backend/.env` are correct; confirm `sms_db` exists
  (run `schema.sql` again if needed).
- **Login fails with "Invalid email/username or password"** — re-run
  `npm run seed` in `backend/`, or check you're using the exact credentials
  it printed.
- **Frontend shows network errors** — confirm the backend is running on the
  port referenced by `VITE_API_BASE_URL`, and that `CLIENT_URL` in
  `backend/.env` matches the frontend's origin (for CORS).
