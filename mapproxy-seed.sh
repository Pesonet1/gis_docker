#!/bin/bash

echo "Starting Mapproxy"

docker-compose -f docker-compose.dev.yaml up -d mapproxy

echo "Starting seeding process. This will take a long time..."

winpty docker-compose -f docker-compose.dev.yaml exec mapproxy mapproxy-seed -f mapproxy/mapproxy.yaml -s mapproxy/seed.yaml --progress-file mapproxy_seed_progress.log

read
