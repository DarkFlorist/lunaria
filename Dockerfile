FROM node:20-alpine as builder

# Install app dependencies
COPY ./package.json /source/package.json
COPY ./package-lock.json /source/package-lock.json
WORKDIR /source
RUN npm ci

# Run the vendoring script
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

# Create ipfs image
FROM alpine:3.19.0 as ipfs

# Install kubo and initialize ipfs
RUN apk add kubo
RUN ipfs init

# Copy lunaria build output
COPY --from=builder /source/app /export

# add the build output to IPFS and write the hash to a file
RUN ipfs add --cid-version 1 --quieter --only-hash --recursive /export > ipfs_hash.txt

# print the hash for good measure in case someone is looking at the build logs
RUN cat ipfs_hash.txt

# this entrypoint file will execute `ipfs add` of the build output to the docker host's IPFS API endpoint, so we can easily extract the IPFS build out of the docker image
RUN printf '#!/bin/sh\nipfs --api /ip4/`getent ahostsv4 host.docker.internal | grep STREAM | head -n 1 | cut -d \  -f 1`/tcp/5001 add --cid-version 1 -r /export' >> entrypoint.sh
RUN chmod u+x entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]
