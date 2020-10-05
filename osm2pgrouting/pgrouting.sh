#!/bin/bash

$OSM_FILE

for entry in osm_data/*.osm.pbf; do
  if [ -e $entry ]
  then
    OSM_FILE=$entry
    break
  fi
done

if [ -z $OSM_FILE ]
then
  echo "OSM file cannot be found from mounted volume. Exiting..."
  exit
fi

echo "Using mounted $OSM_FILE OSM file"

# Convert packed osm data into unpacked form
osmconvert $OSM_FILE \
  --drop-author \
  --drop-version \
  --out-osm \
  -o=pgrouting_data.osm

# Create "routing_osm" schema that is also used by digiroad2pgrouting
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -tAc "CREATE SCHEMA IF NOT EXISTS $POSTGRES_IMPORT_SCHEMA"

# Run osm2pgrouting
osm2pgrouting \
  --f pgrouting_data.osm \
  --conf mapconfig.xml \
  --dbname $POSTGRES_DBNAME \
  --schema $POSTGRES_IMPORT_SCHEMA \
  --host $POSTGRES_HOST \
  --port $POSTGRES_PORT \
  --username $POSTGRES_USERNAME \
  --password $POSTGRES_PASSWORD \
  --clean

# Converting osm data srid from ESPG:4326 into EPSG:3067
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME < sql/srid_convert.sql

# Creating views for routing functions
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME < sql/views.sql

# Creating routing functions
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME < sql/functions.sql
