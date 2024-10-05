
FROM node:18-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

EXPOSE 3000



CMD ["npm", "start"]
