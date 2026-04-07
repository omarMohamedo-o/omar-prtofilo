FROM node:20-alpine

WORKDIR /app

COPY discovery.js ./discovery.js
COPY server.js ./server.js
COPY package.json ./package.json

ENV NODE_ENV=production
ENV PORT=8787

EXPOSE 8787

CMD ["npm", "start"]
