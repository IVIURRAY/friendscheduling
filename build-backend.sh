#!/bin/bash
set -e

echo "🏗️ Building backend application..."

# Navigate to backend directory
cd backend

# Check if gradlew exists and make it executable
if [ -f "./gradlew" ]; then
    echo "✅ Found gradlew, making it executable..."
    chmod +x ./gradlew
else
    echo "❌ gradlew not found in backend directory"
    ls -la
    exit 1
fi

# Check gradle wrapper jar
if [ -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "✅ Found gradle-wrapper.jar"
else
    echo "❌ gradle-wrapper.jar not found"
    ls -la gradle/wrapper/
    exit 1
fi

# Test gradle
echo "🧪 Testing Gradle..."
./gradlew --version

# Build the application
echo "🔨 Building application..."
./gradlew clean build -x test --no-daemon --info

# List the built artifacts
echo "📦 Built artifacts:"
ls -la build/libs/

echo "✅ Build completed successfully!"