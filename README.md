# GIS Docker

Purpose for this repository is to act as a playground for testing different GIS related web technologies. Therefore, it cannot be considered as fully working application that can be deployed automatically. However, this repository contains some usefull examples that can be taken into other projecs.

This repository contains containerized (Docker) parts of a GIS application e.g. different map layer protocols, routing, geocoding. Following can be considered as vital part of any GIS application. Additionally, this repository contains some utility containers (osm2pgrouting & digiroad2pgrouting) that are used for importing network data (osm & digiroad) into database for pgrouting.

Individually run applications

- Client 8082
- Server 8085

Docker containers

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

## Overview of repository elements

- Client -> Main application for different GIS services (map layers, routing, geocoding)
- Server -> Currently only used for authentication
- Database -> Contains pgrouting related data. Additionally OIDC related stuff
- Geoserver -> Serves map layers in different protocols (WMS, WMTS, WFS, WFS-T, VectorTile, WPS)
- Mapproxy -> Serves background map for client (MML Taustakartta)
- Nominatim -> Geocoder for client application
- Nginx -> Proxy for proxying traffic between containers

## Installing and running containers

1. [Install docker](https://docs.docker.com/compose/install/)
2. Load OSM data for Nominatim & osm2pgrouting (instructions on seperate documentation under nominatim & osm2pgrouting folders)
3. Load digiroad data for digiroad2pgrouting (instructions on seperate documentation under digiroad2pgrouting folder)
4. Import OSM data into Nominatim (instructions on seperate documentation under nominatim folder)
5. Run osm2pgrouting & digiroad2pgrouting containers
6. Build and run rest of the Docker containers

```
$ docker-compose -f docker-compose.dev.yaml up --build
```

### Useful docker commands

Build individual container

```
$ docker-compose build <container-name>
```

Run individual container

```
$ docker-compose up <container-name>
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

In order to run client & server applications [node](https://nodejs.org/en/) needs to be installed.

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
