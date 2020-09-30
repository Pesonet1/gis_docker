#!/bin/bash

echo "Start database for data import"

docker-compose -f docker-compose.dev.yaml up -d database

echo "Copy nominatim.so file from nominatim container into database container (change container names if not working or run this separately)"

docker cp gis_infra_docker_nominatim_1:/app/src/build/module/nominatim.so nominatim.so
docker exec -it gis_infra_docker_database_1 sh -c 'mkdir -p app/src/build/module'
docker cp nominatim.so gis_infra_docker_database_1:/app/src/build/module/nominatim.so

echo "Build and run nominatim-setup container for nominatim.so file copy process into database container"

docker-compose -f docker-compose.nominatim.yaml up --build

read
