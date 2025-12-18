FROM node:25-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY backend/src ./src 
EXPOSE 5000
CMD ["node", "src/index.js"]  