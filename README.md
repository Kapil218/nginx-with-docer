                            ┌────────────┐
                            │   Client   │
                            └────┬───────┘
                                 │
                                 ▼
                        ┌────────────────┐
                        │     NGINX      │  ← reverse proxy
                        └────┬──────┬────┘
                             │      │
           ┌────────────────┘      └──────────────┐
           ▼                                       ▼
   ┌─────────────┐                         ┌─────────────┐
   │  Frontend   │                         │  Backend    │
   │ (Vue/React) │                         │ (Node.js)   │
   └─────────────┘                         └─────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  Database   │
                                           │ (MongoDB)   │
                                           └─────────────┘

# My Full Stack Application

A simple full-stack application built with Node.js, Express, PostgreSQL, and Docker.

## Architecture

- **Frontend**: Vanilla JavaScript with Vite bundler
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Features

- ✅ RESTful API with Express.js
- ✅ PostgreSQL database integration
- ✅ CORS enabled for frontend-backend communication
- ✅ User management (Create, Read operations)
- ✅ Health check endpoint
- ✅ Responsive web interface
- ✅ Docker containerization for all services

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system

### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database: localhost:5432

### API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check with database connection test
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Environment Variables

Backend environment variables are configured in `backend/.env`:

```env
DB_HOST=postgres
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
DB_PORT=5432
PORT=3000
NODE_ENV=development
```

## Development

### Backend Development

The backend uses:
- Express.js for the web framework
- pg (node-postgres) for PostgreSQL connection
- CORS for cross-origin requests
- dotenv for environment variables
- nodemon for development auto-reload

### Frontend Development

The frontend uses:
- Vite for fast development and building
- Vanilla JavaScript (no framework)
- Modern CSS with responsive design
- Fetch API for backend communication

### Database

PostgreSQL database automatically:
- Creates the `users` table when needed
- Handles user creation with email uniqueness
- Provides connection health monitoring

## Docker Services

- **postgres**: PostgreSQL 15 database
- **backend**: Node.js API server (port 3000)
- **frontend**: Vite development server (port 5173)

## Troubleshooting

1. **Backend not connecting to database**: Wait a moment for PostgreSQL to fully start up
2. **Frontend can't reach backend**: Ensure all containers are running and ports are correct
3. **Port conflicts**: Check if ports 3000, 5173, or 5432 are already in use

## Project Structure

```
my-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   └── .env
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       └── style.css
└── README.md
```
