FROM eclipse-temurin:17-jdk-alpine AS base

#for compose.override
FROM base AS dev

FROM base AS builder

WORKDIR /backend

# download deps
COPY *.gradle gradlew /backend/
COPY gradle/ /backend/gradle/
RUN ./gradlew build -x test --parallel --continue > /dev/null 2>&1 || true

# make fatjar
COPY lib/ /backend/lib/
COPY src/ /backend/src/
RUN ./gradlew shadowJar


FROM eclipse-temurin:17-jdk-alpine

WORKDIR /backend

COPY --from=builder /backend/build/libs/fldemo*.jar /backend/fldemo-backend.jar

CMD ["java", "-jar", "fldemo-backend.jar"]
