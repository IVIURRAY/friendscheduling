# Single-stage build optimized for Railway
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy all backend files
COPY . .

# Make gradlew executable and build in one step to reduce layers
RUN chmod +x ./gradlew && \
    ./gradlew clean build -x test --no-daemon --parallel && \
    ls -la build/libs/ && \
    # Install curl for health checks \
    apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Expose port
EXPOSE 8080

# Run the application with Railway's dynamic port
CMD ["sh", "-c", "java -Xmx512m -Dserver.port=${PORT:-8080} -jar build/libs/demo-0.0.1-SNAPSHOT.jar"]
