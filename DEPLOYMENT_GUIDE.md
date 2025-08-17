# 🚀 Deployment Guide for Apple OAuth Testing

This guide shows how to deploy your backend to test Apple OAuth while keeping your frontend running locally.

## 🎯 The Setup

```
Local Frontend (localhost:19006) 
    ↓ API calls
Hosted Backend (https://yourapp.railway.app)
    ↓ Apple OAuth
Apple Developer Console (works with real domain)
```

## 📋 Step 1: Deploy Backend to Railway

1. **Create Railway Account**:
   ```bash
   # Go to: https://railway.app
   # Sign up with GitHub (free tier available)
   ```

2. **Deploy Backend**:
   ```bash
   cd backend/
   
   # Initialize git if needed
   git init
   git add .
   git commit -m "Initial commit for deployment"
   
   # Connect to Railway
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **Configure Environment Variables** in Railway Dashboard:
   ```bash
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   APPLE_CLIENT_ID=com.yourcompany.friendscheduler.service
   APPLE_CLIENT_SECRET=your-generated-jwt-token
   FRONTEND_URL=http://localhost:19006
   ```

4. **Get Your Railway Domain**:
   ```bash
   # Railway will provide a domain like:
   # https://friendscheduler-production-abc123.up.railway.app
   ```

## 📋 Step 2: Configure Apple OAuth

1. **In Apple Developer Console**:
   ```
   Domain: friendscheduler-production-abc123.up.railway.app
   Return URL: https://friendscheduler-production-abc123.up.railway.app/login/oauth2/code/apple
   ```

2. **Generate Apple JWT Client Secret**:
   ```bash
   cd scripts/
   npm install jsonwebtoken
   # Edit generate-apple-jwt.js with your Apple credentials
   node generate-apple-jwt.js
   # Copy the generated JWT to Railway environment variables
   ```

## 📋 Step 3: Configure Local Frontend

1. **Update Frontend Environment**:
   ```bash
   # In frontend/.env
   REACT_APP_API_URL=https://friendscheduler-production-abc123.up.railway.app
   ```

2. **Restart Local Frontend**:
   ```bash
   npm start
   # or if using Docker:
   docker compose restart ui
   ```

## 🧪 Step 4: Test Apple OAuth

1. **Open Local Frontend**: http://localhost:19006
2. **Both buttons should now show**: "Continue with Google" and "Continue with Apple"
3. **Test Apple OAuth**: Click "Continue with Apple"
4. **OAuth Flow**:
   - Redirects to Apple sign-in
   - Apple redirects to hosted backend
   - Backend redirects back to local frontend
   - You're logged in locally with Apple account!

## 🔧 Alternative Hosting Options

### Vercel (Free Tier)
```bash
npm i -g vercel
cd backend/
vercel
# Follow prompts, get domain like: https://yourapp.vercel.app
```

### Heroku (Paid)
```bash
# Install Heroku CLI
cd backend/
git init
heroku create yourapp
git push heroku main
```

### Netlify Functions (Free Tier)
```bash
# Good for small APIs
cd backend/
netlify deploy
```

## 🎯 Benefits of This Approach

✅ **Real Apple OAuth testing** with local development
✅ **No need for complex local SSL setup**
✅ **Keep fast local development workflow**
✅ **Production-ready backend deployment**
✅ **Easy to iterate and test**

## 🔍 Troubleshooting

### CORS Issues
```bash
# Backend CORS is configured for localhost:19006
# If you get CORS errors, check Railway logs
```

### Apple OAuth Callback Issues
```bash
# Make sure Return URL in Apple Console exactly matches:
# https://your-domain.railway.app/login/oauth2/code/apple
```

### Environment Variables
```bash
# Double-check all environment variables are set in Railway
# Use railway logs to debug
```

## 📱 Production Deployment

When ready for full production:

1. **Deploy Frontend** to the same domain
2. **Update Apple OAuth** return URL to production frontend
3. **Update Environment Variables** for production URLs

This setup gives you the best of both worlds: real Apple OAuth testing with fast local development! 🎉