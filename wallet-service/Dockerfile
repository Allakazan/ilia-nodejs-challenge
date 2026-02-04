
FROM node:21-alpine

WORKDIR /usr/src
COPY wallet-service/package.json wallet-service/yarn.lock ./wallet-service/

WORKDIR /usr/src/wallet-service
RUN yarn install

WORKDIR /usr/src
EXPOSE 3001

CMD ["yarn", "start:dev"]