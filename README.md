# ResourceHub

ResourceHub is a fullstack company resource booking platform. Employees can discover shared resources, check availability, create bookings, manage reservations, view the calendar, and update their profile. Administrators can manage resources, review bookings, manage users, and maintain their administrator profile.

## Features

### Employee experience

- Employee dashboard with booking and resource summaries
- Resource directory with search, category, availability filters, and grid/list views
- Resource detail pages with booking conflict detection
- Booking creation and cancellation
- Month and week calendar views
- Profile details and password updates
- SweetAlert confirmations, success messages, and error messages

### Administrator experience

- Administrator dashboard
- Resource create, update, status toggle, and delete operations
- Booking approval and rejection
- User directory with role and search filters
- User activation/deactivation controls
- Separate administrator profile route at `/admin/profile`

### Authentication

- Email and password registration
- Login role detection from the account record
- Session tokens stored in the browser
- Protected administrator API operations
- Password changes using the current password and `scrypt` hashing

## Technology stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form
- Zod
- Recharts
- Lucide React
- SweetAlert2
- date-fns

### Backend

- Node.js
- Express 5
- PostgreSQL
- `pg`
- `dotenv`
- `cors`

## Project structure

```text
resourcehub/
├── Backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── .env.local
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer
- Git

## Installation

Clone the repository and install dependencies for both applications:

```powershell
git clone https://github.com/ChaminduNevandith/resourcehub.git
cd resourcehub

cd Backend
npm install

cd ..\Frontend
npm install
```

## Database setup

Create a PostgreSQL database named `resourcehub`:

```sql
CREATE DATABASE resourcehub;
```

Apply the schema and seed resources/bookings:

```powershell
psql -U postgres -d resourcehub -f Backend\database\schema.sql
```

The backend also initializes the required tables when it starts. The schema contains:

- `users`
- `sessions`
- `resources`
- `bookings`

The seed script is safe to run repeatedly because seed rows use `ON CONFLICT DO NOTHING`.

## Environment variables

### Backend

Create `Backend\.env` if you need values different from the defaults:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=resourcehub
DB_SSL=false
```

The backend defaults to:

```text
host: localhost
port: 5432
user: postgres
password: postgres
database: resourcehub
```

Do not commit `Backend\.env` or database credentials.

### Frontend

Create `Frontend\.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If this variable is not set, the frontend uses the same default API URL.

## Running the project

Start the backend in one terminal:

```powershell
cd Backend
npm run dev
```

Start the frontend in another terminal:

```powershell
cd Frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend API is available at:

```text
http://localhost:5000/api
```

## Frontend routes

### Public routes

`/` - Redirects to `/login` -
`/login` - Sign-in page 
`/register` - Account registration 
`/forgot-password` - Reserved link from the login flow; page is not currently implemented 

### Employee routes

`/dashboard` - Employee dashboard 
`/resources` - Searchable resource directory 
`/resources/[id]` - Resource details and booking form 
`/bookings` - Current employee bookings 
`/calendar` - Employee booking calendar 
`/profile` - Employee profile and password settings 

### Administrator routes


`/admin` - Administrator dashboard 
`/admin/resources` -  Resource management 
`/admin/bookings` - Booking management 
`/admin/users` - User management 
`/admin/profile` - Administrator profile and password settings 

Employee and administrator profiles intentionally use separate routes.

## Backend API

All API endpoints are prefixed with `/api`.

### Health

GET - `/api/health` - Public 

### Authentication


POST - `/api/auth/register` - Public 
POST - `/api/auth/login` - Public 
GET - `/api/auth/me` - Bearer token 
PUT - `/api/auth/me` - Bearer token 
PUT - `/api/auth/me/password` - Bearer token 
POST - `/api/auth/logout` - Bearer token when available 
GET - `/api/auth/users` - Administrator 

Login accepts only the account email and password. The server determines whether the account is an employee or administrator.

Example login request:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Resources


| GET - `/api/resources` - Public 
| GET - `/api/resources/:id` - Public 
| GET - `/api/resources/:id/bookings` - Public 
| POST - `/api/resources` - Administrator 
| PUT - `/api/resources/:id` - Administrator 
| DELETE - `/api/resources/:id` - Administrator 

### Bookings


 GET - `/api/bookings` - Public 
 GET - `/api/bookings/:id` - Public 
 POST - `/api/bookings` - Bearer token 
 PUT - `/api/bookings/:id/status` - Administrator 
 PUT - `/api/bookings/:id/reschedule` - Bearer token 
 DELETE - `/api/bookings/:id` - Administrator 

Authenticated requests use:

```http
Authorization: Bearer <session-token>
```

## Roles and access

The application has two roles:

- `employee`
- `administrator`

The role is stored with the user account and returned by the login endpoint. The frontend routes users based on the returned role:

- Administrator → `/admin`
- Employee → `/dashboard`

Administrator API routes are protected by `requireAuth` and `requireAdmin` middleware. Frontend administrator pages also redirect unauthorized users to `/dashboard`.


