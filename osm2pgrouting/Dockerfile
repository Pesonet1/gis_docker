FROM ubuntu:bionic

ARG OSM_FILENAME

ENV OSM_FILENAME_VARIABLE=$OSM_FILENAME
ENV OSM_2_PGROUTING_VERSION=2.3.6

# Install necessary packages e.g. psql client, osmconvert

RUN apt-get update && apt-get install --no-install-recommends -y \
    git \
    ca-certificates \
    pkg-config \
    build-essential \
    postgresql-client \
    osmctools \
    # osm2pgrouting requirements
    cmake \
    expat \
    libexpat1-dev \
    libboost-dev \
    libboost-program-options-dev \
    libpqxx-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

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
