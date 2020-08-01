ALTER TABLE reititys.digiroad ALTER COLUMN geom TYPE geometry(LineString, 3067) USING ST_Force2D(geom);

ALTER TABLE reititys.digiroad ADD COLUMN source integer;
ALTER TABLE reititys.digiroad ADD COLUMN target integer;

SELECT pgr_createTopology('reititys.digiroad', 0.0001, 'geom', 'id');

CREATE INDEX IF NOT EXISTS digiroad_vertices_pgr_the_geom_idx ON reititys.digiroad("source");
CREATE INDEX IF NOT EXISTS digiroad_vertices_pgr_the_geom_idx ON reititys.digiroad("target");

ALTER TABLE reititys.digiroad ADD COLUMN pituus integer; 

UPDATE reititys.digiroad SET pituus = ST_Length(geom);

CREATE OR REPLACE FUNCTION wrk_dijkstra_digiroad(
    IN source BIGINT,
    IN target BIGINT,
    OUT seq INTEGER,
    OUT gid BIGINT,
    OUT name TEXT,
    OUT cost FLOAT,
    OUT azimuth FLOAT,
    OUT route_readable TEXT,
    OUT route_geom geometry
)
RETURNS SETOF record AS
$BODY$
    WITH
	dijkstra AS (
		SELECT * FROM pgr_dijkstra('SELECT id, pituus AS cost, pituus AS reverse_cost, * FROM reititys.digiroad', $1, $2)
	),
	get_geom AS (
		SELECT dijkstra.*, reititys.digiroad.tienimi_su, reititys.digiroad.pituus,
			CASE
				WHEN dijkstra.node = reititys.digiroad.source THEN geom
				ELSE ST_Reverse(geom)
			END AS route_geom
		FROM dijkstra JOIN reititys.digiroad ON (edge = id)
		ORDER BY seq)
    SELECT
        seq,
        edge,  -- will get the name "gid"
        tienimi_su,
       	cost,
        degrees(ST_azimuth(ST_StartPoint(route_geom), ST_EndPoint(route_geom))) AS azimuth,
        ST_AsText(route_geom),
        route_geom
    FROM get_geom
    ORDER BY seq;
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION wrk_fromAtoB_digiroad(
    IN x1 numeric, IN y1 numeric,
    IN x2 numeric, IN y2 numeric,
    OUT seq INTEGER,
    OUT gid BIGINT,
    OUT name TEXT,
    OUT length INTEGER,
    OUT the_time DOUBLE PRECISION,
    OUT azimuth DOUBLE PRECISION,
    OUT geom geometry
)
RETURNS SETOF record AS
$BODY$
  	DECLARE final_query TEXT;
	BEGIN
      	final_query :=
			FORMAT($$
				WITH
				vertices AS (
					SELECT * FROM reititys.digiroad_vertices_pgr
					WHERE id IN (
						SELECT source FROM reititys.digiroad
						UNION
						SELECT target FROM reititys.digiroad)
				),
				dijkstra AS (
					SELECT *
					FROM wrk_dijkstra_digiroad(
						-- source
						(SELECT id FROM vertices
							ORDER BY the_geom <-> ST_SetSRID(ST_Point(%1$s, %2$s), 3067) LIMIT 1),
						-- target
						(SELECT id FROM vertices
							ORDER BY the_geom <-> ST_SetSRID(ST_Point(%3$s, %4$s), 3067) LIMIT 1))
				)
				SELECT
					seq,
					dijkstra.gid,
					dijkstra.name,
					reititys.digiroad.pituus AS length,
					dijkstra.cost AS the_time,
					azimuth,
					route_geom AS geom
				FROM dijkstra INNER JOIN reititys.digiroad ON dijkstra.gid = reititys.digiroad.id;
			$$,
          	x1, y1, x2, y2);
      RAISE notice '%', final_query;
      RETURN QUERY EXECUTE final_query;
  END;
$BODY$
LANGUAGE 'plpgsql';
