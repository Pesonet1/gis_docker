drop table if exists country;
create table country(
  id serial not null primary key,
  osm_id integer,
  name text,
  uppername text,
  geom geometry(multipolygon, 3067)
);
create index gix_country on country using gist(geom);
delete from country;
insert into country(osm_id, name, uppername, geom) 
    SELECT planet_osm_polygon.osm_id,
      planet_osm_polygon.name as name,
      upper(planet_osm_polygon.name) AS uppername,
      st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
    FROM planet_osm_polygon
    WHERE planet_osm_polygon.admin_level = '2'::text AND planet_osm_polygon.boundary = 'administrative'::text;

drop table if exists amenity;
create table amenity(
	id serial not null primary key,
	osm_id integer,
	geom geometry(multipolygon, 3067)
);
create index gix_amenity on amenity using gist(geom);
delete from amenity;
insert into amenity(osm_id, geom) 
	SELECT planet_osm_polygon.osm_id,
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
   FROM planet_osm_polygon
  WHERE planet_osm_polygon.amenity IS NOT NULL AND (planet_osm_polygon.amenity = ANY (ARRAY['college'::text, 'community_centre'::text, 'courthouse'::text, 'doctors'::text, 'embassy'::text, 'grave_yard'::text, 'hospital'::text, 'library'::text, 'marketplace'::text, 'prison'::text, 'public_building'::text, 'school'::text, 'simming_pool'::text, 'theatre'::text, 'townhall'::text, 'university'::text]));
--delete from amenity where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists boundary;
create table boundary(
	id serial not null primary key,
	osm_id integer,
	name text,
	uppername text,
	geom geometry(multipolygon, 3067)
);
create index gix_boundary on boundary using gist(geom);
delete from boundary;
insert into boundary(osm_id, name, uppername, geom) 
	SELECT planet_osm_polygon.osm_id,
    planet_osm_polygon.name as name,
    upper(planet_osm_polygon.name) AS uppername,
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE planet_osm_polygon.admin_level = '2'::text AND planet_osm_polygon.boundary = 'administrative'::text;

drop table if exists buildings;
create table buildings(
  id serial not null primary key,
  osm_id integer,
  name text,
  housename text,
  housenumber text,
  geom geometry(multipolygon, 3067)
);
create index gix_buildings on buildings using gist(geom);
delete from buildings;
insert into buildings(osm_id, name, housename, housenumber, geom) 
    SELECT planet_osm_polygon.osm_id, 
      planet_osm_polygon.name,  
      planet_osm_polygon."addr:housename",
       planet_osm_polygon."addr:housenumber",
      st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
    FROM planet_osm_polygon
    WHERE planet_osm_polygon.building IS NOT NULL AND st_area(planet_osm_polygon.way) < 100000::double precision;
--delete from buildings where not st_intersects(geom, (select geom from country));

drop table if exists county;
create table county(
	id serial not null primary key,
	osm_id integer,
	name text,
	uppername text,
	geom geometry(multipolygon, 3067)
);
create index gix_county on county using gist(geom);
delete from county;
insert into county(osm_id, name, uppername, geom) 
	SELECT planet_osm_polygon.osm_id, 
    	planet_osm_polygon.name as name,  
    	upper(planet_osm_polygon.name) AS uppername,
    	st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
   	FROM planet_osm_polygon
  	WHERE (planet_osm_polygon.place = 'county'::text OR planet_osm_polygon.admin_level = '6'::text AND planet_osm_polygon.name = 'Budapest'::text) AND planet_osm_polygon.boundary = 'administrative'::text;
