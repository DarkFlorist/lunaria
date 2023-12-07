FROM node:20-alpine as builder

# Install vendor dependencies
COPY ./vendor/package.json /app/vendor/package.json
COPY ./vendor/package-lock.json /app/vendor/package-lock.json
WORKDIR /app/vendor
RUN npm ci

# Install app dependencies
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm ci

# Copy project files and run necessary symlinks npm needs
COPY ./vendor/ /app/vendor/
COPY ./app/index.html /app/app/index.html
WORKDIR /app/build
RUN npm run vendor

# Buld the app
COPY ./tsconfig.json /app/tsconfig.json
COPY ./app/css/ /app/app/css/
COPY ./app/img/ /app/app/img/
COPY ./app/ts/ /app/app/ts/
WORKDIR /app
RUN npm run build

# Create kubo container
FROM ipfs/kubo:latest as ipfs

# Copy generated app
WORKDIR /export
COPY --from=builder /app/app .
