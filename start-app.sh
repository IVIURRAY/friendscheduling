#!/bin/bash

echo "🚀 Starting Friend Scheduler App..."

# Start the containers in the background
docker compose up --build -d

echo "⏳ Waiting for services to be ready..."

# Wait for the API to be healthy
echo "📡 Waiting for API to be ready..."
while ! curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
  sleep 2
done
echo "✅ API is ready!"

# Wait for the UI to be accessible
echo "🖥️  Waiting for UI to be ready..."
while ! curl -f http://localhost:19006 > /dev/null 2>&1; do
  sleep 3
done
echo "✅ UI is ready!"

# Open the browser
echo "🌐 Opening browser..."
if command -v open > /dev/null 2>&1; then
  # macOS
  open http://localhost:19006
elif command -v xdg-open > /dev/null 2>&1; then
  # Linux
  xdg-open http://localhost:19006
else
  echo "❌ Could not open browser automatically."
  echo "🌐 Please visit: http://localhost:19006"
fi

echo "🎉 Friend Scheduler App is running!"
echo "📱 Web UI: http://localhost:19006"
echo "🔧 API: http://localhost:8080"
echo ""
echo "To stop the app, run: docker compose down"
