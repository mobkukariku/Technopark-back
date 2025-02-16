FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install || cat /root/.npm/_logs/*.log


COPY . .

RUN ls -la /app
RUN cat /app/tsconfig.json


RUN ls -la && npm run build


CMD ["node", "dist/server.js"]
