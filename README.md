# Full-Stack Web Application (React + Django + PostgreSQL)

This project is a full-stack web application consisting of a **React frontend**, **Django backend**, and **PostgreSQL database**. The frontend and backend source code is contained within the same GitHub repository, and both the frontend and backend have separate `.env` files for environment-specific configurations. The application is containerized using Docker and Docker Compose.

## Table of Contents

- [System Design and Architecture](#system-design-and-architecture)
- [Technologies](#technologies)
- [Running the System](#running-the-system)
  - [Running with Docker](#running-with-docker)
  - [Running without Docker](#running-without-docker)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## System Design and Architecture

The application follows a **client-server architecture** where the frontend (React) communicates with the backend (Django) via HTTP requests. The backend handles business logic and data persistence, while PostgreSQL serves as the database.

1. **Frontend (React)**: The React application serves the user interface, fetching and sending data from and to the backend through API calls. It is built with a Node.js environment and served via Nginx in production.

2. **Backend (Django)**: The Django backend exposes RESTful API endpoints for the frontend to interact with the database. It manages user authentication, request processing, and data manipulation.

3. **Database (PostgreSQL)**: The PostgreSQL database is used to store application data, including user information, events, and other entities relevant to the application.

4. **Containerization (Docker)**: The entire system is containerized using Docker. The frontend, backend, and PostgreSQL each run in separate containers, orchestrated with Docker Compose for ease of deployment and development.

---

## Technologies

- **React** (Frontend)
- **Django** (Backend)
- **PostgreSQL** (Database)
- **Docker & Docker Compose** (Containerization)
- **Nginx** (Frontend web server)
- **Python** (Backend language)
- **Node.js** (Frontend environment)

---

## Running the System

### Running with Docker

To run the entire system with Docker and Docker Compose, follow the steps below:

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Configure Environment Variables

Make sure both the frontend and backend .env files are properly configured. Here's a sample .env for each:

- **Frontend** (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

- **Backend** (.env)

```env
APP_ENV=dev
SECRET_KEY=secret_key
DEBUG=True
DB_NAME=mydatabase
DB_USER=myuser
DB_HOST=localhost
DB_PASSWORD=mypassword
DB_PORT=5432
```

### 3. Create Dockerfiles

Create Dockerfile for the frontend and backend.

- **Frontend Dockerfile** (frontend/Dockerfile):

```dockerfile
# Stage 1: Build the frontend
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the React build from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

- **Backend Dockerfile** (backend/Dockerfile):

```dockerfile
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the application code
COPY . /app/

# Expose the port
EXPOSE 8000

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### 4. Create Nginx Config

Create nginx.conf for the frontend in the frontend directory.

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### 5. Create Docker Compose File

Create docker-compose.yml at the root of your project.

```yaml
version: '3'

services:
  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:80"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
    networks:
      - my-network

  backend:
    build:
      context: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db
    networks:
      - my-network

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    env_file:
      - ./backend/.env
    networks:
      - my-network

networks:
  my-network:
    driver: bridge

volumes:
  postgres_data:
```

### 6. Build and Run Containers

Run the following command to build and start the containers:

```bash
docker-compose up --build
```

This will:

- Build the frontend and backend images.
- Create containers for the frontend, backend, and PostgreSQL database.
- Automatically start the system and set up network communication between services.

### 7. Access the Application

- Frontend: [http://localhost:3000]
- Backend: [http://localhost:8000]

### 8. Stopping the Containers

To stop the running containers, run:

```bash
docker-compose down
```

## Running without Docker

If you prefer running the application locally without Docker, follow these steps:

### 1. Install Dependencies

You will need to install the dependencies for both the frontend and backend.

#### 1.1 Frontend (React)

Navigate to the frontend directory and install the necessary Node.js packages:

```bash
cd frontend
npm install
```

To run the React development server:

```bash
npm start
```

The React frontend will now be accessible at [http://localhost:3000].

#### 1.2 Backend (Django)

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv env
source env/bin/activate   # On Windows, use `env\Scripts\activate`
```

Install the Python dependencies from the requirements.txt file:

```bash
pip install -r requirements.txt
```

Run the following command to start the Django development server:

```bash
python manage.py runserver
```

The Django backend will now be accessible at [http://localhost:8000].

### 2. Set up PostgreSQL

You will need to install and run PostgreSQL locally. Make sure you configure the same environment variables in your .env file.

```bash
# Sample PostgreSQL commands
psql -U postgres
CREATE DATABASE mydatabase;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
```

Once PostgreSQL is running, run the following command to apply migrations:

```bash
python manage.py migrate
```

You can now access both the frontend and backend locally.

## Environment Variables

Each service has its own .env file. The following variables need to be configured:

### Frontend (frontend/.env):

- `VITE_API_BASE_URL`: The URL of the Django backend (e.g., `http://localhost:8000`).

### Backend (backend/.env):

- `APP_ENV`: Application environment.
- `SECRET_KEY`: Django's secret key.
- `DEBUG`: Set to `True` for development mode.
- `DB_NAME`: Name of the PostgreSQL database.
- `DB_USER`: PostgreSQL user.
- `DB_HOST`: The hostname for the PostgreSQL database.
- `DB_PASSWORD`: PostgreSQL password.
- `DB_PORT`: The port for the PostgreSQL database (default is 5432).
