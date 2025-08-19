# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for Expo)
RUN npm ci

# Copy source code
COPY . .

# Expose port 19006 (Expo web default)
EXPOSE 19006

# Start the Expo development server
CMD ["npm", "start"]
