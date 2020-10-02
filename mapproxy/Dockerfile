# Don't update to newer version of python -> after python 3.8 cqi.parse_qs is removed
FROM python:3.7-slim-buster

RUN apt-get update && apt-get install --no-install-recommends -y \
    python-yaml \
    libgeos-dev \
    python-lxml \
    libgdal-dev \
    build-essential \
    python-dev \
    libjpeg-dev \
    zlib1g-dev \
    libfreetype6-dev \
    python-virtualenv \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip \
    Shapely \
    Pillow \
    MapProxy \
    uwsgi

EXPOSE 8083

ADD app.py /app.py
ADD uwsgi.conf /uwsgi.conf
ADD start.sh /start.sh
ADD log.ini /log.ini

RUN chmod 0755 /start.sh

CMD /start.sh
