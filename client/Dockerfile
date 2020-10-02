FROM node:12-alpine

RUN npm install -g http-server

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# remove development dependencies
RUN npm prune --production

EXPOSE 8082

CMD ["http-server", "--port", "8082", "dist"]
