FROM node:16.13.0

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "start:dev"]
