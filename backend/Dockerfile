# Etapa 1: compila o jar com o JDK completo.
FROM docker.io/library/eclipse-temurin:25-jdk AS build
WORKDIR /app

# Baixa as dependências antes de copiar o código: enquanto o pom.xml não muda,
# o Docker reaproveita esta camada e o build fica bem mais rápido.
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -B -q dependency:go-offline

COPY src src
RUN ./mvnw -B -q package -DskipTests

# Etapa 2: só o JRE e o jar, imagem bem menor.
FROM docker.io/library/eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
