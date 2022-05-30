FROM node

USER MessageQuoteUser

WORKDIR /app

COPY tsconfig.json ./
COPY package*.json ./
COPY yarn.lock ./

RUN yarn --production=false

COPY .env ./
COPY ./ ./

RUN yarn build

CMD [ "yarn", "start" ]
