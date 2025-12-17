FROM node:23-alpine
WORKDIR /app
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
npm run build &&
npm start
EOT

COPY package*.json .
RUN npm install
COPY . ./
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
