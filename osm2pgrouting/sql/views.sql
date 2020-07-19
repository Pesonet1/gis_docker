CREATE VIEW vehicle_net AS
    SELECT gid,
        source,
        target,
        -- converting to minutes
        cost_s / 60 AS cost,
        reverse_cost_s / 60 AS reverse_cost,
        the_geom
    FROM ways JOIN configuration AS c
    USING (tag_id)
    WHERE c.tag_value NOT IN ('steps','footway','path');
