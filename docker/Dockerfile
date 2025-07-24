FROM node:21-alpine3.19

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma 

RUN npm install

COPY . .

EXPOSE ${APP_PORT:-3000}

