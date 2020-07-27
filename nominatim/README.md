# Nominatim

## Installation

NOTE: Run these commands inside nominatim folder (otherwise change relative paths)

1. Start dev-database container

2. Build nominatim container inside

`docker build --tag nominatim -t nominatim .`

3. Run the container just to copy `nomatim.so` file into `dev-database` container

`docker run --name nominatim  --restart=always -p 7070:8100 -d -v /nominatim:/nominatim nominatim sh /app/startapache.sh`

Copy nominatim.so file into dev-database container from nominatim container

```
docker cp nominatim:/app/src/build/module/nominatim.so nominatim.so
docker exec -it dev-database mkdir –p app/src/build/module
docker cp nominatim.so dev-database:/app/src/build/module/nominatim.so
```

Remove nominatim container after copy

`docker rm nominatim`

4. Initialize nominatim with osm data

`docker run -p 7070:8100 -d -v /nominatim:/nominatim nominatim sh /app/init.sh`

5. Run container

`docker run --name nominatim  --restart=always -p 7070:8100 -d -v /nominatim:/nominatim nominatim sh /app/startapache.sh`
