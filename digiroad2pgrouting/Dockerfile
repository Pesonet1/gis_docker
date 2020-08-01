FROM ubuntu:focal

RUN apt-get update

RUN apt-get install -y software-properties-common

RUN apt-get update

RUN add-apt-repository ppa:ubuntugis/ubuntugis-unstable
RUN add-apt-repository ppa:deadsnakes/ppa

RUN apt-get update

RUN apt-get install -y \
  python3.6-dev \
  postgresql-client \
  gdal-bin

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN ogrinfo --version

COPY ./ /
COPY ./digiroad.sh /usr/local/bin/

ENTRYPOINT ["digiroad.sh"]
