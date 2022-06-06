FROM node:16 AS build

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn build


FROM node:16 AS deps

WORKDIR /deps
COPY --from=build /build/package.json /build/yarn.lock ./
RUN yarn install --production


FROM gcr.io/distroless/nodejs:16

WORKDIR /app

USER nonroot

COPY --from=deps /deps/package.json ./
COPY --from=deps /deps/node_modules ./node_modules/
COPY --from=build /build/build ./build/

CMD ["./build/index.js"]
