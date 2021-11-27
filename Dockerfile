FROM node:16-alpine AS builder

RUN apk update

WORKDIR /datamine

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn compile

CMD [ "yarn", "start" ]
