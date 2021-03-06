ALTER TABLE routing_digiroad.digiroad ALTER COLUMN geom TYPE geometry(LineString, 3067) USING ST_Force2D(geom);

ALTER TABLE routing_digiroad.digiroad ADD COLUMN source INTEGER;
ALTER TABLE routing_digiroad.digiroad ADD COLUMN target INTEGER;
ALTER TABLE routing_digiroad.digiroad ADD COLUMN oneway TEXT;
ALTER TABLE routing_digiroad.digiroad ADD COLUMN cost DOUBLE PRECISION;
ALTER TABLE routing_digiroad.digiroad ADD COLUMN reverse_cost DOUBLE PRECISION;
ALTER TABLE routing_digiroad.digiroad ADD COLUMN length_m INTEGER; 
ALTER TABLE routing_digiroad.digiroad ADD COLUMN speed_limit INTEGER;

SELECT pgr_createTopology('routing_digiroad.digiroad', 0.0001, 'geom', 'id');
SELECT pgr_analyzeGraph('routing_digiroad.digiroad', 0.0001, 'geom', 'id');

CREATE INDEX IF NOT EXISTS digiroad_id_idx ON routing_digiroad.digiroad("id");
CREATE INDEX IF NOT EXISTS digiroad_source_idx ON routing_digiroad.digiroad("source");
CREATE INDEX IF NOT EXISTS digiroad_target_idx ON routing_digiroad.digiroad("target");
CREATE INDEX IF NOT EXISTS digiroad_geom_idx ON routing_digiroad.digiroad USING GIST ("geom");
CREATE INDEX IF NOT EXISTS digiroad_vertices_pgr_id_idx ON routing_digiroad.digiroad_vertices_pgr("id");
CREATE INDEX IF NOT EXISTS digiroad_vertices_pgr_geom_idx ON routing_digiroad.digiroad_vertices_pgr USING GIST ("the_geom");

-- Get speed_limit value from nopeusrajoitus table

UPDATE routing_digiroad.digiroad SET speed_limit = arvo
	FROM routing_digiroad.digiroad_nopeusrajoitus
	WHERE routing_digiroad.digiroad.link_id = routing_digiroad.digiroad_nopeusrajoitus.link_id;

-- Set length_m column value based on linestring length

UPDATE routing_digiroad.digiroad SET length_m = ST_Length(geom);

-- Set oneway column based on ajosuunta column in digiroad data

-- Liikenne on sallittua molempiin suuntiin 2
-- Liikenne on sallittu digitointisuuntaa vastaan 3
-- Liikenne on sallittu digitointisuuntaan 4

-- FT - oneway from the source to the target node.
-- TF - oneway from the target to the source node.
-- B - two way street.
-- NULL - empty field, assume twoway.

UPDATE routing_digiroad.digiroad SET oneway = CASE
	WHEN ajosuunta = 2 THEN 'B'
    WHEN ajosuunta = 3 THEN 'TF'
    WHEN ajosuunta = 4 THEN 'FT'
	ELSE NULL
END;

-- Set pgr table in and out edge values based on oneway column values

SELECT pgr_analyzeOneway('routing_digiroad.digiroad',
	ARRAY['', 'B', 'TF'],
	ARRAY['', 'B', 'FT'],
	ARRAY['', 'B', 'FT'],
	ARRAY['', 'B', 'TF'],
	oneway := 'oneway',
	two_way_if_null := true
);

-- Set cost in seconds

UPDATE routing_digiroad.digiroad SET cost = CASE
    WHEN oneway = 'TF' THEN 10000
    ELSE CASE
		WHEN speed_limit IS NOT NULL THEN length_m / (speed_limit / 3.6)
		ELSE length_m
	END
END;

UPDATE routing_digiroad.digiroad SET reverse_cost = CASE
	WHEN oneway = 'FT' THEN 10000
	ELSE CASE
		WHEN speed_limit IS NOT NULL THEN length_m / (speed_limit / 3.6)
		ELSE length_m
	END
END;

-- Routing functions

