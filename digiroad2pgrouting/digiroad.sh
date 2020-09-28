#!/bin/bash

PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis -tAc "CREATE SCHEMA IF NOT EXISTS routing_digiroad"
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis -tAc "DROP TABLE IF EXISTS routing_digiroad.digiroad"
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis -tAc "DROP TABLE IF EXISTS routing_digiroad.digiroad_vertices_pgr"
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis -tAc "DROP TABLE IF EXISTS routing_digiroad.digiroad_nopeusrajoitus"

for dir in digiroad_data/* ; do
  ogr2ogr -update -append -a_srs EPSG:3067 \
    -nlt LINESTRING -lco GEOMETRY_NAME=geom -lco FID=id -lco SCHEMA=routing_digiroad \
    -f PostgreSQL "PG:host=localhost port=5435 user=postgres dbname=gis password=postgres" $dir/DR_LINKKI_K.shp \
    -nln routing_digiroad.digiroad

  ogr2ogr -update -append -a_srs EPSG:3067 \
    -nlt LINESTRING -lco GEOMETRY_NAME=geom -lco FID=id -lco SCHEMA=routing_digiroad \
    -f PostgreSQL "PG:host=localhost port=5435 user=postgres dbname=gis password=postgres" $dir/DR_NOPEUSRAJOITUS_K.shp \
    -nln routing_digiroad.digiroad_nopeusrajoitus
done

PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis < sql/pgrouting_setup.sql
