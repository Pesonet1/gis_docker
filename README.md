# GIS Docker

Main purpose for this repository is to act as a playground for testing different GIS related web technologies.

This repository contains containerized (Docker) parts of a GIS application that constructs a simple GIS application. 
Additionally, pgrouting util container is included for running osm2pgrouting tool for importing osm data into database for pgrouting.

Running main containers (client & server currently disabled and need to be run manually)

- Client 8082:8082
- Server 8085:8085
- Database 5435:5432
- Geoserver 8080:8080
- Mapproxy 8083:8083
- Nginx 80:80
- Nominatim 7070:8100

Utility containers

- osm2pgrouting (run on demand)
- digiroad2pgrouting (run on demand)

Nginx is used for proxying network traffic between containers. Currently it is only used for proxying Geoserver & Mapproxy requests.

```
/geoserver -> geoserver:8080
/mapproxy -> mapproxy:8083
```

## Setup

First [install docker](https://docs.docker.com/compose/install/)

Build and run Docker containers

```
$ docker-compose -f docker-compose.dev.yaml up --build
```

Build individual containers

```
$ docker-compose build <container-name>
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
