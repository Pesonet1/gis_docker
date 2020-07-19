#!/bin/bash

# TODO .osm.pbf file as parameter to this script

# Convert packed osm data into unpacked form
osmconvert & osmconvert \
  Helsinki.osm.pbf \
  --drop-author \
  --drop-version \
  --out-osm \
  -o=pgrouting_data.osm

# Run osm2pgrouting
pgrouting & osm2pgrouting \
  --f pgrouting_data.osm \
  --conf mapconfig.xml \
  --dbname gis \
  --host localhost \
  --port 5435 \
  --username postgres \
  --password postgres \
  --clean

# Converting osm data srid from ESPG:4326 into EPSG:3067
srid_convert & PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/srid_convert.sql

# Creating views for routing functions
create_views & PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/views.sql

# Creating routing functions
create_functions & PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/functions.sql

exec pgrouting && srid_convert && create_views && create_functions
