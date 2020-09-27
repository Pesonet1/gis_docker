#!/bin/bash

echo "Build nominatim container"

docker build --tag nomatim -t nominatim .

echo "Run nominatim container"

docker run --name nominatim -d -v /nominatim:/nominatim nominatim sh /app/startapache.sh

echo "Copy nomtinatim.so file into database container"

docker cp nominatim:/app/src/build/module/nominatim.so nominatim.so
docker exec -it dev-database mkdir –p app/src/build/module
docker cp nominatim.so dev-database:/app/src/build/module/nominatim.so

echo "Removing container after copying file"

docker rm nominatim
