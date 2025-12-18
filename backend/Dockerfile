FROM node:25-alpine
WORKDIR /app
COPY package*.json ./
COPY package-lock*.json ./
RUN npm install
COPY backend ./backend 
EXPOSE 5000
CMD ["node", "src/index.js"]  