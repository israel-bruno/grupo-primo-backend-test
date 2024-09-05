FROM node:22-bullseye

COPY . /usr/src

WORKDIR /usr/src

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD yarn start:prod