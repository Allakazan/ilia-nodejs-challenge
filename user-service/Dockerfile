
FROM node:21-alpine

WORKDIR /usr/src
COPY user-service/package.json user-service/yarn.lock ./user-service/

WORKDIR /usr/src/user-service
RUN yarn install

WORKDIR /usr/src
EXPOSE 3002

CMD ["yarn", "start:dev"]