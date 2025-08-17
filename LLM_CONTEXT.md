# Friend Scheduler App - LLM Context File

## 🎯 Project Overview

**Friend Scheduler App** is a full-stack application for scheduling meetings with friends, built with Spring Boot backend and React Native frontend. The app uses **Google OAuth authentication** and integrates with **Google Calendar API** to provide seamless calendar access and meeting scheduling.

## 🏗️ Architecture

### Backend (Spring Boot 3.5.4 + Java 21)
- **Database**: H2 in-memory database (starts empty, no hardcoded data)
- **Port**: 8080
- **Authentication**: Google OAuth 2.0 (session-based, no JWT)
- **Key Technologies**: Spring Boot, Spring Security OAuth2 Client, JPA/Hibernate, Google Calendar API
- **Build Tool**: Gradle (build.gradle.kts)

### Frontend (React Native + Expo)
- **Framework**: React Native with Expo for cross-platform support
- **Port**: 19006 (web)
- **Authentication**: Google OAuth flow integration
- **Key Technologies**: React Navigation, AsyncStorage, Expo
- **Build Tool**: npm/yarn

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Development Tools**: Makefile with convenient commands
- **Health Monitoring**: Spring Boot Actuator
- **Environment Variables**: .env file for secrets (not committed to git)

## 📁 Critical File Structure

```
friendscheduling/
├── .env                                # Environment variables (Google OAuth secrets)
├── .env.example                        # Environment variables template
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── config/
│   │   │   ├── DataInitializer.java      # Database initialization (EMPTY - no sample data)
│   │   │   └── SecurityConfig.java       # OAuth2 security configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java       # OAuth user endpoints only
│   │   │   ├── CalendarController.java   # Google Calendar integration
│   │   │   ├── FriendsController.java    # Friend management + dashboard stats
│   │   │   └── MeetingsController.java   # Meeting CRUD operations
│   │   ├── dto/                          # Data transfer objects
│   │   ├── entity/
│   │   │   └── User.java                 # OAuth-enabled user entity (no password field)
│   │   ├── repository/                   # Data repositories
│   │   └── service/
│   │       ├── CustomOAuth2UserService.java  # OAuth user management
│   │       ├── GoogleCalendarService.java    # Google Calendar API integration
│   │       └── UserService.java              # User business logic (no password methods)
│   ├── src/main/resources/
│   │   └── application.properties        # OAuth & Calendar API configuration
│   ├── build.gradle.kts                  # OAuth & Google API dependencies
│   └── Dockerfile                        # Eclipse Temurin JDK 21
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js            # Google OAuth authentication state
│   │   │   └── FriendsContext.js         # Friends data management
│   │   ├── design/
│   │   │   └── DesignSystem.js           # UI design system
│   │   ├── screens/
│   │   │   ├── DashboardScreen.js        # Main dashboard with profile pictures
│   │   │   ├── FriendsScreen.js          # Friends management
│   │   │   ├── CalendarScreen.js         # Calendar view
│   │   │   ├── GoogleCalendarScreen.js   # Google Calendar events display
│   │   │   ├── ScheduleScreen.js         # Meeting scheduling
│   │   │   └── LoginScreen.js            # Google OAuth login only
│   │   └── services/
│   │       └── apiService.js             # API communication (OAuth-based)
│   ├── package.json                      # Dependencies
│   └── Dockerfile                        # Node 18 Alpine
├── docker-compose.yml                    # Service orchestration with env vars
├── Makefile                             # Development commands
├── start-app.sh                         # Startup script (opens browser)
├── stop-app.sh                          # Shutdown script
└── README.md                            # Documentation
```

## 🔑 Key Implementation Details

### Authentication Architecture
- **Google OAuth 2.0**: Only authentication method (no username/password)
- **Session-based**: Uses Spring Security OAuth2 sessions (no JWT tokens)
- **Google Calendar Integration**: Seamless access to user's calendar data
- **Profile Pictures**: Automatically fetched from Google account
- **Secure Storage**: OAuth secrets stored in .env file (excluded from git)

### Data Management Philosophy
- **NO HARDCODED DATA**: Database starts completely empty
- **Real-time calculations**: All statistics calculated from actual database records
- **Graceful empty states**: UI handles no data scenarios appropriately
- **User-driven data**: All data comes from user interactions
- **OAuth-first**: User data populated from Google OAuth profile

### Database Schema
```sql
-- Users table (OAuth-enabled)
users (id, name, email, oauth_provider, oauth_id, access_token, refresh_token, profile_picture_url, createdAt, updatedAt)
-- NOTE: No password field - OAuth only

-- Friendships table  
friendships (id, user_id, friend_id, status, isCloseFriend, createdAt, updatedAt)
-- status: PENDING, ACCEPTED, REJECTED

-- Meetings table
meetings (id, title, description, startTime, endTime, location, organizer_id, friend_id, status, createdAt, updatedAt)
-- status: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED
```

