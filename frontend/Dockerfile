FROM node:25-alpine3.23
WORKDIR /app
RUN apk add iproute2-ss=6.17.0-r0 --no-cache && rm -rf /var/cache/apk/*
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
env
npm run build -- --experimental-build-mode generate
npm start
EOT

COPY package*.json ./
RUN npm install
COPY . ./
ARG NEXT_PUBLIC_API_URL=https://ids-help.by/api/v1
RUN npm run build -- --experimental-build-mode compile

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
