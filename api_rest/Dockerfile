FROM node:24-bullseye AS dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

###################################

FROM node:24-bullseye AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN yarn build

###################################

FROM node:24-alpine AS run

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY prisma.config.ts .
COPY package.json yarn.lock ./
COPY .env .

EXPOSE 3334

CMD [ "yarn", "start" ]