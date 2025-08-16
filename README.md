# Friend Scheduler App

A full-stack application for scheduling meetings with friends, built with Spring Boot backend and React Native frontend.

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose**
- **Java 21** (for local development)
- **Node.js 18+** (for local development)

### Start the Application
```bash
# Clone the repository
git clone <repository-url>
cd friendscheduling

# Start the app (opens browser automatically)
make start
```

That's it! The application will start and automatically open in your browser at http://localhost:19006.

## 📋 Available Commands

### Using Make (Recommended)
```bash
make start     # Start the app and open browser
make stop      # Stop the app
make restart   # Restart the app
make status    # Show container status
make health    # Check API and UI health
make logs      # Show container logs
make clean     # Stop and remove containers
make help      # Show all available commands
```

### Using Docker Compose Directly
```bash
# Start all services
docker compose up --build -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Check status
docker compose ps
```

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 21
- **Database**: H2 in-memory database
- **Port**: 8080
- **Features**:
  - RESTful API endpoints
  - JWT authentication
  - JPA/Hibernate ORM
  - Spring Security
  - Health checks via Actuator

### Frontend (React Native/Expo)
- **Framework**: React Native with Expo
- **Language**: JavaScript/TypeScript
- **Port**: 19006 (web)
- **Features**:
  - Cross-platform (iOS, Android, Web)
  - React Navigation
  - AsyncStorage for local data
  - Modern UI with design system

## 📁 Project Structure

```
friendscheduling/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   │   └── com/example/demo/
│   │       ├── config/     # Configuration classes
│   │       ├── controller/ # REST controllers
│   │       ├── dto/        # Data transfer objects
│   │       ├── entity/     # JPA entities
│   │       ├── repository/ # Data repositories
│   │       └── service/    # Business logic
│   ├── src/main/resources/ # Configuration files
│   ├── build.gradle.kts    # Build configuration
│   └── Dockerfile          # Backend container
├── frontend/               # React Native/Expo app
│   ├── src/               # React components
│   │   ├── contexts/      # React contexts
│   │   ├── design/        # Design system
│   │   ├── screens/       # App screens
│   │   └── services/      # API services
│   ├── assets/            # Images and assets
│   ├── package.json       # Dependencies
│   └── Dockerfile         # Frontend container
├── docker-compose.yml     # Service orchestration
├── Makefile              # Development commands
├── start-app.sh          # Startup script
├── stop-app.sh           # Shutdown script
└── README.md             # This file
```

## 🔧 Development

### Local Development (without Docker)

#### Backend
```bash
cd backend
./gradlew bootRun
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/{userId}` - Get user profile

#### Friends
- `GET /api/friends/{userId}` - Get user's friends
- `GET /api/friends/{userId}/close` - Get close friends
- `GET /api/friends/{userId}/stats` - Get dashboard statistics
- `POST /api/friends/{userId}/add` - Add friend
- `PUT /api/friends/{userId}/toggle-close/{friendId}` - Toggle close friend status

#### Meetings
- `GET /api/meetings/{userId}/upcoming` - Get upcoming meetings
- `GET /api/meetings/{userId}/range` - Get meetings by date range
- `POST /api/meetings/create` - Create new meeting
- `PUT /api/meetings/{meetingId}/status` - Update meeting status
- `DELETE /api/meetings/{meetingId}` - Delete meeting

#### Health Check
- `GET /actuator/health` - Application health status

### Database Schema

#### Users
- `id` (Primary Key)
- `name` (String)
- `email` (String, unique)
- `password` (String, encrypted)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### Friendships
- `id` (Primary Key)
- `user` (User, Foreign Key)
- `friend` (User, Foreign Key)
- `status` (ENUM: PENDING, ACCEPTED, REJECTED)
- `isCloseFriend` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### Meetings
- `id` (Primary Key)
- `title` (String)
- `description` (Text)
- `startTime` (Timestamp)
- `endTime` (Timestamp)
- `location` (String)
- `organizer` (User, Foreign Key)
- `friend` (User, Foreign Key)
- `status` (ENUM: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## 🎯 Key Features

### ✅ Implemented
- User registration and authentication
- Friend management (add, remove, mark as close)
- Meeting scheduling and management
- Dashboard with statistics
- Calendar view
- Responsive web interface
- Health monitoring
- Docker containerization
- Automated browser opening

### 🔄 Data Management
- **No hardcoded data** - Database starts completely empty
- **Real-time statistics** - Dashboard stats calculated from actual data
- **In-memory database** - H2 database for development
- **Graceful empty states** - UI handles no data scenarios

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts
If you get port conflicts, check if ports 8080 or 19006 are in use:
```bash
# Check what's using the ports
lsof -i :8080
lsof -i :19006
```

#### Docker Issues
```bash
# Clean up Docker
make clean
docker system prune -a

# Rebuild from scratch
make build
make start
```

#### Frontend Not Loading
```bash
# Check UI logs
make logs-ui

# Restart UI only
docker compose restart ui
```

#### Backend Not Responding
```bash
# Check API logs
make logs-api

# Check health
make health

# Restart API only
docker compose restart api
```

### Health Checks
```bash
# Check if services are healthy
make health

# Check container status
make status

# View recent logs
make logs
```

## 🔒 Security

### Development
- JWT tokens for authentication
- Password encryption with BCrypt
- CORS configured for development
- H2 console enabled for database access

### Production Considerations
- Replace H2 with PostgreSQL/MySQL
- Configure proper JWT secrets
- Set up HTTPS
- Implement proper CORS policies
- Add rate limiting
- Configure proper logging

## 📱 Mobile Development

### Expo Go App
1. Download Expo Go from App Store/Google Play
2. Scan QR code from terminal when running `make start`
3. App will load on your mobile device

### Development Build
```bash
cd frontend
npx expo run:ios     # iOS
npx expo run:android # Android
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
./gradlew test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Monitoring

### Application Health
- Backend: http://localhost:8080/actuator/health
- Frontend: http://localhost:19006

### Database Console
- H2 Console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:friendscheduler`
- Username: `sa`
- Password: `password`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs with `make logs`
3. Check the health status with `make health`
4. Create an issue in the repository

---

**Happy coding! 🚀**
