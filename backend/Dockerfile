FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source
COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["node", "server.js"]
