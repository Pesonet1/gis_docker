#!/bin/bash

echo "Start database for data import"

docker-compose -f docker-compose.dev.yaml up -d database

echo "Run digiroad & osm data import tools"

docker-compose -f docker-compose.pgrouting.yaml up --build

read