### API Endpoints
```
Authentication (OAuth only):
GET  /api/auth/user           # Get current OAuth user
GET  /api/auth/profile/{id}   # Get user profile

OAuth Flow:
GET  /oauth2/authorization/google  # Initiate Google OAuth
GET  /login/oauth2/code/google     # OAuth callback
GET  /logout                       # Logout

Google Calendar:
GET  /api/calendar/events/upcoming     # Get upcoming Google Calendar events
GET  /api/calendar/events/range        # Get events by date range

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

### Environment Configuration
```bash
# .env file (not committed to git)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# .env.example file (template for new developers)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Google OAuth Setup Requirements
1. **Google Cloud Console**: Create OAuth 2.0 credentials
2. **Authorized JavaScript origins**: `http://localhost:19006`
3. **Authorized redirect URIs**: `http://localhost:8080/login/oauth2/code/google`
4. **APIs enabled**: Google Calendar API, Google+ API
5. **Scopes**: `openid`, `profile`, `email`, `https://www.googleapis.com/auth/calendar.readonly`

### Frontend State Management
- **AuthContext**: Manages OAuth authentication state and user profile
- **FriendsContext**: Manages friends data and operations
- **apiService.js**: Session-based API communication (no token management)
- **AsyncStorage**: Minimal local data persistence

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

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your Google OAuth credentials to `.env`
3. Ensure Google Cloud Console is configured correctly
4. Run `make start`

### Docker Services
- **api**: Spring Boot backend (port 8080) with OAuth environment variables
- **ui**: React Native/Expo frontend (port 19006)

### Health Checks
- Backend: `http://localhost:8080/actuator/health`
- Frontend: `http://localhost:19006`
- OAuth flow: `http://localhost:8080/oauth2/authorization/google`

## ⚠️ Critical Constraints & Rules

### 1. OAuth-Only Authentication
- **NO traditional login**: No username/password authentication
- **Google OAuth required**: Only authentication method available
- **Session-based**: Uses Spring Security sessions, not JWT
- **Environment variables**: OAuth secrets must be in .env file

### 2. No Hardcoded Data
- **DataInitializer.java** must remain empty (no sample data)
- All data must come from user interactions via OAuth
- Database starts completely empty
- User profiles populated from Google OAuth

### 3. Google Calendar Integration
- **Read-only access**: Can view but not modify Google Calendar events
- **API enabled**: Google Calendar API must be enabled in Google Cloud Console
- **Proper scopes**: Must include calendar.readonly scope
- **Error handling**: Graceful fallback when calendar access fails

### 4. Security Configuration
- **OAuth endpoints**: `/oauth2/**`, `/login/**` are public
- **Actuator access**: `/actuator/**` endpoints accessible for health checks
- **API protection**: All `/api/**` endpoints require OAuth authentication
- **CORS configured**: For frontend-backend communication

### 5. Environment Security
- **No secrets in code**: All OAuth credentials in .env file
- **.env excluded**: From git via .gitignore
- **.env.example**: Template for new developers
- **Docker integration**: Environment variables passed to containers

### 6. Docker Configuration
- **Backend**: Eclipse Temurin JDK 21 with OAuth environment variables
- **Frontend**: Node 18 Alpine
- **Health checks**: Configured and working
- **Browser automation**: Opens automatically on startup

## 🔧 Common Development Tasks

### Adding New OAuth Features
1. Update OAuth scopes in `application.properties`
2. Modify `CustomOAuth2UserService` for new user data
3. Update `User` entity if new fields needed
4. Test OAuth flow end-to-end

### Google API Integration
1. Enable required APIs in Google Cloud Console
2. Update OAuth scopes if needed
3. Create service class for API calls
4. Add controller endpoints
5. Test with proper error handling

### Frontend OAuth Updates
1. Update `AuthContext` for new authentication flows
2. Modify `LoginScreen` if UI changes needed
3. Update `apiService` for new endpoints
4. Test authentication state management

### Environment Changes
1. Update `.env.example` with new variables
2. Update `docker-compose.yml` to pass new env vars
3. Update `application.properties` to use new variables
4. Document new setup requirements

### Database Changes
1. Update entity classes (especially User for OAuth fields)
2. Update repositories if needed
3. Update DTOs if needed
4. Test with `make restart`

## 🐛 Troubleshooting Patterns

### OAuth Issues
- **Redirect URI mismatch**: Check Google Cloud Console configuration
- **Invalid client**: Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- **Scope issues**: Check required APIs are enabled in Google Cloud Console
- **Session problems**: Clear browser cookies and restart

