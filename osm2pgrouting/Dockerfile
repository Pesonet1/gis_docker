FROM debian:jessie

ARG OSM_FILENAME
ENV OSM_FILENAME_VARIABLE=$OSM_FILENAME

RUN apt-get update

# Install necessary packages e.g. psql client, osmconvert

RUN apt-get install -y \
    git \
    pkg-config \
    build-essential \
    postgresql-client \
    osmctools

# osm2pgrouting requirements

RUN apt-get install -y \
  cmake \
  expat \
  libexpat1-dev \
  libboost-dev \
  libboost-program-options-dev \
  libpqxx-dev

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

ENV OSM_2_PGROUTING_VERSION=2.3.6
RUN git clone https://github.com/pgRouting/osm2pgrouting.git
RUN cd osm2pgrouting && \
    git fetch --all && git checkout v${OSM_2_PGROUTING_VERSION} && \
    cmake -H. -Bbuild && \
    cd build/ && make && make install

# Copy necessary files into container

COPY ./ /
COPY ./pgrouting.sh /usr/local/bin/

# Run pgrouting script that runs osm2pgrouting

ENTRYPOINT ["pgrouting.sh"]
