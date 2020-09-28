#!/bin/bash

echo "Start database for data import"

docker-compose -f docker-compose.dev.yaml up database

echo "Build and run nominatim-setup container for nominatim.so file copy process into database container"

docker-compose -f docker-compose.nominatim.yaml up --build
