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

echo "Running initialization script for Nominatim"

printenv

PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -tAc "SELECT 1 FROM pg_roles WHERE rolname='nominatim'" | grep -q 1 || PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -c "CREATE USER nominatim SUPERUSER"
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -tAc "SELECT 1 FROM pg_roles WHERE rolname='www-data'" | grep -q 1 || PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -c 'CREATE USER "www-data" SUPERUSER'
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -c 'GRANT usage ON SCHEMA public TO "www-data"; GRANT SELECT ON ALL TABLES IN SCHEMA public TO "www-data";'
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USERNAME -h $POSTGRES_HOST -p $POSTGRES_PORT $POSTGRES_DBNAME -c "DROP DATABASE IF EXISTS nominatim"

useradd -m -p password1234 nominatim
chown -R nominatim:nominatim ./src
chown -R postgres:postgres ./src

chmod a+r ./src/build/module/nominatim.so
chmod a+x ./src/build/module/nominatim.so

./src/build/utils/setup.php --osm-file $OSM_FILE --all --threads 4
./src/build/utils/check_import_finished.php