### Google Calendar Issues
- **No events showing**: Verify Google Calendar API is enabled
- **Access denied**: Check calendar.readonly scope is included
- **Token expired**: OAuth refresh should handle automatically
- **Rate limiting**: Implement proper retry logic

### Environment Variable Issues
- **Missing .env**: Copy from .env.example and fill in values
- **Docker not loading env**: Check docker-compose.yml env var passing
- **Wrong credentials**: Verify values in Google Cloud Console

### Backend Issues
- Check logs: `make logs-api`
- Check health: `make health`
- Restart: `docker compose restart api`
- OAuth debug: Check Spring Security debug logs

### Frontend Issues  
- Check logs: `make logs-ui`
- Restart: `docker compose restart ui`
- Clear cache: `make clean && make start`
- OAuth flow: Test redirect URIs manually

## 📋 Code Style & Patterns

### Backend (Java/OAuth)
- Spring Security OAuth2 client patterns
- Session-based authentication (no JWT)
- Google API client integration
- Proper OAuth token handling
- Environment variable usage

### Frontend (React/OAuth)
- OAuth redirect handling
- Session-based state management
- Google profile integration
- Error boundaries for OAuth failures
- Graceful degradation patterns

### API Design
- RESTful conventions with OAuth context
- Session-based security
- Consistent OAuth error handling
- Google API integration patterns

## 🎯 Current State & Known Issues

### Working Features
- ✅ Google OAuth 2.0 authentication (complete replacement of traditional login)
- ✅ Google Calendar API integration with event display
- ✅ User profile with Google profile picture and info
- ✅ Session-based authentication (no JWT)
- ✅ Environment variable configuration for secrets
- ✅ Friend management (add, remove, mark close)
- ✅ Meeting scheduling and management
- ✅ Dashboard with real-time statistics
- ✅ Calendar view with Google Calendar events
- ✅ Web interface with OAuth flow
- ✅ Docker containerization with environment variables
- ✅ Health monitoring
- ✅ Automated browser opening

### Authentication Flow
1. User clicks "Continue with Google" → Redirects to Google OAuth
2. User authorizes app → Google redirects back with authorization code
3. Spring Security exchanges code for tokens → Creates authenticated session
4. User profile populated from Google → Profile picture and info displayed
5. Google Calendar access → Events displayed in calendar view
6. Session maintained → No need for token refresh handling

### Google Integration Features
- **Profile Data**: Name, email, profile picture from Google account
- **Calendar Events**: Read-only access to user's Google Calendar
- **OAuth Scopes**: openid, profile, email, calendar.readonly
- **Token Management**: Automatic refresh handling by Spring Security

### Data Flow
1. User authenticates via Google OAuth → Creates real user in database with OAuth data
2. User adds friends → Creates real friendships in database
3. User schedules meetings → Creates real meetings in database  
4. Dashboard shows statistics calculated from real data
5. Google Calendar events displayed alongside app data
6. All UI updates reflect actual database state

### Testing Approach
- **OAuth Flow**: Test complete Google OAuth authentication
- **Google Calendar**: Verify calendar events display correctly
- **Environment Variables**: Test with different OAuth credentials
- **Backend**: `./gradlew test` in backend directory
- **Frontend**: `npm test` in frontend directory
- **Integration**: `make health` for overall system health
- **Manual**: Use the web interface at http://localhost:19006

## 🔮 Future Considerations

### Production Readiness
- Replace H2 with PostgreSQL
- Set up HTTPS for OAuth security
- Configure proper OAuth redirect URIs for production
- Add rate limiting for Google API calls
- Implement proper logging and monitoring
- Set up OAuth refresh token handling

### Google Integration Expansion
- **Write access**: Create Google Calendar events from app
- **Multiple calendars**: Support for secondary calendars
- **Google Contacts**: Auto-suggest friends from contacts
- **Google Meet**: Integration for video meetings
- **Advanced scopes**: Additional Google service integration

### Mobile Development
- OAuth flow optimization for mobile apps
- Native Google Sign-In SDK integration
- Expo Go testing with OAuth redirects
- Platform-specific OAuth handling

### Security Enhancements
- OAuth state parameter validation
- PKCE (Proof Key for Code Exchange) implementation
- Secure OAuth token storage
- Regular OAuth token rotation
- Security headers and CSRF protection

### Performance & Scalability
- Google API response caching
- OAuth session optimization
- Database indexing for OAuth user lookups
- Container resource limits
- Load balancing considerations

---

**This context file provides all necessary information for LLMs to understand the OAuth-enabled repository structure, Google integration, security constraints, and development patterns. Use this as the foundation for any code changes or feature additions.**