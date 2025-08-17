# Friend Scheduler App - LLM Context File

## 🎯 Project Overview

**Friend Scheduler App** is a full-stack application for scheduling meetings with friends, built with Spring Boot backend and React Native frontend. The app allows users to register, add friends, schedule meetings, and view their calendar.

## 🏗️ Architecture

### Backend (Spring Boot 3.5.4 + Java 21)
- **Database**: H2 in-memory database (starts empty, no hardcoded data)
- **Port**: 8080
- **Key Technologies**: Spring Boot, Spring Security, JPA/Hibernate, JWT
- **Build Tool**: Gradle (build.gradle.kts)

### Frontend (React Native + Expo)
- **Framework**: React Native with Expo for cross-platform support
- **Port**: 19006 (web)
- **Key Technologies**: React Navigation, AsyncStorage, Expo
- **Build Tool**: npm/yarn

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Development Tools**: Makefile with convenient commands
- **Health Monitoring**: Spring Boot Actuator

## 📁 Critical File Structure

```
friendscheduling/
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── config/
│   │   │   ├── DataInitializer.java      # Database initialization (EMPTY - no sample data)
│   │   │   └── SecurityConfig.java       # Security configuration (allows /actuator/**)
│   │   ├── controller/
│   │   │   ├── AuthController.java       # User registration/login/profile
│   │   │   ├── FriendsController.java    # Friend management + dashboard stats
│   │   │   └── MeetingsController.java   # Meeting CRUD operations
│   │   ├── dto/                          # Data transfer objects
│   │   ├── entity/                       # JPA entities (User, Friendship, Meeting)
│   │   ├── repository/                   # Data repositories
│   │   └── service/                      # Business logic
│   ├── build.gradle.kts                  # Dependencies + Java 21
│   └── Dockerfile                        # Eclipse Temurin JDK 21
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js            # User authentication state
│   │   │   └── FriendsContext.js         # Friends data management
│   │   ├── design/
│   │   │   └── DesignSystem.js           # UI design system
│   │   ├── screens/
│   │   │   ├── DashboardScreen.js        # Main dashboard
│   │   │   ├── FriendsScreen.js          # Friends management
│   │   │   ├── CalendarScreen.js         # Calendar view
│   │   │   ├── ScheduleScreen.js         # Meeting scheduling
│   │   │   └── LoginScreen.js            # Authentication
│   │   └── services/
│   │       └── apiService.js             # API communication
│   ├── package.json                      # Dependencies
│   └── Dockerfile                        # Node 18 Alpine
├── docker-compose.yml                    # Service orchestration
├── Makefile                             # Development commands
├── start-app.sh                         # Startup script (opens browser)
├── stop-app.sh                          # Shutdown script
└── README.md                            # Documentation
```

## 🔑 Key Implementation Details

### Data Management Philosophy
- **NO HARDCODED DATA**: Database starts completely empty
- **Real-time calculations**: All statistics calculated from actual database records
- **Graceful empty states**: UI handles no data scenarios appropriately
- **User-driven data**: All data comes from user interactions

### Database Schema
```sql
-- Users table
users (id, name, email, password, createdAt, updatedAt)

-- Friendships table  
friendships (id, user_id, friend_id, status, isCloseFriend, createdAt, updatedAt)
-- status: PENDING, ACCEPTED, REJECTED

-- Meetings table
meetings (id, title, description, startTime, endTime, location, organizer_id, friend_id, status, createdAt, updatedAt)
-- status: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED
```

### API Endpoints
```
Authentication:
POST /api/auth/register     # Create new user
POST /api/auth/login        # User login  
GET  /api/auth/profile/{id} # Get user profile

Friends:
GET  /api/friends/{userId}                    # Get user's friends
GET  /api/friends/{userId}/close              # Get close friends
GET  /api/friends/{userId}/stats              # Dashboard statistics
POST /api/friends/{userId}/add                # Add friend
PUT  /api/friends/{userId}/toggle-close/{id}  # Toggle close friend

Meetings:
GET    /api/meetings/{userId}/upcoming        # Get upcoming meetings
GET    /api/meetings/{userId}/range           # Get by date range
POST   /api/meetings/create                   # Create meeting
PUT    /api/meetings/{id}/status              # Update status
DELETE /api/meetings/{id}                     # Delete meeting

Health:
GET /actuator/health                          # Application health
```

