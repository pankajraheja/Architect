# Stage 1: Build the Vue frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY simple-app/frontend/package*.json ./
RUN npm install
COPY simple-app/frontend/ ./
RUN npm run build

# Stage 2: Run the Express backend and serve the frontend
FROM node:20-alpine
WORKDIR /app
COPY simple-app/backend/package*.json ./
RUN npm install --omit=dev
COPY simple-app/backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public
EXPOSE 3001
CMD ["node", "server.js"]
