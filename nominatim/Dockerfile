FROM ubuntu:focal

ARG NOMINATIM_USERNAME
ARG NOMINATIM_PASSWORD

ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8
ENV NOMINATIM_VERSION v3.5.1

RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    cmake \
    g++ \
    libboost-dev \
    libboost-system-dev \
    libboost-filesystem-dev \
    libexpat1-dev \
    zlib1g-dev \
    libbz2-dev \
    libpq-dev \
    libproj-dev \
    postgresql-server-dev-12 \
    postgresql-12-postgis-3 \
    postgresql-contrib \
    postgresql-12-postgis-3-scripts \
    apache2 \
    apache2-utils \
    php \
    php-pgsql \
    libapache2-mod-php \
    php-intl \
    python3-setuptools \
    python3-dev \
    python3-pip \
    python3-psycopg2 \
    python3-tidylib \
    git \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/* /var/tmp/*

WORKDIR /app

# Osmium install to run continuous updates
RUN pip3 install osmium

# Nominatim & osm2pgsql install
RUN git clone --recursive https://github.com/openstreetmap/Nominatim ./src
RUN cd ./src && git checkout tags/$NOMINATIM_VERSION && git submodule update --recursive --init && \
    mkdir build && cd build && cmake .. && make -j`nproc`

# Apache configure
COPY local.php /app/src/build/settings/local.php
COPY apache.conf /etc/apache2/sites-enabled/000-default.conf

# Set apache to run different port than default 80
RUN sed -i '/Listen 80/c\Listen 8000' /etc/apache2/ports.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Load country osm data for dashboard view
RUN if [ "$TYPE" = "setup" ]; then \
    curl http://www.nominatim.org/data/country_grid.sql.gz > /app/src/data/country_osm_grid.sql.gz \
else \
    echo "Running nominatim. No need to download country OSM data" \
fi

RUN chmod o=rwx /app/src/build

RUN htpasswd -b -c /etc/apache2/.htpasswd "${NOMINATIM_USERNAME}" "${NOMINATIM_PASSWORD}"

EXPOSE 8100

COPY . .
