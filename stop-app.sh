#!/bin/bash

echo "🛑 Stopping Friend Scheduler App..."

# Stop and remove containers
docker compose down

echo "✅ App stopped successfully!"
echo ""
echo "To start the app again, run: ./start-app.sh"
