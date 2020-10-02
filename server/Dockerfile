FROM node:12-alpine

# Install bash for migration script
RUN apk add --no-cache --update \
  bash \
  rm -rf /var/cache/apk/*

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD ["npm", "run", "start"]
