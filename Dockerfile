
FROM node:latest AS base
WORKDIR /app

# Corepack aktivieren und pnpm auf gewünschte Version setzen (optional)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Nur package.json und pnpm-lock kopieren für Cache
COPY package.json pnpm-lock.yaml ./

# Install nur dependencies (inkl. dev für Build/Dev)
RUN pnpm install --frozen-lockfile

# Quellcode erst jetzt (Cache optimal)
COPY . .

# ----------- Development -----------
FROM base AS dev
ENV NODE_ENV=development
CMD ["pnpm", "dev"]

# ----------- Build -----------
FROM base AS builder
ENV NODE_ENV=production
RUN pnpm run build

# ----------- Production -----------
FROM node:latest AS prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/build ./build
COPY ./prisma ./prisma
COPY ./assets ./assets
COPY .env.vault ./

RUN mkdir -p /app/certs
VOLUME /app/certs

EXPOSE 4000
ENV NODE_ENV=production
CMD ["pnpm", "start"]