CREATE OR REPLACE FUNCTION wrk_dijkstra_digiroad(
	IN source BIGINT,
	IN target BIGINT,
	OUT seq INTEGER,
	OUT gid BIGINT,
	OUT cost FLOAT,
	OUT route_geom geometry
)
RETURNS SETOF record AS
$BODY$
	WITH
	dijkstra AS (
		SELECT *
		FROM pgr_dijkstra(
			'SELECT id, source, target, cost, reverse_cost FROM routing_digiroad.digiroad WHERE toiminn_lk NOT IN (6,7,8)',
			$1,
			$2,
			directed := 'true')
	),
	get_geom AS (
		SELECT dijkstra.*,
			CASE
				WHEN dijkstra.node = routing_digiroad.digiroad.source THEN geom
				ELSE ST_Reverse(geom)
			END AS route_geom
		FROM dijkstra JOIN routing_digiroad.digiroad ON (edge = id)
		ORDER BY seq
	)
	SELECT
		seq,
		edge as gid,
		cost,
		route_geom
	FROM get_geom
	ORDER BY seq;
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION wrk_ksp_digiroad(
	IN source BIGINT,
	IN target BIGINT,
	OUT seq INTEGER,
	OUT gid BIGINT,
	OUT path_id INTEGER,
	OUT cost FLOAT,
	OUT route_geom geometry
)
RETURNS SETOF record AS
$BODY$
	WITH
	ksp AS (
		SELECT *
		FROM pgr_ksp(
				'SELECT id, source, target, cost, reverse_cost FROM routing_digiroad.digiroad WHERE toiminn_lk NOT IN (6,7,8)',
				$1,
				$2,
				3,
				directed := 'true',
				heap_paths := 'false')
	),
	get_geom AS (
		SELECT ksp.*,
			CASE
				WHEN ksp.node = routing_digiroad.digiroad.source THEN geom
				ELSE ST_Reverse(geom)
			END AS route_geom
		FROM ksp JOIN routing_digiroad.digiroad ON (edge = id)
		ORDER BY seq
	)
	SELECT
		seq,
		edge as gid,
        path_id,
		cost,
		route_geom
	FROM get_geom
	ORDER BY seq;
$BODY$
LANGUAGE 'sql';

-- Geoserver functions

CREATE OR REPLACE FUNCTION wrk_dijkstra_fromAtoB_digiroad(
	IN x1 numeric, IN y1 numeric,
	IN x2 numeric, IN y2 numeric,
	OUT seq INTEGER,
	OUT gid BIGINT,
	OUT length INTEGER,
	OUT cost DOUBLE PRECISION,
	OUT geom geometry
)
RETURNS SETOF record AS
$BODY$
	DECLARE final_query TEXT;
	BEGIN
		final_query :=
			FORMAT($$
				WITH
				dijkstra AS (
					SELECT *
					FROM wrk_dijkstra_digiroad(
						-- source
						(
							SELECT nodes.id
							FROM routing_digiroad.digiroad_vertices_pgr AS nodes
							INNER JOIN routing_digiroad.digiroad AS edges ON (edges.source = nodes.id)
							WHERE edges.toiminn_lk NOT IN (6,7,8)
							ORDER BY nodes.the_geom <-> ST_SetSRID(ST_Point(%1$s, %2$s), 3067)
							LIMIT 1
						),
						-- target
						(
							SELECT nodes.id
							FROM routing_digiroad.digiroad_vertices_pgr AS nodes
							INNER JOIN routing_digiroad.digiroad AS edges ON (edges.target = nodes.id)
							WHERE edges.toiminn_lk NOT IN (6,7,8)
							ORDER BY nodes.the_geom <-> ST_SetSRID(ST_Point(%3$s, %4$s), 3067)
							LIMIT 1
						)
					)
				)
				SELECT
					seq,
					dijkstra.gid,
					routing_digiroad.digiroad.length_m AS length,
					dijkstra.cost,
					route_geom AS geom
				FROM dijkstra INNER JOIN routing_digiroad.digiroad ON dijkstra.gid = routing_digiroad.digiroad.id;
			$$, x1, y1, x2, y2);
		RAISE notice '%', final_query;
		RETURN QUERY
        EXECUTE final_query;
    END;
$BODY$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION wrk_ksp_fromAtoB_digiroad(
	IN x1 numeric, IN y1 numeric,
	IN x2 numeric, IN y2 numeric,
	OUT seq INTEGER,
	OUT gid BIGINT,
	OUT path_id INTEGER,
	OUT cost DOUBLE PRECISION,
	OUT geom geometry
)
RETURNS SETOF record AS
$BODY$
	DECLARE final_query TEXT;
	BEGIN
		final_query :=
			FORMAT($$
				SELECT seq, gid, path_id, cost, route_geom AS geom
				FROM wrk_ksp_digiroad(
					-- source
					(
						SELECT nodes.id
						FROM routing_digiroad.digiroad_vertices_pgr AS nodes
						INNER JOIN routing_digiroad.digiroad AS edges ON (edges.source = nodes.id)
						WHERE edges.toiminn_lk NOT IN (6,7,8)
						ORDER BY nodes.the_geom <-> ST_SetSRID(ST_Point(%1$s, %2$s), 3067)
						LIMIT 1
					),
					-- target
					(
						SELECT nodes.id
						FROM routing_digiroad.digiroad_vertices_pgr AS nodes
						INNER JOIN routing_digiroad.digiroad AS edges ON (edges.target = nodes.id)
						WHERE edges.toiminn_lk NOT IN (6,7,8)
						ORDER BY nodes.the_geom <-> ST_SetSRID(ST_Point(%3$s, %4$s), 3067)
						LIMIT 1
					)
				)
			$$, x1, y1, x2, y2);
		RAISE notice '%', final_query;
		RETURN QUERY
        EXECUTE final_query;
    END;
$BODY$
LANGUAGE 'plpgsql';
