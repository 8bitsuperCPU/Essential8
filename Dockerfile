FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM oven/bun:1.3-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY backend ./backend
COPY data ./data

RUN mkdir -p /app/data/uploads

EXPOSE 4545

CMD ["bun", "backend/server.js"]
