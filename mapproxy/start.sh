#!/bin/bash

echo "Creating default mapproxy.yaml if not provided"

if [ ! -f /mapproxy/mapproxy.yaml ]
then
  mapproxy-util create -t base-config mapproxy
fi

echo "Creating default app.py if not provided"

if [ ! -f /mapproxy/app.py ]
then
  mapproxy-util create -t wsgi-app -f /mapproxy/mapproxy.yaml /mapproxy/app.py
fi

echo "Creating default log.ini if not provided"

if [ ! -f /mapproxy/log.ini ]
then
  mapproxy-util create -t log-ini /mapproxy/log.ini
fi

uwsgi --ini /uwsgi.conf
# mapproxy-util serve-develop -b 0.0.0.0:8083 /mapproxy/mapproxy.yaml
