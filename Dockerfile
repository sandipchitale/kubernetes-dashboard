FROM node:21.6 AS builder
WORKDIR /backend
COPY backend /backend
RUN npm install && \
    npm run build

FROM --platform=$BUILDPLATFORM node:21.6-alpine3.18 AS client-builder
WORKDIR /ui
COPY ui /ui

FROM node:21.6-alpine3.18
LABEL org.opencontainers.image.title="Kubernetes Dashboard" \
    org.opencontainers.image.description="Easily deploy and run Kubernetes Dashboard in Docker Desktop" \
    org.opencontainers.image.vendor="sandipchitale" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots="" \
    com.docker.desktop.extension.icon="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="" \
    com.docker.extension.changelog=""

COPY docker-compose.yaml .
COPY metadata.json .
COPY kubernetes-dashboard.svg .
COPY --from=builder /backend /backend
COPY --from=client-builder /ui /ui
EXPOSE 3000
CMD ["node", "/backend/dist/index.js"]
