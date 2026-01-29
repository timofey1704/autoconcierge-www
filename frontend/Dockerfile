FROM node:25-alpine3.23
WORKDIR /app
RUN apk add iproute2-ss=6.17.0-r0 --no-cache && rm -rf /var/cache/apk/*
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
npm run build &&
npm start
EOT

COPY . ./
RUN npm install
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
