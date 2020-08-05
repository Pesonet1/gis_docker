ALTER TABLE reititys.digiroad ALTER COLUMN geom TYPE geometry(LineString, 3067) USING ST_Force2D(geom);

ALTER TABLE reititys.digiroad ADD COLUMN source INTEGER;
ALTER TABLE reititys.digiroad ADD COLUMN target INTEGER;
ALTER TABLE reititys.digiroad ADD COLUMN oneway TEXT;
ALTER TABLE reititys.digiroad ADD COLUMN cost DOUBLE PRECISION;
ALTER TABLE reititys.digiroad ADD COLUMN reverse_cost DOUBLE PRECISION;
ALTER TABLE reititys.digiroad ADD COLUMN length_m INTEGER; 
ALTER TABLE reititys.digiroad ADD COLUMN speed_limit INTEGER;

SELECT pgr_createTopology('reititys.digiroad', 0.0001, 'geom', 'id');
SELECT pgr_analyzeGraph('reititys.digiroad', 0.00001, 'geom', 'id');
SELECT pgr_analyzeOneway('reititys.digiroad',
	ARRAY['', 'B', 'TF'],
	ARRAY['', 'B', 'FT'],
	ARRAY['', 'B', 'FT'],
	ARRAY['', 'B', 'TF'],
	oneway := 'oneway',
	two_way_if_null := true
);

CREATE INDEX IF NOT EXISTS digiroad_vertices_pgr_the_geom_idx ON reititys.digiroad("source");
CREATE INDEX IF NOT EXISTS digiroad_vertices_pgr_the_geom_idx ON reititys.digiroad("target");

UPDATE reititys.digiroad SET speed_limit = arvo
    FROM reititys.digiroad_nopeusrajoitus
    WHERE reititys.digiroad.link_id = reititys.digiroad_nopeusrajoitus.link_id;

UPDATE reititys.digiroad SET length_m = ST_Length(geom);

-- ajosuunta
-- Liikenne on sallittua molempiin suuntiin 2
-- Liikenne on sallittu digitointisuuntaa vastaan 3
-- Liikenne on sallittu digitointisuuntaan 4

-- geom_flip
-- Digitointisuunta säilynyt samana 0
-- Digitointisuunta vaihtunut 1

-- FT - oneway from the source to the target node.
-- TF - oneway from the target to the source node.
-- B - two way street.
-- NULL - empty field, assume twoway.

UPDATE reititys.digiroad SET oneway = CASE
	WHEN ajosuunta = 2 THEN 'B'
    WHEN ajosuunta = 3 AND geom_flip = 1 THEN 'FT'
	WHEN ajosuunta = 3 AND geom_flip = 0 THEN 'TF'
    WHEN ajosuunta = 4 AND geom_flip = 1 THEN 'TF'
    WHEN ajosuunta = 4 AND geom_flip = 0 THEN 'FT'
	ELSE NULL
END;

UPDATE reititys.digiroad SET cost = CASE
    WHEN oneway = 'TF' THEN 10000
    ELSE length_m -- speed_limit IS NOT NULL THEN length_m / (speed_limit / 3.6) -- length_m;
END;

UPDATE reititys.digiroad SET reverse_cost = CASE
	WHEN oneway = 'FT' THEN 10000
	ELSE length_m
END;

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
		SELECT * FROM pgr_dijkstra('SELECT id, source, target, cost, reverse_cost, tienimi_su FROM reititys.digiroad WHERE toiminn_lk NOT IN (6,7,8)', $1, $2, directed := 'true')
	),
	get_geom AS (
		SELECT dijkstra.*, reititys.digiroad.tienimi_su,
			CASE
				WHEN dijkstra.node = reititys.digiroad.source THEN geom
				ELSE ST_Reverse(geom)
			END AS route_geom
		FROM dijkstra JOIN reititys.digiroad ON (edge = id)
		ORDER BY seq
	)
	SELECT
		seq,
		edge as gid,
		tienimi_su AS name,
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
					reititys.digiroad.length_m AS length,
					dijkstra.cost AS the_time,
					azimuth,
					route_geom AS geom
				FROM dijkstra INNER JOIN reititys.digiroad ON dijkstra.gid = reititys.digiroad.id;
			$$, x1, y1, x2, y2);
		RAISE notice '%', final_query;
		RETURN QUERY EXECUTE final_query;
  END;
$BODY$
LANGUAGE 'plpgsql';