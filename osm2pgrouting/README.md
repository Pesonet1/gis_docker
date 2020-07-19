# Osm2pgrouting

https://github.com/pgRouting/osm2pgrouting

## Running this container

NOTE: Run this container after you have started other containers (database is needed)

First get some OSM data and place it under this folder. TODO Include this inside build phase if not provided

https://download.bbbike.org/osm/bbbike/
http://download.geofabrik.de/europe/finland.html

Run the container

```
docker build --tag osm2pgrouting .
docker run --name osm2pgrouting --rm --network="host" osm2pgrouting
```

Container consists of following phases:

1. Converting zipped (.pbf) into osm by using osmconvert
2. Using osm2pgrouting to load osm data into database
3. Convert coordinates from EPSG:4326 into EPSG:3067
4. Creating necessary views for routing functions
5. Creating routing functions to be used by Geoserver
