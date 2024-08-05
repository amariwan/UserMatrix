# syntax=docker/dockerfile:1
FROM node:18 AS base
ENV NODE_ENV=development
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . .

FROM base AS dev
CMD yarn dev

FROM base AS builder
RUN yarn build

FROM node:18 AS prod
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir /app/certs
VOLUME /app/certs
COPY package.json ./
RUN yarn
COPY --from=builder /app/build ./build
COPY ./prisma ./prisma
COPY ./assets ./assets
COPY .env.vault ./
EXPOSE 4000
CMD yarn start
