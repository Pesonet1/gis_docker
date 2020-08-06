# Osm2pgrouting

Docker container can be used for importing osm dataset into postgresql to be used by pgrouting. This is done by using [osm2pgrouting](https://github.com/pgRouting/osm2pgrouting) tool.

This docker container is heavely based on [pgrouting workshop](https://workshop.pgrouting.org/2.6/en/index.html)

## Running this container

NOTE: Run this container after you have started other containers (database is needed)

First get some OSM data and place it under this folder (NOTE: currently Helsinki.osm.pbf is the hardcoded filename).

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

## Using with Geoserver

Pgrouting can be used with Geoserver by using created pgrouting functions by creating following sql view layer.

```
SELECT ST_MakeLine(route.geom)
FROM (
  SELECT geom FROM wrk_fromAtoB_osm('vehicle_net', %x1%, %y1%, %x2%, %y2%
) ORDER BY seq) AS route
```

Parameters

y1 -> 0 -> ^-?[\d.]+$
y2 -> 0 -> ^-?[\d.]+$
x1 -> 0 -> ^-?[\d.]+$
x2 -> 0 -> ^-?[\d.]+$

Attributes

st_makeline -> Geometry -> 3067
