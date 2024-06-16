# FROM node:8-alpine
FROM node

EXPOSE 80

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV PORT 80

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn global add pm2 nodemon
RUN yarn --pure-lockfile
ADD . /app

CMD ["yarn", "docker:start"]
