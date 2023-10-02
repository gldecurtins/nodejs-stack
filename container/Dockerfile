FROM node:20.8.0-alpine
WORKDIR /usr/src

COPY package.json ./

RUN npm install

COPY ./app ./app

EXPOSE 3001
CMD ["node", "app/main.mjs"]