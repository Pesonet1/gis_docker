FROM node:lts-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD ["npm", "run", "start"]
