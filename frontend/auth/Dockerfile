FROM node:24-slim AS dependencies

WORKDIR /app

COPY package*.json .

RUN npm install

###################################

FROM node:24-slim AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules node_modules
COPY package*.json .

COPY . .

RUN npm run build

###################################

FROM node:24-slim AS runner

WORKDIR /app

COPY --from=dependencies /app/node_modules node_modules
COPY --from=builder /app/dist dist
COPY package*.json .

EXPOSE 4173

CMD [ "npm", "run", "preview" ]