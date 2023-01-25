FROM node:alpine
WORKDIR /usr/src/app

RUN npm install -f -g yarn

COPY package.json yarn.lock .eslintrc.json ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]