FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY . /app/frontend

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Use Caddy for serving the frontend
FROM caddy:2-alpine

# Copy built frontend assets to Caddy's site directory
COPY --from=builder /app/frontend/dist /srv

# Copy Caddyfile configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port
EXPOSE 80

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"] 