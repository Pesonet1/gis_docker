<?php
// Paths
@define('CONST_Postgresql_Version', '12');
@define('CONST_Postgis_Version', '3');
// Website settings
@define('CONST_Website_BaseURL', '/');
@define('CONST_Replication_Url', 'http://download.geofabrik.de/europe/finland-updates');
@define('CONST_Replication_MaxInterval', '86400');     // Process each update separately, osmosis cannot merge multiple updates
@define('CONST_Replication_Update_Interval', '86400');  // How often upstream publishes diffs
@define('CONST_Replication_Recheck_Interval', '900');   // How long to sleep if no update found yet
@define('CONST_Pyosmium_Binary', '/usr/local/bin/pyosmium-get-changes');
@define('CONST_Database_DSN', 'pgsql:host=' . getenv("POSTGRES_HOST") . ',;port=' . getenv("POSTGRES_PORT") . ';user=' . getenv("POSTGRES_USERNAME") . ';password=' . getenv("POSTGRES_PASSWORD") . ';dbname=nominatim');