delete from county where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists district;
create table district(
  id serial not null primary key,
  osm_id integer,
  name text,
  uppername text,
  geom geometry(multipolygon, 3067)
);
create index gix_district on district using gist(geom);
delete from district;
insert into district(osm_id, name, uppername, geom) 
  SELECT planet_osm_polygon.osm_id, 
    planet_osm_polygon.name, 
    upper(planet_osm_polygon.name) AS uppername,
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE planet_osm_polygon.admin_level = '9'::text AND planet_osm_polygon.boundary = 'administrative'::text;
delete from district where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists forestpark;
create table forestpark(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multipolygon, 3067)
);
create index gix_forestpark on forestpark using gist(geom);
delete from forestpark;
insert into forestpark(osm_id, name, geom) 
  SELECT planet_osm_polygon.osm_id, 
    planet_osm_polygon.name, 
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE (planet_osm_polygon.landuse = ANY (ARRAY['forest'::text, 'orchard'::text, 'park'::text, 'plant_nursery'::text, 'grass'::text, 'greenfield'::text, 'meadow'::text, 'recreation_ground'::text, 'village_green'::text, 'vineyard'::text])) OR (planet_osm_polygon.leisure = ANY (ARRAY['nature_reserve'::text, 'park'::text, 'dog_park'::text, 'garden'::text, 'golf_course'::text, 'horse_riding'::text, 'recreation_ground'::text, 'stadium'::text]));
delete from forestpark where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists lakes;
create table lakes(
  id serial not null primary key,
  osm_id integer,
  name text,
  way_area real,
  geom geometry(multipolygon, 3067)
);
create index gix_lakes on lakes using gist(geom);
delete from lakes;
insert into lakes(osm_id, name, way_area, geom) 
  SELECT planet_osm_polygon.osm_id, 
    planet_osm_polygon.name,  
    planet_osm_polygon.way_area,
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE planet_osm_polygon."natural" = 'water'::text AND (planet_osm_polygon.water IS NULL OR planet_osm_polygon.water IS NOT NULL AND planet_osm_polygon.water <> 'river'::text);
delete from lakes where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists minor_roads;
create table minor_roads(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multilinestring, 3067)
);
create index gix_minor_roads on minor_roads using gist(geom);
delete from minor_roads;
insert into minor_roads(osm_id, name, geom) 
  SELECT planet_osm_line.osm_id, 
    planet_osm_line.name,  
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
  FROM planet_osm_line
  WHERE planet_osm_line.highway IS NOT NULL AND (planet_osm_line.highway <> ALL (ARRAY['motorway'::text, 'motorway_link'::text, 'trunk'::text, 'primary'::text, 'trunk_link'::text, 'primary_link'::text, 'secondary'::text, 'secondary_link'::text, 'road'::text, 'tertiary'::text, 'tertiary_link'::text, 'steps'::text, 'footway'::text, 'path'::text, 'pedestrian'::text, 'walkway'::text, 'service'::text, 'track'::text])) AND planet_osm_line.railway IS NULL OR planet_osm_line.railway = 'no'::text;
--delete from minor_roads where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists motorway;
create table motorway(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multilinestring, 3067)
);
create index gix_motorway on motorway using gist(geom);
delete from motorway;
insert into motorway(osm_id, name, geom) 
  SELECT planet_osm_line.osm_id, 
 	  planet_osm_line.name,  
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
  FROM planet_osm_line
  WHERE planet_osm_line.highway = 'motorway'::text;
delete from motorway where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists pedestrian;
create table pedestrian(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multilinestring, 3067)
);
create index gix_pedestrian on pedestrian using gist(geom);
delete from pedestrian;
insert into pedestrian(osm_id, name, geom) 
  SELECT planet_osm_line.osm_id, 
   	planet_osm_line.name, 
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
  FROM planet_osm_line
  WHERE planet_osm_line.highway = ANY (ARRAY['steps'::text, 'footway'::text, 'path'::text, 'pedestrian'::text, 'walkway'::text, 'service'::text, 'track'::text]);
--delete from pedestrian where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists rails;
create table rails(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multilinestring, 3067)
);
create index gix_rails on rails using gist(geom);
delete from rails;
insert into rails(osm_id, name, geom) 
  SELECT planet_osm_line.osm_id, 
    planet_osm_line.name,  
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
  FROM planet_osm_line
  WHERE planet_osm_line.railway IS NOT NULL AND (planet_osm_line.railway = ANY (ARRAY['light rail'::text, 'rail'::text, 'rail;construction'::text, 'tram'::text, 'yes'::text, 'traverser'::text])) OR planet_osm_line.railway ~~ '%rail%'::text;
