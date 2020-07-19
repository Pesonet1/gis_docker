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

## OSM Tiles served from Geoserver

Bases on https://github.com/fegyi001/osmgwc

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