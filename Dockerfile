FROM node:8-jessie
RUN apt update -y
WORKDIR /var/app/StreamUs
COPY ./src/package.json ./
RUN npm install
COPY ./src ./