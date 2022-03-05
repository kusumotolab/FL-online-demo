FROM node:17-buster-slim AS base

FROM base AS dev

FROM base AS build
WORKDIR /build
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:17-buster-slim AS production
ENV NODE_ENV=production
WORKDIR /frontend
COPY --from=build /build/package.json /build/package-lock.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
RUN npm ci next

EXPOSE 3000
CMD ["npm", "start"]
