CREATE OR REPLACE VIEW vehicle_net AS
SELECT gid,
  source,
  target,
  -- converting to minutes
  cost_s / 60 AS cost,
  reverse_cost_s / 60 AS reverse_cost,
  the_geom
FROM routing_osm.ways JOIN routing_osm.configuration AS c USING (tag_id)
WHERE c.tag_value NOT IN (
  'steps',
  'footway',
  'path',
  'residental',
  'cycleway',
  'bridleway',
  'pedestrian',
  'living_street'
) AND c.tag_key NOT IN ('cycleway');
