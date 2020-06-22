ALTER TABLE planet_osm_line
	ALTER COLUMN way TYPE geometry(LineString, 3067) 
  		USING ST_Transform(ST_SetSRID(way, 3857), 3067);
		
ALTER TABLE planet_osm_point
	ALTER COLUMN way TYPE geometry(Point, 3067) 
  		USING ST_Transform(ST_SetSRID(way, 3857), 3067);
		
ALTER TABLE planet_osm_polygon
	ALTER COLUMN way TYPE geometry(Polygon, 3067) 
  		USING ST_Transform(ST_SetSRID(way, 3857), 3067);
		
ALTER TABLE planet_osm_roads
	ALTER COLUMN way TYPE geometry(LineString, 3067) 
  		USING ST_Transform(ST_SetSRID(way, 3857), 3067);