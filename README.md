# Friend Scheduler App

A full-stack application for scheduling meetings with friends, built with Spring Boot backend and React Native frontend.

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd friendscheduling
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - **Backend API**: http://localhost:8080
   - **Frontend (Web)**: http://localhost:19006
   - **Expo DevTools**: http://localhost:19002

### Development Mode

For development with hot reloading:

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

You can also run services individually:

```bash
# Run only the backend
docker-compose up api

# Run only the frontend
docker-compose up ui
```

## API Endpoints

The backend provides the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/friends/{userId}` - Get user's friends
- `GET /api/meetings/{userId}/upcoming` - Get upcoming meetings
- `POST /api/meetings/create` - Create a new meeting

## Sample Data

The application comes with pre-loaded sample data:
- **Users**: john@example.com, sarah@example.com, mike@example.com, alex@example.com, emma@example.com
- **Password**: password (for all users)

## Local Development (without Docker)

### Backend
```bash
cd backend
./gradlew bootRun
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Troubleshooting

### Port Conflicts
If you get port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080"  # Change 8081 to any available port
```

### Build Issues
If you encounter build issues:

1. Clean Docker cache:
   ```bash
   docker system prune -a
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

### Database
The application uses H2 in-memory database, so data will be reset when the container restarts. For persistent data, consider switching to PostgreSQL or MySQL.

## Project Structure

```
friendscheduling/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── Dockerfile          # Backend container
├── frontend/               # React Native/Expo app
│   ├── src/               # React components
│   ├── assets/            # Images and assets
│   └── Dockerfile         # Frontend container
└── docker-compose.yml     # Orchestration
```
