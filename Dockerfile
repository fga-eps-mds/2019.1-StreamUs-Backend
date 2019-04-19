FROM arangodb/arangodb:3.3.22 AS arangodb
MAINTAINER Ygor Galeno <ygor.tgaleno@gmail.com>
COPY ./entrypoints/setup.js /docker-entrypoint-initdb.d 

FROM node:8-jessie AS node
MAINTAINER Ygor Galeno <ygor.tgaleno@gmail.com>
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
RUN apt update -y
WORKDIR /var/app/StreamUs
COPY ./src/package.json ./
COPY ./src ./
RUN npm install
