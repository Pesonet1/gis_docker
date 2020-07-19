# GIS Docker

Main purpose for this repository is to act as a playground for testing different GIS related web technologies.

This repository contains containerized (Docker) parts of a GIS application that constructs a simple GIS application. 
Additionally, pgrouting util container is included for running osm2pgrouting tool for importing osm data into database for pgrouting.

- Client 8082:8082
- Server 8085:8085
- Database 5435:5432
- Geoserver 8080:8080
- Mapproxy 8083:8083
- Nginx 80:80
- osm2pgrouting (run on demand)

Nginx is used for proxying network traffic between containers. Currently it is only used for proxying Geoserver & Mapproxy requests.

```
/geoserver -> geoserver:8080
/mapproxy -> mapproxy:8083
```

## Setup

First [install docker](https://docs.docker.com/compose/install/)

Build and run Docker containers (geoserver, database, mapproxy, nginx)

```
$ docker-compose -f docker-compose.dev.yaml up --build
```

Start containers without build

```
$ docker-compose -f docker-compose.dev.yaml up
```

Shutdown containers

```
$ docker-compose -f docker-compose.dev.yaml down
```

Manually run server & client applications

```
cd client -> yarn run serve
cd server -> npm run start
```

TODO: Dockerize server & client applications
