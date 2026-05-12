FROM node:24-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run release

ENV NODE_ENV="production"
ENV IRIS_PRODUCTION="true"

EXPOSE 6754

CMD [ "node", "dist/cli.js" ]
