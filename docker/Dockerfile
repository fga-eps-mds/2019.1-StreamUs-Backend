FROM arangodb/arangodb:3.3.22 AS arangodb
MAINTAINER Ygor Galeno <ygor.tgaleno@gmail.com>
COPY scripts/setup.js /docker-entrypoint-initdb.d 

FROM node:8-jessie AS node
MAINTAINER Ygor Galeno <ygor.tgaleno@gmail.com>
RUN apt update -y
WORKDIR /var/app/StreamUs
COPY ./src/package.json ./
COPY ./src ./
RUN npm install
