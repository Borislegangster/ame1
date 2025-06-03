## Getting Started

### Prerequisites

This project requires OpenSSL to be installed for database operations. Since we're running in a browser-based environment, we'll use SQLite instead of PostgreSQL, which doesn't require OpenSSL.

### Setup Steps

1. Run `npm install`
2. Run `npm run server` to start the backend API server
3. In a new terminal, run `npm run dev` to start the frontend development server

Both servers must be running simultaneously for the application to work properly:
- Backend API server runs on port 3000
- Frontend development server runs on port 5173