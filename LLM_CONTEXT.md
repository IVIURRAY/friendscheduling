# Friend Scheduler App - LLM Context File

## 🎯 Project Overview

**Friend Scheduler App** is a full-stack application for scheduling meetings with friends, built with Spring Boot backend and React Native frontend. The app uses **multi-provider OAuth authentication** (Google and Apple) and integrates with **Google Calendar API** to provide seamless calendar access and meeting scheduling. **Production deployment** is available on Railway for Apple OAuth support.

## 🏗️ Architecture

### Backend (Spring Boot 3.5.4 + Java 21)
- **Database**: H2 in-memory database (starts empty, no hardcoded data)
- **Port**: 8080 (local), Railway deployed: https://friendscheduling-production.up.railway.app
- **Authentication**: Multi-provider OAuth 2.0 (Google + Apple, session-based, no JWT)
- **Key Technologies**: Spring Boot, Spring Security OAuth2 Client, JPA/Hibernate, Google Calendar API, nimbus-jose-jwt
- **Build Tool**: Gradle (build.gradle.kts)
- **Deployment**: Railway.app with nixpacks and custom build script

### Frontend (React Native + Expo)
- **Framework**: React Native with Expo for cross-platform support
- **Port**: 19006 (web)
- **Authentication**: Google OAuth flow integration
- **Key Technologies**: React Navigation, AsyncStorage, Expo
- **Build Tool**: npm/yarn

### Infrastructure
- **Local Development**: Docker + Docker Compose
- **Production Deployment**: Railway.app platform
- **Development Tools**: Makefile with convenient commands
- **Health Monitoring**: Spring Boot Actuator
- **Environment Variables**: .env file for local secrets, Railway environment variables for production

## 📁 Critical File Structure

```
friendscheduling/
├── .env                                # Environment variables (OAuth secrets for local development)
├── .env.example                        # Environment variables template
├── railway.json                        # Railway deployment configuration
├── nixpacks.toml                       # Railway nixpacks configuration
├── build-backend.sh                    # Custom Railway build script
├── Dockerfile.backend                  # Docker configuration for Railway deployment
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── config/
│   │   │   ├── DataInitializer.java      # Database initialization (EMPTY - no sample data)
│   │   │   ├── SecurityConfig.java       # OAuth2 security configuration
│   │   │   └── AppleOAuthConfig.java     # Apple OAuth configuration with conditional registration
│   │   ├── controller/
│   │   │   ├── AuthController.java       # OAuth user endpoints + provider detection
│   │   │   ├── CalendarController.java   # Google Calendar integration
│   │   │   ├── FriendsController.java    # Friend management + dashboard stats
│   │   │   └── MeetingsController.java   # Meeting CRUD operations
│   │   ├── dto/                          # Data transfer objects
│   │   ├── entity/
│   │   │   └── User.java                 # OAuth-enabled user entity (no password field)
│   │   ├── repository/                   # Data repositories
│   │   └── service/
│   │       ├── CustomOAuth2UserService.java  # Multi-provider OAuth user management
│   │       ├── GoogleCalendarService.java    # Google Calendar API integration  
│   │       ├── AppleJwtService.java           # Apple JWT client secret generation
│   │       └── UserService.java              # User business logic (no password methods)
│   ├── src/main/resources/
│   │   └── application.properties        # OAuth & Calendar API configuration
│   ├── build.gradle.kts                  # OAuth & Google API + nimbus-jose-jwt dependencies
│   └── Dockerfile                        # Eclipse Temurin JDK 21
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js            # Multi-provider OAuth authentication state
│   │   │   └── FriendsContext.js         # Friends data management
│   │   ├── design/
│   │   │   └── DesignSystem.js           # UI design system
│   │   ├── screens/
│   │   │   ├── DashboardScreen.js        # Main dashboard with profile pictures
│   │   │   ├── FriendsScreen.js          # Friends management
│   │   │   ├── CalendarScreen.js         # Calendar view
│   │   │   ├── GoogleCalendarScreen.js   # Google Calendar events display
│   │   │   ├── ScheduleScreen.js         # Meeting scheduling
│   │   │   └── LoginScreen.js            # Multi-provider OAuth login (Google + Apple)
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
- **OAuth 2.0 Providers**: Google OAuth 2.0 and Apple Sign-In (no username/password)
- **Session-based**: Uses Spring Security OAuth2 sessions (no JWT tokens)  
- **Google Calendar Integration**: Seamless access to user's calendar data (Google users only)
- **Profile Pictures**: Automatically fetched from Google account (Google users only)
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
GET  /oauth2/authorization/apple   # Initiate Apple OAuth
GET  /login/oauth2/code/google     # Google OAuth callback
GET  /login/oauth2/code/apple      # Apple OAuth callback
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

#### Local Development (.env file)
```bash
# .env file (not committed to git)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# .env.example file (template for new developers)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
APPLE_CLIENT_ID=your-apple-client-id-here
APPLE_TEAM_ID=your-apple-team-id-here
APPLE_KEY_ID=your-apple-key-id-here
APPLE_PRIVATE_KEY=your-apple-private-key-here
```

#### Railway Production Environment
Railway environment variables are set via `railway variables --set` command:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `APPLE_CLIENT_ID` - Apple Service ID
- `APPLE_TEAM_ID` - Apple Developer Team ID
- `APPLE_KEY_ID` - Apple Private Key ID
- `APPLE_PRIVATE_KEY` - Apple private key content for JWT generation
- `FRONTEND_URL` - Frontend URL for CORS (http://localhost:19006 for local development)

### OAuth Setup Requirements

#### Google OAuth Setup
1. **Google Cloud Console**: Create OAuth 2.0 credentials
2. **Authorized JavaScript origins**: 
   - Local: `http://localhost:19006`
   - Production: `https://friendscheduling-production.up.railway.app`
