FROM node:22-alpine AS build

WORKDIR /app

COPY apps/frontend/package*.json ./

RUN npm ci

COPY apps/frontend/ ./

ARG API_URL=/api
ARG BACKEND_URL=http://backend

ENV API_URL=${API_URL}
ENV BACKEND_URL=${BACKEND_URL}

RUN npm run generate

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
