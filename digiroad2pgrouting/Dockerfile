FROM ubuntu:bionic

RUN apt-get update && apt-get install --no-install-recommends -y \
  software-properties-common \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN add-apt-repository ppa:ubuntugis/ubuntugis-unstable
RUN add-apt-repository ppa:deadsnakes/ppa

RUN apt-get update && apt-get install --no-install-recommends -y \
  python3.6-dev \
  postgresql-client \
  gdal-bin \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN ogrinfo --version

COPY ./ /
COPY ./digiroad.sh /usr/local/bin/

ENTRYPOINT ["digiroad.sh"]