### Frontend State Management
- **AuthContext**: Manages user authentication state
- **FriendsContext**: Manages friends data and operations
- **apiService.js**: Centralized API communication
- **AsyncStorage**: Local data persistence

## 🚀 Development Workflow

### Quick Start Commands
```bash
make start     # Start app + open browser
make stop      # Stop app
make status    # Check container status
make health    # Health check
make logs      # View logs
make clean     # Clean up containers
```

### Docker Services
- **api**: Spring Boot backend (port 8080)
- **ui**: React Native/Expo frontend (port 19006)

### Health Checks
- Backend: `http://localhost:8080/actuator/health`
- Frontend: `http://localhost:19006`

## ⚠️ Critical Constraints & Rules

### 1. No Hardcoded Data
- **DataInitializer.java** must remain empty (no sample data)
- All data must come from user interactions
- Database starts completely empty

### 2. Real Database Integration
- All statistics must be calculated from actual database records
- No mock data or hardcoded fallbacks in frontend
- API endpoints must return real data or empty arrays/objects

### 3. Graceful Empty States
- Frontend must handle empty data scenarios
- Show appropriate empty state messages
- No "John Doe" or sample user names

### 4. Security Configuration
- `/actuator/**` endpoints must be accessible (for health checks)
- `/api/auth/**` endpoints are public
- Other endpoints require authentication

### 5. Docker Configuration
- Backend uses Eclipse Temurin JDK 21
- Frontend uses Node 18 Alpine
- Health checks are configured and working
- Browser opens automatically on startup

## 🔧 Common Development Tasks

### Adding New API Endpoints
1. Create controller method in appropriate controller
2. Add service method in service layer
3. Add repository method if needed
4. Update SecurityConfig if endpoint needs authentication
5. Test with `make health`

### Adding New Frontend Screens
1. Create screen component in `frontend/src/screens/`
2. Add to navigation in App.js
3. Update apiService.js if new API calls needed
4. Test with `make start`

### Database Changes
1. Update entity classes
2. Update repositories if needed
3. Update DTOs if needed
4. Test with `make restart`

### Environment Configuration
- Backend: `backend/src/main/resources/application.properties`
- Frontend: Environment variables in docker-compose.yml
- Docker: docker-compose.yml and Dockerfiles

## 🐛 Troubleshooting Patterns

### Backend Issues
- Check logs: `make logs-api`
- Check health: `make health`
- Restart: `docker compose restart api`

### Frontend Issues  
- Check logs: `make logs-ui`
- Restart: `docker compose restart ui`
- Clear cache: `make clean && make start`

### Docker Issues
- Clean up: `make clean`
- Rebuild: `make build`
- Full restart: `make stop && make start`

## 📋 Code Style & Patterns

### Backend (Java)
- Use Spring Boot conventions
- JPA entities with proper annotations
- Service layer for business logic
- DTOs for API responses
- Proper exception handling

### Frontend (JavaScript/React)
- Functional components with hooks
- Context for state management
- Async/await for API calls
- Proper error handling
- Consistent naming conventions

### API Design
- RESTful conventions
- Consistent response formats
- Proper HTTP status codes
- Error messages in response body

## 🎯 Current State & Known Issues

### Working Features
- ✅ User registration and login
- ✅ Friend management (add, remove, mark close)
- ✅ Meeting scheduling and management
- ✅ Dashboard with real-time statistics
- ✅ Calendar view
- ✅ Web interface
- ✅ Docker containerization
- ✅ Health monitoring
- ✅ Automated browser opening

### Data Flow
1. User registers → Creates real user in database
2. User adds friends → Creates real friendships in database
3. User schedules meetings → Creates real meetings in database
4. Dashboard shows statistics calculated from real data
5. All UI updates reflect actual database state

### Testing Approach
- Backend: `./gradlew test` in backend directory
- Frontend: `npm test` in frontend directory
- Integration: `make health` for overall system health
- Manual: Use the web interface at http://localhost:19006

## 🔮 Future Considerations

### Production Readiness
- Replace H2 with PostgreSQL
- Configure proper JWT secrets or third party OAuth provider
- Set up HTTPS
- Add rate limiting
- Implement proper logging

### Mobile Development
- Expo Go for testing on mobile devices
- Development builds for native features
- Platform-specific optimizations

### Performance
- Database indexing for large datasets
- API response caching
- Frontend optimization
- Container resource limits

---

**This context file provides all necessary information for LLMs to understand the repository structure, constraints, and development patterns. Use this as the foundation for any code changes or feature additions.**
