FROM --platform=$BUILDPLATFORM node:22.11.0 AS builder
WORKDIR /backend
COPY backend /backend
RUN npm install && \
    npm run build

FROM --platform=$BUILDPLATFORM node:22.11.0-alpine3.20 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci

# install
COPY ui /ui
RUN npm run build

FROM --platform=$BUILDPLATFORM node:22.11.0-alpine3.20
LABEL org.opencontainers.image.title="Angular Docker Extension" \
    org.opencontainers.image.description="Angular based docker extension" \
    org.opencontainers.image.vendor="Sandip Chitale" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots="" \
    com.docker.desktop.extension.icon="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="" \
    com.docker.extension.changelog=""

RUN apk add curl

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
    && chmod +x ./kubectl && mv ./kubectl /usr/local/bin/kubectl \
    && mkdir -p /host/linux \
    && cp /usr/local/bin/kubectl /host/linux/

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl" \
    && mkdir -p /host/darwin \
    && chmod +x ./kubectl && mv ./kubectl /host/darwin/

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/windows/amd64/kubectl.exe" \
    && mkdir -p /host/windows \
    && chmod +x ./kubectl.exe && mv ./kubectl.exe /host/windows/

RUN apk add wget

RUN wget https://get.helm.sh/helm-v3.16.3-linux-amd64.tar.gz && tar -xf helm-v3.16.3-linux-amd64.tar.gz
RUN chmod +x ./linux-amd64/helm
RUN mkdir -p /host/linux
RUN mv ./linux-amd64/helm /host/linux/helm
RUN rm -rf helm-v3.16.3-linux-amd64.tar.gz ./linux-amd64

RUN wget https://get.helm.sh/helm-v3.16.3-darwin-arm64.tar.gz && tar -xf helm-v3.16.3-darwin-arm64.tar.gz
RUN chmod +x ./darwin-arm64/helm
RUN mkdir -p /host/darwin
RUN mv ./darwin-arm64/helm /host/darwin/helm
RUN rm -rf helm-v3.16.3-darwin-arm64.tar.gz ./darwin-arm64

RUN wget https://get.helm.sh/helm-v3.16.3-windows-amd64.zip && unzip helm-v3.16.3-windows-amd64.zip
RUN chmod +x ./windows-amd64/helm.exe
RUN mkdir -p /host/windows
RUN mv ./windows-amd64/helm.exe /host/windows/helm.exe
RUN rm -rf helm-v3.16.3-windows-amd64.zip ./windows-amd64

COPY docker-compose.yaml .
COPY metadata.json .
COPY kubernetes-dashboard.svg .
COPY --from=client-builder /ui/dist/angular-tailwindcss/browser ui

COPY --from=builder /backend /backend
EXPOSE 3000

CMD ["node", "/backend/dist/index.js"]
