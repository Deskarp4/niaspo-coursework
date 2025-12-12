FROM node:25-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY backend ./backend
EXPOSE 5000
CMD ["node", "backend/src/index.js"]