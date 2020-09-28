FROM node:lts-alpine

# Install bash for migration script
RUN apk add --update bash

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD ["npm", "run", "start"]
