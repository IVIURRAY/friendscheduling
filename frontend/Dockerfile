# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port 19006 (Expo default)
EXPOSE 19006

# Start the Expo development server
CMD ["npm", "start"]
