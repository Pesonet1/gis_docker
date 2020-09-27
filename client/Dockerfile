FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8082

CMD ["http-server", "dist"]
