FROM node:alpine as base
WORKDIR /usr/src/app

RUN npm install -f -g yarn

COPY package.json yarn.lock .eslintrc.json .

RUN yarn install

COPY . .

FROM base as production
CMD ["yarn", "start"]

FROM base as dev
CMD ["yarn", "dev"]