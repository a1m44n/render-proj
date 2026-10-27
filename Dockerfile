# Small, secure base image
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy manifest first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy application source
COPY . .

# Run as the non-root "node" user provided by the image
USER node

# Render sets PORT at runtime (default 10000)
ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]
