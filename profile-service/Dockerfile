# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN for i in 1 2 3 4 5; do \
      echo "=== Build attempt $i ===" && \
      mvn clean package -DskipTests -B && break || \
      echo "=== Attempt $i failed, retrying in 10s ===" && sleep 10; \
    done

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
