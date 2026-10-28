# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS web
WORKDIR /src
RUN npm install -g pnpm@12.4.2
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json ./web/
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY web ./web
RUN pnpm build:web

FROM golang:1.27-alpine AS build
ARG VERSION=dev
ARG COMMIT=none
ARG BUILD_DATE=unknown
WORKDIR /src
RUN apk add --no-cache git ca-certificates
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=web /src/internal/web/dist ./internal/web/dist
RUN mkdir -p /out && \
    CGO_ENABLED=0 go build -trimpath \
      -ldflags "-s -w -X myprintables/internal/cli.version=${VERSION} -X myprintables/internal/cli.commit=${COMMIT} -X myprintables/internal/cli.buildDate=${BUILD_DATE}" \
      -o /out/myprintables ./cmd/myprintables

FROM alpine:3.22
RUN apk add --no-cache ca-certificates tzdata && \
    addgroup -S -g 10001 myprintables && \
    adduser -S -D -H -u 10001 -G myprintables myprintables
WORKDIR /app
COPY --from=build /out/myprintables /usr/local/bin/myprintables
RUN mkdir -p /data && chown -R myprintables:myprintables /data
ENV DATA_DIR=/data \
    PORT=8200 \
    APP_URL=http://localhost:8200
USER myprintables:myprintables
VOLUME ["/data"]
EXPOSE 8200
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8200/healthz >/dev/null || exit 1
STOPSIGNAL SIGTERM
ENTRYPOINT ["/usr/local/bin/myprintables"]
CMD ["serve"]
