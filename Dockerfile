FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json ./
RUN bun install

FROM base AS runtime
COPY --from=install /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]

