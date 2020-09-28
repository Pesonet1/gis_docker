# GIS Docker

Purpose for this repository is to act as a playground for testing different GIS related web technologies. Therefore, it cannot be considered as fully working application that can be automatically deployed into a server. However, this repository contains some useful examples that can be utilized in other projecs.

This repository contains containerized (Docker) parts of a GIS application e.g. different map layer protocols, routing, geocoding. Following can be considered as vital part of any GIS application. Additionally, this repository contains some utility containers (osm2pgrouting & digiroad2pgrouting) that are used for importing network data (osm & digiroad) into database for pgrouting.

Docker containers

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

## Overview of repository elements

- Nginx -> Proxy for proxying traffic between containers
- Client -> Main application for different GIS services (map layers, routing, geocoding)
- Server -> Currently only used for authentication
- Database -> Contains pgrouting and geocoding (nominatim) related data (osm, digiroad). Additionally OIDC related tables
- Geoserver -> Serves map layers in different protocols (WMS, WMTS, WFS, WFS-T, VectorTile, WPS)
- Mapproxy -> Serves background map for client (MML Taustakartta)
- Nominatim -> Geocoder for client application

### Nginx

Nginx is used for proxying network traffic between containers.

```
/ -> client:8082
/api -> server:8085/api
/oidc -> server:8085/oidc
/interaction -> server:8085/interaction
/geoserver -> geoserver:8080/geoserver
/mapproxy -> mapproxy:8083/mapproxy
/nominatim/ -> nominatim:8100/
```

### Database

Database container consists of two databases: gis & nominatim.

"gis"-database contains three schemas: public, routing_digiroad & routing_osm. Helsinki.osm.pbf & Uusimaa Digiroad subset data "gis"-database consumes around 1.35 gigabytes.
- public -> contains OIDC related tables
- routing_digiroad -> contains converted digiroad data for pgrouting
- routing_osm -> contains converted osm data for pgrouting

"nominatim"-database contains public schema that contains converted OSM data for nominatim geocoder. Helsinki.osm.pbf data consumes around 900 megabytes.

## Installing and running containers

1. [Install docker](https://docs.docker.com/compose/install/)
2. Build and run Docker containers with:

```
$ docker-compose -f docker-compose.dev.yaml up --build
```

In order to pgrouting & nominatim to work properly we need to import some OSM & Digiroad data for the project.

NOTE: Currently OSM filename is set on nominatim & pgrouting docker-compose files.

1. Load OSM by [cities](https://download.bbbike.org/osm/bbbike/) or [countries and other regions](http://download.geofabrik.de/europe/finland.html)
2. Load Digiroad data from [here](https://aineistot.vayla.fi/digiroad/latest/)
3. Place loaded data under root data folder. This folder that premade folders for each data type.
4. Import OSM & Digiroad data into database for pgrouting by running `pgrouting-database-setup.sh` script.
5. Import OSM data into database for nominatim by running `nomatim-setup.sh` script.

Additionally client provides by default to use Kapsi hosted Taustakartta as background map. In order to get background map working, we need to seed these tiles by using Mapproxy. Seeding can be started by running `mapproxy-seed.sh` script. This will take some time (approx. 1-2 hours). Leave it running on background.

After starting containers the main application should be available from `http://localhost:80` address.

### Useful docker commands

Build individual container

```
$ docker-compose -f <compose-file> build <container-name>
```

Run individual container

```
$ docker-compose -f <compose-file> up <container-name>
```

Start containers without build

```
$ docker-compose -f docker-compose.dev.yaml up
```

Start containers with build

```
$ docker-compose -f docker-compose.dev.yaml up --build
```

Shutdown containers

```
$ docker-compose -f docker-compose.dev.yaml down
```

## Installing and running client & server applications (for development purposes)

In order to run client & server applications [node](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) needs to be installed (or yarn can be seen as optional ;)).

### Server

Install server dependencies

```
$ cd server
$ yarn install
```

Run sequelize migrations and seeds (db container should be running by now)

```
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all
```

Start server with nodemon

```
$ yarn run start-dev
```

### Client

Install client dependencies

```
$ cd client
$ yarn install
```

Start client

```
$ yarn run serve
```
