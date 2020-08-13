# Osm2pgrouting

Docker container can be used for importing osm dataset into postgresql to be used by pgrouting. This is done by using [osm2pgrouting](https://github.com/pgRouting/osm2pgrouting) tool.

This docker container is heavely based on [pgrouting workshop](https://workshop.pgrouting.org/2.6/en/index.html)

## Installation & running

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

Pgrouting can be used with Geoserver by using created pgrouting functions by creating following sql view layer:

1. Create layer from a SQL view

```
DIJKSTRA

SELECT ROUND(SUM(route.cost)) as total_cost_in_min, ST_MakeLine(route.geom)
FROM (
    SELECT gid, cost, geom
    FROM wrk_dijkstra_fromAtoB_osm('vehicle_net', %x1%, %y1%, %x2%, %y2%)
    ORDER BY seq
) AS route

K-SHORTHEST PATH

SELECT DISTINCT ON (total_cost_in_min) route.path_id, ROUND(SUM(route.cost)) as total_cost_in_min, ST_MakeLine(route.geom)
FROM (
	SELECT gid, path_id, cost, geom
	FROM wrk_ksp_fromAtoB_osm('vehicle_net', %x1%, %y1%, %x2%, %y2%)
	ORDER BY path_id
) AS route
GROUP BY path_id
```

2. Quess parameters from SQL and set default value `0` and regular expression as `^-?[\d.]+$` to only accept numbers
3. Refresh attributes and set geometry srid from `-1` as `3067`
4. Bounding boxes -> `Compute from data` and `Compute from native bounds`
5. Set styling according to your liking
6. Test the layer with following request (change layer according to your naming)

```
http://localhost:8080/geoserver/geo/wms?
  SERVICE=WMS
  &VERSION=1.3.0
  &REQUEST=GetMap
  &FORMAT=image%2Fpng
  &TRANSPARENT=true
  &LAYERS=geo%3Apgrouting
  &VIEWPARAMS=x1%3A385823.05%3By1%3A6671394.36%3Bx2%3A387362.01%3By2%3A6675332.38
  &CRS=EPSG%3A3067
  &STYLES=
  &WIDTH=2043
  &HEIGHT=1271
  &BBOX=307582.7010787903%2C6625858.571753732%2C444939.67875173705%2C6711311.689043167
```
