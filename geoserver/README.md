# Geoserver

This container is based on (container)[https://hub.docker.com/r/oscarfonts/geoserver]

Geoserver has `kunnat` geopackage automatically configured that provides simple data for examples of different layer protocols (WMS, WMTS, WFS, VectorTile).

## Extensions

Geoserver container supports adding external extensions. Extensions can be added into exts_dir folder by creating a new folder for extension .jar files. Check `extensions` file for supported extesions

## OGC Protocols

- WMS (Tiled WMS)
- WMTS
- WFS (WFS-T)
- VectorTile

### WFS-T

1. Enable WFS for workspace
2. Services -> WFS  -> set workspace -> level: transactional
3. Give admin user WRITE & READ permissions
4. TODO User permissions...

### Gridset for JHS180

1. Gridset bounds (minx: -548,576 miny: 6,291,456 maxx: 1,548,576 maxy: 8,388,608)
2. Tile dimensions -> 256 x 256 pixels
3. Tile matrix set

```
zoom level | pixel size
0 | 8,192
1 | 4,096
2 | 2,048
3 | 1,024
4 | 512
5 | 256
6 | 128
7 | 64
8 | 32
9 | 16
10 | 8
11 | 4
12 | 2
13 | 1
14 | 0.5
15 | 0.25
```

## pgRouting

1. Create layer from a SQL view

```
SELECT ST_MakeLine(route.geom) FROM (
    SELECT geom FROM wrk_fromAtoB('vehicle_net', %x1%, %y1%, %x2%, %y2%
  ) ORDER BY seq) AS route
```

2. Quess parameters from SQL and set default value `0` and regular expression as `^-?[\d.]+$` to only accept numbers
3. Refresh attributes and set srid from `-1` as `3067`
4. Bounding boxes -> `Compute from data` and `Compute from native bounds`
5. Set styling according to your liking
6. Test the layer with following request

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

## OSM Tiles served from Geoserver (just an example not a part of any container initialization)

Based on https://github.com/fegyi001/osmgwc

1. Download osm-data

```
https://download.geofabrik.de/europe/finland.html
```

2. Use osm2pgsql for importing data into database

```
PGPASSWORD=postgres PGPORT=5435 osm2pgsql -c -d gis -U postgres -H localhost finland-latest.osm.pbf --slim -C 4096 --cached-strategy sparse
```

3. Run custom osm scripts...

Geoserver

1. Create individual layers from osm data tables (after running custom script)
2. Apply osm css styles for each of the layers
3. Create layer group
4. Create JHS180 gridset (EPSG:3067) http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html
5. Apply grid set for created osm layergroup

TODO How to style to imitate OSM...
