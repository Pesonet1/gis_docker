# digiroad2pgrouting

Docker container can be used for importing digiroad topology into postgresql to be used by pgrouting. This is done by using [osm2pgrouting](https://github.com/pgRouting/osm2pgrouting) tool.

This docker container is heavily based on this [blog post](https://www.paikkatietomies.fi/pgrouting_miehen_tiella_pitaa/).

## Installation

1. Download digiroad dataset (K) [from here](https://aineistot.vayla.fi/digiroad/latest/).

2. Create `digiroad_data` folder inside digiroad2pgrouting folder and copy sub folders inside it e.g. ITA-UUSIMAA, UUSIMAA_1.

3. Build container with `docker build --tag digiroad2pgrouting .`

4. Run container with `docker run --name digiroad2pgrouting --rm --network="host" digiroad2pgrouting`

This will import digiroad data into database specified in `digiroad.sh` file into retititys schema. Additionally, all necessary necessary columns, functions are created by running `pgrouting_setup.sql` file.

## Using with Geoserver

Pgrouting can be used with Geoserver by using created pgrouting functions by creating following sql view layer.

```
SELECT ST_MakeLine(ST_LineMerge(route.geom))
FROM (
  SELECT geom FROM wrk_fromAtoB_digiroad(%x1%, %y1%, %x2%, %y2%
) ORDER BY seq) AS route
```

Parameters

```
y1 -> 0 -> ^-?[\d.]+$
y2 -> 0 -> ^-?[\d.]+$
x1 -> 0 -> ^-?[\d.]+$
x2 -> 0 -> ^-?[\d.]+$
```

Attributes

`st_makeline -> Geometry -> 3067`
