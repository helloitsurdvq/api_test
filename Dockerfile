FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# FROM node:22-slim AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install 
# COPY . .
# RUN npm run build

# FROM node:22-slim
# WORKDIR /app
# COPY package*.json ./
# EXPOSE 3000
# CMD ["npm", "run", "dev"]
