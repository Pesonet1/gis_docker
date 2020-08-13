# Geoserver

This container is based on [container](https://hub.docker.com/r/oscarfonts/geoserver)

Geoserver has `kunnat` geopackage automatically configured that provides simple data for examples of different layer protocols (WMS, WMTS, WFS, VectorTile and WPS). Additionally `corine` tif-layer is added for testing raster functionalities.

## Extensions

Geoserver container supports adding external extensions. Extensions can be added into exts_dir folder by creating a new folder for extension .jar files. Check `extensions` file for supported extesions

## OGC Protocols

- WMS (Tiled WMS)
- WMTS
- WFS (WFS-T)
- VectorTile
- WPS

### WFS-T

1. Enable WFS for workspace
2. Services -> WFS  -> set workspace -> level: transactional
3. Give admin user WRITE & READ permissions
4. TODO User permissions...

### WPS

1. Enable WPS for workspace
2. Services -> WPS -> set workspace
3. TODO User permissions...

Client contains wpsSimpily.ts file for testing WPS service on client side

[Documentation for different processes](https://docs.geoserver.org/stable/en/user/services/wps/processes/index.html)

### WMTS & TileWMS (gridset for JHS180)

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

osm2pgrouting & digiroad2pgrouting containers documentation shows instructions on how to set pgRouting layers.

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
