FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

###################################

FROM node:24-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules node_modules
COPY . .

RUN yarn build

###################################

FROM node:24-alpine AS run

WORKDIR /app

COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY package.json yarn.lock ./
COPY .env .
COPY ./src/openapi-gateway.yaml ./openapi-gateway.yaml

CMD [ "yarn", "start" ]