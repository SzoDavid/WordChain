FROM node:18-alpine

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY entrypoint.sh /app/entrypoint.sh

WORKDIR "/app"

RUN npm install;

WORKDIR "/app/output"

CMD ["/bin/sh", "/app/entrypoint.sh"]
# CMD ["/bin/sh"]
