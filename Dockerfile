FROM baseimage

RUN apt-get update && apt-get install -y \
    sudo \
    libcairo2-dev \
    libjpeg8-dev \
    libpango1.0-dev \
    libgif-dev \
    build-essential  \
    g++
