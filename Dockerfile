FROM node

WORKDIR /app

COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./

RUN yarn --production=false

COPY ./ ./

RUN yarn build

CMD [ "yarn", "start" ]
