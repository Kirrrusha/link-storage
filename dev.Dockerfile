FROM node:18.1.0

WORKDIR /app

COPY . .

RUN npm install -g pnpm

# CMD ["pnpm", "start:dev"]
CMD [ -d "node_modules" ] && pnpm start:dev || pnpm install --frozen-lockfile && pnpm start:dev
