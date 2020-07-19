ALTER TABLE ways
	ALTER COLUMN the_geom TYPE geometry(LineString, 3067) 
  		USING ST_Transform(ST_SetSRID(the_geom, 4326), 3067);

ALTER TABLE ways_vertices_pgr
	ALTER COLUMN the_geom TYPE geometry(Point, 3067) 
  		USING ST_Transform(ST_SetSRID(the_geom, 4326), 3067);
