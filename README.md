# GIS Docker

Build and run Docker containers

`docker-compose -f docker-compose.dev.yaml up --build`

## Containers

### Nginx

Port 80

```
/api -> server:8082
/ -> client:8081
```

### Server (Node + Express)

Inner port 8082

### Client (Vue CLI)

Inner port 8081

### Geoserver (Tomcat)

Outside port 8080
