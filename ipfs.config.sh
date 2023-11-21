ipfs config Addresses.API --json '["/ip4/0.0.0.0/tcp/5001", "/ip6/::/tcp/5001"]'
ipfs config --json Addresses.AppendAnnounce '["/ip4/'"${IPV4_ADDRESS:-0.0.0.0}"'/tcp/4001"]'
ipfs add --cid-version 1 --recursive /var/www
