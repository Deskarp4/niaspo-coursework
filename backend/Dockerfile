FROM node:25-alpine
WORKDIR /app
COPY backend/package*.json ./
COPY backend/package-lock*.json ./
RUN npm install
COPY backend ./backend 
EXPOSE 5000
CMD ["node", "src/index.js"]  