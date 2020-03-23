FROM node:8-alpine as build

RUN apk add --update --no-cache \
    python \
    make \
    g++ 

WORKDIR /app
COPY ./package.json .
RUN npm i
WORKDIR .
COPY . .
ENV PUBLIC_URL=/auth
RUN npm run build -- --release

FROM node:8-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./proto ./proto
COPY ./locales ./locales

RUN npm install --production
COPY --from=build /app/build ./build
CMD [ "node", "build/server.js" ]