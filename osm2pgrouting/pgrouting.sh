#!/bin/bash

# Convert packed osm data into unpacked form
osmconvert osm_data/$OSM_FILENAME_VARIABLE \
  --drop-author \
  --drop-version \
  --out-osm \
  -o=pgrouting_data.osm

# Create "routing_osm" schema that is also used by digiroad2pgrouting
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis -tAc "CREATE SCHEMA IF NOT EXISTS routing_osm"

# Run osm2pgrouting
osm2pgrouting \
  --f pgrouting_data.osm \
  --conf mapconfig.xml \
  --dbname gis \
  --schema routing_osm \
  --host localhost \
  --port 5435 \
  --username postgres \
  --password postgres \
  --clean

# Converting osm data srid from ESPG:4326 into EPSG:3067
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/srid_convert.sql

# Creating views for routing functions
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/views.sql

# Creating routing functions
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/functions.sql
