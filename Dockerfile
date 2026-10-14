# syntax=docker/dockerfile:1

# ---- build stage: install all deps, generate Prisma client, compile ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# ---- runtime stage: only prod deps + compiled output ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# RDS CA bundle for sslmode=verify-full (DB_SSL_ROOT_CERT=/certs/rds-global-bundle.pem)
ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /certs/rds-global-bundle.pem
RUN chmod 755 /certs && chmod 644 /certs/rds-global-bundle.pem

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/main"]