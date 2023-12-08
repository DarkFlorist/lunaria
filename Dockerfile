FROM node:20-alpine as builder

# Install app dependencies
COPY ./package.json /source/package.json
COPY ./package-lock.json /source/package-lock.json
WORKDIR /source
RUN npm ci

# Copy project files and run necessary symlinks npm needs
COPY ./build-scripts/ /source/build-scripts/
COPY ./tsconfig.vendor.json /source/tsconfig.vendor.json
COPY ./app/index.html /source/app/index.html
RUN npm run vendor

# Buld the app
COPY ./tsconfig.json /source/tsconfig.json
COPY ./app/css/ /source/app/css/
COPY ./app/img/ /source/app/img/
COPY ./app/ts/ /source/app/ts/
RUN npm run build

# Create kubo container
FROM ipfs/kubo:latest as ipfs

# Copy generated app
COPY --from=builder /source/app /export

# this entrypoint file will execute `ipfs add` of the build output to the docker host's IPFS API endpoint, so we can easily extract the IPFS build out of the docker image
RUN printf '#!/bin/sh\nipfs add --cid-version 1 -r /export' >> /container-init.d/start.sh
