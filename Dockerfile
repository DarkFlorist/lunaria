FROM node:20-alpine as builder

# Install vendor dependencies
WORKDIR /source/vendor
COPY vendor/package.json package.json
COPY vendor/package-lock.json package-lock.json
RUN npm ci

# Install app dependencies
WORKDIR /source
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Copy project files and run necessary symlinks npm needs
COPY app app
COPY vendor vendor
RUN npm ci

# Buld the app
COPY tsconfig.json tsconfig.json
RUN npm run build

# Create kubo-based image
FROM ipfs/kubo:latest as ipfs

# Copy generated app
WORKDIR /export
COPY --from=builder /source/app .
