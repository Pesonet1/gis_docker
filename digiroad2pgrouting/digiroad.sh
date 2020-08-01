#!/bin/bash

PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis -tAc "CREATE SCHEMA IF NOT EXISTS reititys"

for dir in digiroad_data/* ; do
  ogr2ogr -update -append -a_srs EPSG:3067 \
    -nlt MULTILINESTRING -lco GEOMETRY_NAME=geom -lco FID=id -lco SCHEMA=reititys \
    -f PostgreSQL "PG:host=localhost port=5435 user=postgres dbname=gis password=postgres" $dir/DR_LINKKI_K.shp \
    -nln reititys.digiroad
done

PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/pgrouting_setup.sql
