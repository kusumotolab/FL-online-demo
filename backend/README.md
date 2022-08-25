# FL-online-demo backend

## Requirements
* JDK 17

## 起動方法
### Gradleから起動
```shell
./gradlew bootRun
```

### Fat Jarから起動
```shell
./gradlew shadowJar
java -jar backend/build/libs/fldemo-*-all.jar
```

## REST API Documentation
Swagger UIで確認できます  
プログラム起動後にWebブラウザで
http://localhost:8080/swagger-ui/index.html
にアクセス

## OpenAPI Speficification
```shell
curl http://localhost:8080/v3/api-docs
```