--delete from rails where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists roads;
create table roads(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multilinestring, 3067)
);
create index gix_roads on roads using gist(geom);
delete from roads;
insert into roads(osm_id, name, geom) 
 SELECT planet_osm_line.osm_id, 
    planet_osm_line.name,  
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
   FROM planet_osm_line
  WHERE planet_osm_line.highway = ANY (ARRAY['trunk_link'::text, 'primary_link'::text, 'secondary'::text, 'secondary_link'::text, 'road'::text, 'tertiary'::text, 'tertiary_link'::text]);
--delete from roads where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists settlements;
create table settlements(
  id serial not null primary key,
  osm_id integer,
  name text,
  uppername text,
  way_area real,
  geom geometry(multipolygon, 3067)
);
create index gix_settlements on settlements using gist(geom);
delete from settlements;
insert into settlements(osm_id, name, uppername, way_area, geom) 
  SELECT planet_osm_polygon.osm_id, 
    planet_osm_polygon.name, 
    upper(planet_osm_polygon.name) AS uppername,
    planet_osm_polygon.way_area,
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE planet_osm_polygon.admin_level = '8'::text AND planet_osm_polygon.boundary = 'administrative'::text;
delete from settlements where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists subdistrict;
create table subdistrict(
  id serial not null primary key,
  osm_id integer,
  name text,
  uppername text,
  geom geometry(multipolygon, 3067)
);
create index gix_subdistrict on subdistrict using gist(geom);
delete from subdistrict;
insert into subdistrict(osm_id, name, uppername, geom) 
  SELECT planet_osm_polygon.osm_id, 
    planet_osm_polygon.name,  
    upper(planet_osm_polygon.name) AS uppername,
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE planet_osm_polygon.admin_level = '10'::text AND planet_osm_polygon.boundary = 'administrative'::text;
delete from subdistrict where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists trunk_primary;
create table trunk_primary(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multilinestring, 3067)
);
create index gix_trunk_primary on trunk_primary using gist(geom);
delete from trunk_primary;
insert into trunk_primary(osm_id, name, geom) 
  SELECT planet_osm_line.osm_id, 
    planet_osm_line.name, 
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
  FROM planet_osm_line
  WHERE planet_osm_line.highway = ANY (ARRAY['motorway_link'::text, 'trunk'::text, 'primary'::text]);
--delete from trunk_primary where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists water;
create table water(
  id serial not null primary key,
  osm_id integer,
  name text,
  geom geometry(multipolygon, 3067)
);
create index gix_water on water using gist(geom);
delete from water;
insert into water(osm_id, name, geom) 
  SELECT planet_osm_polygon.osm_id, 
    planet_osm_polygon.name,  
    st_multi(planet_osm_polygon.way)::geometry(MultiPolygon, 3067) as way
  FROM planet_osm_polygon
  WHERE planet_osm_polygon."natural" = 'water'::text OR planet_osm_polygon.water IS NOT NULL OR planet_osm_polygon.waterway ~~ '%riverbank%'::text;
--delete from water where not st_intersects(st_centroid(geom), (select geom from country limit 1));

drop table if exists waterway;
create table waterway(
  id serial not null primary key,
  osm_id integer,
  name text,
  waterway text,
  geom geometry(multilinestring, 3067)
);
create index gix_waterway on waterway using gist(geom);
delete from waterway;
insert into waterway(osm_id, name, waterway, geom) 
  SELECT planet_osm_line.osm_id, 
    planet_osm_line.name,  
    planet_osm_line.waterway,
    st_multi(planet_osm_line.way)::geometry(MultiLineString, 3067) as way
  FROM planet_osm_line
  WHERE planet_osm_line.waterway = ANY (ARRAY['drain'::text, 'canal'::text, 'waterfall'::text, 'river'::text, 'stream'::text, 'yes'::text]);
--delete from waterway where not st_intersects(st_centroid(geom), (select geom from country limit 1));