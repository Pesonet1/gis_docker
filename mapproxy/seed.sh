#!/bin/bash

USER_NAME=`ls -lah / | grep mapproxy | awk '{print $3}'`

cd /mapproxy

echo "Starting seeding process. This will take a long time..."

su $USER_NAME -c "mapproxy-seed -f mapproxy.yaml -s seed.yaml --progress-file .mapproxy_seed_progress"
