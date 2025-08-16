# Use Eclipse Temurin JDK 21 as base image (more reliable than OpenJDK)
FROM eclipse-temurin:21-jdk

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the Gradle wrapper files
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Make gradlew executable and download wrapper if needed
RUN chmod +x ./gradlew && ./gradlew --version

# Download dependencies (this layer will be cached if dependencies don't change)
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src src

# Build the application
RUN ./gradlew build -x test --no-daemon

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["./gradlew", "bootRun", "--no-daemon"]
