# Full-Stack Web Application (React + Django + PostgreSQL + Docker)
This project is a full-stack web application consisting of a React frontend, Django backend, and PostgreSQL database. The frontend and backend source code is contained within the same GitHub repository, and both the frontend and backend have separate .env files for environment-specific configurations. The application is containerized using Docker and Docker Compose.

Table of Contents
System Design and Architecture
Technologies
Project Structure
Running the System
Running with Docker
Running without Docker
Environment Variables
License
System Design and Architecture
The application follows a client-server architecture where the frontend (React) communicates with the backend (Django) via HTTP requests. The backend handles business logic and data persistence, while PostgreSQL serves as the database. The architecture is designed as follows:

Frontend (React): The React application serves the user interface, fetching and sending data from and to the backend through API calls. It is built with a Node.js environment and served via Nginx in production.

Backend (Django): The Django backend exposes RESTful API endpoints for the frontend to interact with the database. It manages user authentication, request processing, and data manipulation.

Database (PostgreSQL): The PostgreSQL database is used to store application data, including user information, events, and other entities relevant to the application.

Containerization (Docker): The entire system is containerized using Docker. The frontend, backend, and PostgreSQL each run in separate containers, orchestrated with Docker Compose for ease of deployment and development.

System Diagram:
sql
Copy code
+---------------------+   +------------------+   +-----------------+
|      React Frontend  |-->|   Django Backend |-->|  PostgreSQL DB   |
|     (Nginx + Node)   |   |    (Python)      |   |    (SQL)         |
+---------------------+   +------------------+   +-----------------+
           |                          |                  |
           |                          |                  |
+-----------------------------+----------------------------+
|       Docker Compose (Frontend, Backend, DB)               |
+------------------------------------------------------------+
Technologies
React (Frontend)
Django (Backend)
PostgreSQL (Database)
Docker & Docker Compose (Containerization)
Nginx (Frontend web server)
Python (Backend language)
Node.js (Frontend environment)
Project Structure
bash
Copy code
/my-project/
├── /frontend/            # React frontend code
│   ├── Dockerfile
│   ├── .env
├── /backend/             # Django backend code
│   ├── Dockerfile
│   ├── .env
├── /db/                  # Database volume (optional)
├── docker-compose.yml    # Docker Compose configuration
Running the System
Running with Docker
To run the entire system with Docker and Docker Compose, follow the steps below:

1. Clone the repository
bash
Copy code
git clone https://github.com/your-username/your-repo.git
cd your-repo
2. Configure Environment Variables
Make sure both the frontend and backend .env files are properly configured. Here's a sample .env for each:

Frontend (.env)
env
Copy code
REACT_APP_BACKEND_URL=http://localhost:8000
Backend (.env)
env
Copy code
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
DB_HOST=db
DB_PORT=5432
SECRET_KEY=your_django_secret_key
DEBUG=1
3. Build and Run Containers
Run the following command to build and start the containers:

bash
Copy code
docker-compose up --build
This will:

Build the frontend and backend images.
Create containers for the frontend, backend, and PostgreSQL database.
Automatically start the system and set up network communication between services.
4. Access the Application
Frontend: http://localhost:3000
Backend: http://localhost:8000
5. Stopping the Containers
To stop the running containers, run:

bash
Copy code
docker-compose down
Running without Docker
If you prefer running the application locally without Docker, follow these steps:

1. Install Dependencies
You will need to install the dependencies for both the frontend and backend.

1.1 Frontend (React)
Navigate to the frontend directory and install the necessary Node.js packages:

bash
Copy code
cd frontend
npm install
To run the React development server:

bash
Copy code
npm start
The React frontend will now be accessible at http://localhost:3000.

1.2 Backend (Django)
Navigate to the backend directory and create a virtual environment:

bash
Copy code
cd backend
python -m venv env
source env/bin/activate   # On Windows, use `env\Scripts\activate`
Install the Python dependencies from the requirements.txt file:

bash
Copy code
pip install -r requirements.txt
Run the following command to start the Django development server:

bash
Copy code
python manage.py runserver
The Django backend will now be accessible at http://localhost:8000.

2. Set up PostgreSQL
You will need to install and run PostgreSQL locally. Make sure you configure the same environment variables in your .env file.

bash
Copy code
# Sample PostgreSQL commands
psql -U postgres
CREATE DATABASE mydatabase;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
Once PostgreSQL is running, run the following command to apply migrations:

bash
Copy code
python manage.py migrate
You can now access both the frontend and backend locally.

Environment Variables
Each service has its own .env file. The following variables need to be configured:

Frontend (frontend/.env):
REACT_APP_BACKEND_URL: The URL of the Django backend (e.g., http://localhost:8000).
Backend (backend/.env):
POSTGRES_DB: Name of the PostgreSQL database.
POSTGRES_USER: PostgreSQL user.
POSTGRES_PASSWORD: PostgreSQL password.
DB_HOST: The hostname for the PostgreSQL database.
DB_PORT: The port for the PostgreSQL database (default is 5432).
SECRET_KEY: Django's secret key.
DEBUG: Set to 1 for development mode.