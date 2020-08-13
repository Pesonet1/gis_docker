# Nominatim

This container is used for importing OSM data into dev-database for geocoding. Additionally, this container acts as a [geocoder (api) for OSM data](https://nominatim.org/).

## Installation & running

First get some OSM data and place it under this folder (NOTE: currently Helsinki.osm.pbf is the hardcoded filename).

https://download.bbbike.org/osm/bbbike/
http://download.geofabrik.de/europe/finland.html

NOTE: Run these commands inside nominatim folder (otherwise change relative paths)

1. Start dev-database container

`$ docker-compose up dev-database`

2. Build nominatim container inside

`$ docker build --tag nominatim -t nominatim .`

3. Run the container just to copy `nomatim.so` file into `dev-database` container

`$ docker run --name nominatim  --restart=always -p 7070:8100 -d -v /nominatim:/nominatim nominatim sh /app/startapache.sh`

Copy nominatim.so file into dev-database container from nominatim container

```
$ docker cp nominatim:/app/src/build/module/nominatim.so nominatim.so
$ docker exec -it dev-database mkdir –p app/src/build/module
$ docker cp nominatim.so dev-database:/app/src/build/module/nominatim.so
```

Remove nominatim container after copy

`$ docker rm nominatim`

4. Initialize nominatim with osm data

`$ docker run -p 7070:8100 -d -v /nominatim:/nominatim nominatim sh /app/init.sh`

5. Run container (manually for testing, since it is configured on docker-compose file)

`$ docker run --name nominatim -p 7070:8100 -d -v /nominatim:/nominatim nominatim sh /app/startapache.sh`

6. Test with example request

Search request

`http://localhost:7070/search?addressdetails=1&q=Helsinki&format=json&polygon_geojson=1&limit=2`

Reverse request

`http://localhost:7070/reverse?format=json&lat=60.1015&lon=24.5615&zoom=12&addressdetails=1`

Status request

`http://localhost:7070/status?format=json`
