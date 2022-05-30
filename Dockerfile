FROM node

USER MessageQuoteUser

WORKDIR /app

COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./

RUN yarn --production=false

COPY src ./

RUN yarn build

CMD [ "yarn", "start" ]
