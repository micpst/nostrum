# syntax = docker/dockerfile:1
FROM node:18-bookworm AS base

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn

FROM base AS dev

EXPOSE 3000
ENTRYPOINT ["yarn", "dev"]

FROM base AS build

COPY . .
RUN yarn build

FROM node:18-bookworm AS release

WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
EXPOSE 80
USER node
ENTRYPOINT ["yarn", "start", "-p", "80"]

