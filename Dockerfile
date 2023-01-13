# Test, Dev. and Prod. Dockerfile for the exprees-sequelize-ts app.

# Test, Dev.
FROM node:18.12.0-slim as base
LABEL maintainer="yoooong2@gmail.com"
LABEL build_date="2023-01-13"

RUN mkdir -p /data/app && \
    chown -R node:node /data/app

WORKDIR /data/app

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

# Prod.
FROM base as production

RUN yarn build
