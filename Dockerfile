FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:24-alpine

RUN npm install -g serve@14

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 4545
CMD ["serve", "-s", "dist", "-l", "4545", "--no-clipboard"]
