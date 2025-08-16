# Friend Scheduler App Makefile

.PHONY: help start stop status logs clean build

# Default target
help:
	@echo "Friend Scheduler App - Available Commands:"
	@echo ""
	@echo "  make start    - Start the app and open browser"
	@echo "  make stop     - Stop the app"
	@echo "  make status   - Show container status"
	@echo "  make logs     - Show container logs"
	@echo "  make clean    - Stop and remove containers"
	@echo "  make build    - Build containers without starting"
	@echo "  make help     - Show this help message"
	@echo ""

# Start the application and open browser
start:
	@echo "🚀 Starting Friend Scheduler App..."
	@./start-app.sh

# Stop the application
stop:
	@echo "🛑 Stopping Friend Scheduler App..."
	@./stop-app.sh

# Show container status
status:
	@echo "📊 Container Status:"
	@docker compose ps

# Show container logs
logs:
	@echo "📋 Container Logs:"
	@docker compose logs --tail=50

# Show API logs only
logs-api:
	@echo "📋 API Logs:"
	@docker compose logs api --tail=50

# Show UI logs only
logs-ui:
	@echo "📋 UI Logs:"
	@docker compose logs ui --tail=50

# Clean up containers and networks
clean:
	@echo "🧹 Cleaning up containers and networks..."
	@docker compose down --volumes --remove-orphans
	@echo "✅ Cleanup complete!"

# Build containers without starting
build:
	@echo "🔨 Building containers..."
	@docker compose build
	@echo "✅ Build complete!"

# Restart the application
restart: stop start

# Show health check
health:
	@echo "🏥 Health Check:"
	@curl -f http://localhost:8080/actuator/health 2>/dev/null || echo "❌ API not responding"
	@curl -f http://localhost:19006 >/dev/null 2>&1 && echo "✅ UI is responding" || echo "❌ UI not responding"
