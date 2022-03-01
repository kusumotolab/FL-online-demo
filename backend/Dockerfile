FROM openjdk:17-slim as builder

WORKDIR /backend

# download deps
COPY *.gradle gradlew /backend/
COPY gradle/ /backend/gradle/
RUN ./gradlew build -x test --parallel --continue > /dev/null 2>&1 || true

# build gtc
COPY lib/ /backend/lib/
COPY src/ /backend/src/
RUN ./gradlew shadowJar


FROM openjdk:17-slim

WORKDIR /backend

COPY --from=builder /backend/build/libs/fldemo*.jar /backend/fldemo-backend.jar

CMD ["java", "-jar", "fldemo-backend.jar"]
