# Change to alpine for smaller size
FROM python:3.7

RUN apt-get -y update

RUN apt-get install -y \
    python-yaml \
    libgeos-dev \
    python-lxml \
    libgdal-dev \
    build-essential \
    python-dev \
    libjpeg-dev \
    zlib1g-dev \
    libfreetype6-dev \
    python-virtualenv

RUN pip install --upgrade pip

RUN pip install Shapely Pillow MapProxy uwsgi

EXPOSE 8083

ADD uwsgi.conf /uwsgi.conf
ADD start.sh /start.sh
ADD seed.sh /seed.sh

RUN chmod 0755 /seed.sh
RUN chmod 0755 /start.sh

CMD /start.sh
