FROM node:lts-slim
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
ENV CI=true
CMD ["npm", "start"]