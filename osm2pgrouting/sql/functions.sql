
CREATE OR REPLACE FUNCTION wrk_dijkstra_osm(
    IN edges_subset regclass,
    IN source BIGINT,
    IN target BIGINT,
    OUT seq INTEGER,
    OUT gid BIGINT,
    OUT name TEXT,
    OUT cost FLOAT,
    OUT route_geom geometry
)
RETURNS SETOF record AS
$BODY$
    WITH
    dijkstra AS (
        SELECT *
        FROM pgr_dijkstra(
            'SELECT gid AS id, target, source, cost, reverse_cost FROM ' || $1,
            (SELECT id FROM ways_vertices_pgr WHERE osm_id = $2),
            (SELECT id FROM ways_vertices_pgr WHERE osm_id = $3))
    ),
    get_geom AS (
        SELECT dijkstra.*, ways.name,
            CASE
                WHEN dijkstra.node = ways.source THEN the_geom
                ELSE ST_Reverse(the_geom)
            END AS route_geom
        FROM dijkstra JOIN ways ON (edge = gid)
        ORDER BY seq
    )
    SELECT
        seq,
        edge, -- will get the name "gid"
        name,
        cost,
        route_geom
    FROM get_geom
    ORDER BY seq;
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION wrk_ksp_osm(
    IN edges_subset regclass,
    IN source BIGINT,
    IN target BIGINT,
    OUT seq INTEGER,
    OUT gid BIGINT,
    OUT name TEXT,
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
            'SELECT gid AS id, target, source, cost, reverse_cost FROM ' || $1,
            (SELECT id FROM ways_vertices_pgr WHERE osm_id = $2),
            (SELECT id FROM ways_vertices_pgr WHERE osm_id = $3),
            3,
            directed := 'true',
            heap_paths := 'false')
	),
	get_geom AS (
		SELECT ksp.*, ways.name,
            CASE
                WHEN ksp.node = ways.source THEN the_geom
                ELSE ST_Reverse(the_geom)
            END AS route_geom
        FROM ksp JOIN ways ON (edge = gid)
        ORDER BY seq
	)
	SELECT
        seq,
        edge,
        name,
        path_id,
        cost,
        route_geom
    FROM get_geom
    ORDER BY seq;
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION wrk_dijkstra_fromAtoB_osm(
    IN edges_subset regclass,
    IN x1 numeric, IN y1 numeric,
    IN x2 numeric, IN y2 numeric,
    OUT seq INTEGER,
    OUT gid BIGINT,
    OUT name TEXT,
    OUT length FLOAT,
    OUT cost FLOAT,
    OUT geom geometry
)
RETURNS SETOF record AS
$BODY$
DECLARE
    final_query TEXT;
BEGIN
    final_query :=
        FORMAT($$
            WITH
            vertices AS (
                SELECT *
                FROM ways_vertices_pgr
                WHERE id IN (
                    SELECT source FROM %1$I
                    UNION
                    SELECT target FROM %1$I)
            ),
            dijkstra AS (
                SELECT *
                FROM wrk_dijkstra_osm(
                    '%1$I',
                    -- source
                    (
                        SELECT osm_id
                        FROM vertices
                        ORDER BY the_geom <-> ST_SetSRID(ST_Point(%2$s, %3$s), 3067)
                        LIMIT 1
                    ),
                    -- target
                    (
                        SELECT osm_id
                        FROM vertices
                        ORDER BY the_geom <-> ST_SetSRID(ST_Point(%4$s, %5$s), 3067)
                        LIMIT 1
                    )
                )
            )
            SELECT
                seq,
                dijkstra.gid,
                dijkstra.name,
                ways.length_m / 1000.0 AS length,
                dijkstra.cost,
                route_geom AS geom
            FROM dijkstra JOIN ways USING (gid);
        $$,
        edges_subset, x1, y1, x2, y2);
    RAISE notice '%', final_query;
    RETURN QUERY EXECUTE final_query;
END;
$BODY$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION wrk_ksp_fromAtoB_osm(
    IN edges_subset regclass,
    IN x1 numeric, IN y1 numeric,
    IN x2 numeric, IN y2 numeric,
    OUT seq INTEGER,
    OUT gid BIGINT,
    OUT name TEXT,
    OUT path_id INTEGER,
    OUT length FLOAT,
    OUT cost FLOAT,
    OUT geom geometry
)
RETURNS SETOF record AS
$BODY$
DECLARE
    final_query TEXT;
BEGIN
    final_query :=
        FORMAT($$
            WITH
            vertices AS (
                SELECT *
                FROM ways_vertices_pgr
                WHERE id IN (
                    SELECT source FROM %1$I
                    UNION
                    SELECT target FROM %1$I)
            ),
            ksp AS (
                SELECT *
                FROM wrk_ksp_osm(
                    '%1$I',
                    -- source
                    (
                        SELECT osm_id
                        FROM vertices
                        ORDER BY the_geom <-> ST_SetSRID(ST_Point(%2$s, %3$s), 3067)
                        LIMIT 1
                    ),
                    -- target
                    (
                        SELECT osm_id
                        FROM vertices
                        ORDER BY the_geom <-> ST_SetSRID(ST_Point(%4$s, %5$s), 3067)
                        LIMIT 1
                    )
                )
            )
            SELECT
                seq,
                ksp.gid,
                ksp.name,
                ksp.path_id,
                ways.length_m / 1000.0 AS length,
                ksp.cost,
                route_geom AS geom
            FROM ksp JOIN ways USING (gid);
        $$,
        edges_subset, x1, y1, x2, y2);
    RAISE notice '%', final_query;
    RETURN QUERY EXECUTE final_query;
END;
$BODY$
LANGUAGE 'plpgsql';
