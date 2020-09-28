#!/bin/bash

OSM_FILENAME=$1

echo "Running initialization script for Nominatim"

PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis -tAc "SELECT 1 FROM pg_roles WHERE rolname='nominatim'" | grep -q 1 || PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis -c "CREATE USER nominatim SUPERUSER"
PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis -tAc "SELECT 1 FROM pg_roles WHERE rolname='www-data'" | grep -q 1 || PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis -c 'CREATE USER "www-data" SUPERUSER'
PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis -c 'GRANT usage ON SCHEMA public TO "www-data"; GRANT SELECT ON ALL TABLES IN SCHEMA public TO "www-data";'
PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis -c "DROP DATABASE IF EXISTS nominatim"

useradd -m -p password1234 nominatim
chown -R nominatim:nominatim ./src
chown -R postgres:postgres ./src

chmod a+r ./src/build/module/nominatim.so
chmod a+x ./src/build/module/nominatim.so

./src/build/utils/setup.php --osm-file osm_data/$OSM_FILENAME --all --threads 4
./src/build/utils/check_import_finished.php
