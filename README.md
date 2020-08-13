# GIS Docker

Main purpose for this repository is to act as a playground for testing different GIS related web technologies.

This repository contains containerized (Docker) parts of a GIS application that constructs a simple GIS application. 
Additionally, pgrouting containers (osm2pgrouting & digiroad2pgrouting) are included for running osm2pgrouting tool for importing network data (osm & digiroad) into database for pgrouting.

Running main containers (client & server currently disabled and need to be run manually)

- Client 8082 (not dockerized)
- Server 8085 (not dockerized)
- Database 5435:5432
- Geoserver 8080:8080
- Mapproxy 8083:8083
- Nginx 80:80
- Nominatim 7070:8100

Utility containers

- osm2pgrouting (run on demand)
- digiroad2pgrouting (run on demand)

Nginx is used for proxying network traffic between containers. Currently it is used for proxying Geoserver, Mapproxy & Nominatim requests.

```
/geoserver -> geoserver:8080
/mapproxy -> mapproxy:8083
/nominatim/ -> nominatim:8100
```

## Installing and running containers

First [install docker](https://docs.docker.com/compose/install/)

Build and run Docker containers

```
$ docker-compose -f docker-compose.dev.yaml up --build
```

NOTE: nominatim container requires seperate steps to seed OSM data into database
NOTE: digiroad2pgrouting & osm2pgrouting containers needs to be run seperately in order to make rotuing work

### Useful docker commands

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

## Installing and running client & server applications

Install [node](https://nodejs.org/en/)

### Server

Install server dependencies

```
$ cd server
$ npm install
```

Run sequelize migrations and seeds (db container should be running by now)

```
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all
```

Start server

```
$ npm run start
```

### Client

First install [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

Install client dependencies

```
$ cd client
$ yarn install
```

Run client

```
$ yarn run serve
```
