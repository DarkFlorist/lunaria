FROM node:20.9.0-alpine as builder

# Set directory for the sources to be processed
WORKDIR /source/build

# Install node depenedencies
COPY build/package.json package.json
COPY build/package-lock.json package-lock.json
RUN npm ci

WORKDIR /source
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Copy and build the app
COPY build build
COPY app app
COPY tsconfig.json tsconfig.json

RUN npm exec --prefix ./build vendor
RUN npm run build

# Create kubo container
FROM ipfs/kubo:latest

WORKDIR /container-init.d
ADD ipfs.config.sh .
RUN chmod a+x ipfs.config.sh

# Copy generated app
WORKDIR /var/www
COPY --from=builder /source/app .
