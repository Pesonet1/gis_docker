SELECT ST_MakeLine(route.geom) FROM (
    SELECT geom FROM wrk_fromAtoB('vehicle_net', 385823.05, 6671394.36, 387362.01, 6675332.38
  ) ORDER BY seq) AS route
