FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/spa /app/dist/spa

EXPOSE 3007

CMD ["serve", "-s", "/app/dist/spa", "-l", "3007"]