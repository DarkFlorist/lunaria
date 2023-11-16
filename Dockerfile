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

RUN npm run --prefix ./build vendor
RUN npm run build

# Push the built app to IPFS
FROM ipfs/kubo:latest

# Set path for lunaria static site
WORKDIR /ipfs

# Copy all built files from previous step
COPY --from=builder /source/app .
RUN ipfs init
RUN ipfs add --cid-version 1 --quieter --only-hash --recursive . > ipfs_hash.txt
RUN cat ipfs_hash.txt
