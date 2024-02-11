# syntax = docker/dockerfile:1
FROM node:18-bookworm AS build

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

FROM nginx:1.25-bookworm AS release

WORKDIR /app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/out /usr/share/nginx/html
