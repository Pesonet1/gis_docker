#!/bin/bash

echo "Start database for data import"

# docker-compose -f docker-compose.dev.yaml build database
docker-compose -f docker-compose.dev.yaml up database

echo "Run digiroad & osm data import tools"

docker-compose -f docker-compose.pgrouting.yaml up --build
