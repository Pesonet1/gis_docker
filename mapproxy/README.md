# Mapproxy

Mapproxy is used for serving base map for client app. It loads, seeds & proxies a background map from kartat.kapsi tiles.

By default mapproxy seeding process is not run. It needs to be run manually with following command inside container.

```
$ su $USER_NAME -c "mapproxy-seed -f mapproxy.yaml -s seed.yaml --progress-file .mapproxy_seed_progress"
```

This will take several hours to complete. After this background layer should be available on client app.
