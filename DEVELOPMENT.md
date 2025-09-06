# Coalition Website Development Guide

## Project Structure

This project consists of:
- **Frontend**: Angular application with Material Design
- **Backend**: Express.js API server with MySQL database
- **Database**: MySQL for user data and authentication

## Environment Configuration

The project supports multiple environments with automatic configuration switching:

### Development Environment
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3157`
- Database: Local MySQL server
- OAuth Redirect: `http://localhost:4200/oauth/`

### Production Environment
- Frontend: `https://coalitiongroup.net`
- Backend: `https://api.coalitiongroup.net`
- Database: Remote MySQL server
- OAuth Redirect: `https://coalitiongroup.net/oauth/`

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MySQL server (for local development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Website_Angular
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Database Setup**
   - Install MySQL locally
   - Create a database named `coalition`
   - Update credentials in `backend/.env.development` if needed

4. **Start Development Servers**
   ```bash
   # Start both frontend and backend in development mode
   npm run dev
   
   # Or start individually:
   npm run start:dev        # Frontend only
   npm run backend:dev      # Backend only
   ```

## Available Scripts

### Root Package Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run start:dev` - Start frontend in development mode
- `npm run start:prod` - Start frontend in production mode
- `npm run build:dev` - Build frontend for development
- `npm run build:prod` - Build frontend for production
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:prod` - Start backend in production mode

### Backend Scripts
- `npm run dev` - Start backend in development mode with auto-reload
- `npm run start` - Start backend in production mode
- `npm run watch` - Start backend in development mode with file watching
- `npm run build` - Compile TypeScript to JavaScript

## Environment Files

### Frontend Environments
- `src/environments/environment.ts` - Development configuration
- `src/environments/environment.prod.ts` - Production configuration

### Backend Environments
- `backend/.env.development` - Development database and API configuration
- `backend/.env.production` - Production database and API configuration

## Development Features

### Hot Reload
- Frontend: Automatic reload on file changes
- Backend: Automatic restart on file changes (when using `npm run dev`)

### Proxy Configuration
- Development mode uses Angular proxy to avoid CORS issues
- API calls to `/api/*` are automatically proxied to `http://localhost:3157`

### Environment Switching
- Configurations automatically switch based on build target
- No manual environment variable changes needed

## API Endpoints

### Authentication
- `POST /api/oauth/token` - Exchange Discord OAuth code for token
- `POST /api/users` - Create or update user from Discord data
- `POST /api/update/user` - Update user profile information (requires auth)

### Frontend Routes
- `/` - Home page
- `/profile` - User profile (requires auth)
- `/oauth` - OAuth callback handler
- `/events` - Events page
- `/stats` - Statistics page

## Database Schema

### Users Table
- `discordid` - Discord user ID (primary key)
- `steamid` - Steam ID
- `email` - User email
- `teamspeakid` - TeamSpeak ID
- `username` - Display name
- `section` - Military section
- `veterancy` - Veterancy status
- `armaguid` - ARMA GUID

## Discord OAuth Setup

The application uses Discord OAuth for authentication:
1. Users click "Login with Discord"
2. Redirected to Discord OAuth page
3. After authorization, redirected back to `/oauth` route
4. Application exchanges code for access token
5. Fetches user data from Discord API
6. Creates/updates user in database
7. Issues JWT token for session management

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure proxy configuration is working
   - Check that backend allows the frontend origin

2. **Database Connection**
   - Verify MySQL is running
   - Check credentials in environment files
   - Ensure database exists

3. **Environment Variables**
   - Check that correct .env file is being loaded
   - Verify NODE_ENV is set correctly

4. **OAuth Issues**
   - Ensure Discord application redirect URI matches environment
   - Check client ID and secret are correct

### Log Checking
- Frontend: Browser dev tools console
- Backend: Terminal output where backend is running
- Database: Check MySQL error logs

## Production Deployment

1. **Build for production**
   ```bash
   npm run build:prod
   ```

2. **Start production backend**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

3. **Deploy frontend assets**
   - Upload `dist/` folder contents to web server
   - Configure web server to serve Angular routes

## Contributing

1. Create feature branch from `main`
2. Make changes in development environment
3. Test thoroughly with `npm run dev`
4. Submit pull request with detailed description

## Security Notes

- Environment files contain sensitive data - never commit them
- JWT secret should be changed in production
- Database credentials should be secured
- HTTPS should be used in production
