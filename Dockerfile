FROM node:18-alpine

COPY package*.json /app/
COPY entrypoint.sh /app/

WORKDIR "/app"

RUN apk add --no-cache python3 make g++; \
npm install;

WORKDIR "/app/output"

USER 1000:1000

CMD ["/bin/sh", "/app/entrypoint.sh"]
# CMD ["/bin/sh"]