3. **Authorized redirect URIs**: 
   - Local: `http://localhost:8080/login/oauth2/code/google`
   - Production: `https://friendscheduling-production.up.railway.app/login/oauth2/code/google`
4. **APIs enabled**: Google Calendar API, Google+ API
5. **Scopes**: `openid`, `profile`, `email`, `https://www.googleapis.com/auth/calendar.readonly`

#### Apple OAuth Setup
1. **Apple Developer Console**: Create an App ID and Services ID
2. **App ID**: Register your app with Apple Developer Program
3. **Services ID**: Create a Services ID for Sign in with Apple
4. **Domain and Subdomain**: 
   - Local: `localhost` (may not work - Apple rejects localhost)
   - Production: `friendscheduling-production.up.railway.app`
5. **Return URLs**: 
   - Local: `http://localhost:8080/login/oauth2/code/apple`
   - Production: `https://friendscheduling-production.up.railway.app/login/oauth2/code/apple`
6. **Scopes**: `openid`, `name`, `email`
7. **JWT-based Client Secret**: Apple requires JWT generation for client secret
   - Generate a private key (.p8 file) in Apple Developer Console
   - Note the Key ID and Team ID
   - Use `AppleJwtService` to generate JWT client secret from private key
   - JWT contains: issuer (Team ID), audience (Apple), subject (Client ID), expiration
   - **Current implementation**: Dynamic JWT generation using nimbus-jose-jwt library

### Frontend State Management
- **AuthContext**: Manages OAuth authentication state and user profile
- **FriendsContext**: Manages friends data and operations
- **apiService.js**: Session-based API communication (no token management)
- **AsyncStorage**: Minimal local data persistence

## 🚀 Development Workflow

### Railway Deployment

The backend is deployed on Railway.app for Apple OAuth support (Apple rejects localhost domains).

#### Railway Configuration Files
- **`railway.json`**: Railway deployment configuration using nixpacks
- **`nixpacks.toml`**: Nixpacks build configuration (Java 21, custom build command)
- **`build-backend.sh`**: Custom build script for Railway deployment
- **`Dockerfile.backend`**: Docker configuration (used for local Railway builds)

#### Railway Deployment Process
1. **Link project**: `railway link` (connects to Railway project)
2. **Set environment variables**: `railway variables --set KEY=value`
3. **Deploy**: Automatic deployment on git push or manual `railway deploy`
4. **Monitor**: `railway status`, `railway domain`, Railway dashboard

#### Key Railway Environment Variables
- Apple OAuth: `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`  
- CORS: `FRONTEND_URL=http://localhost:19006`

#### Railway Build Process
1. Uses nixpacks with Java 21
2. Runs custom `build-backend.sh` script
3. Navigates to backend directory
4. Checks gradle wrapper files (gradle-wrapper.jar must be committed)
5. Builds with `./gradlew clean build -x test --no-daemon`
6. Starts with `java -Dserver.port=$PORT -jar build/libs/demo-0.0.1-SNAPSHOT.jar`

#### Railway Domain
- **Production URL**: https://friendscheduling-production.up.railway.app
- **Health check**: https://friendscheduling-production.up.railway.app/actuator/health
- **Providers endpoint**: https://friendscheduling-production.up.railway.app/api/auth/providers

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
- ✅ Multi-provider OAuth 2.0 authentication (Google and Apple)
- ✅ Google Calendar API integration with event display (Google users only)
- ✅ User profile with provider-specific profile picture and info
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

#### Google OAuth Flow
1. User clicks "Continue with Google" → Redirects to Google OAuth
2. User authorizes app → Google redirects back with authorization code
3. Spring Security exchanges code for tokens → Creates authenticated session
4. User profile populated from Google → Profile picture and info displayed
5. Google Calendar access → Events displayed in calendar view
6. Session maintained → No need for token refresh handling

#### Apple OAuth Flow
1. User clicks "Continue with Apple" → Redirects to Apple OAuth
2. User authorizes app → Apple redirects back with authorization code
3. Spring Security exchanges code for tokens → Creates authenticated session
4. User profile populated from Apple → Name and email displayed (no profile picture)
5. Session maintained → No need for token refresh handling

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