# Base image
FROM --platform=$BUILDPLATFORM node:18.12.0-alpine as base
WORKDIR /app
COPY package.json /app

# Production Stage
FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . /app
EXPOSE 5000
CMD ["npm", "start"]

# Development Stage
FROM base as dev
ENV NODE_ENV=development
RUN npm install 
COPY . /app
EXPOSE 5000
CMD ["npm", "run", "dev"]
