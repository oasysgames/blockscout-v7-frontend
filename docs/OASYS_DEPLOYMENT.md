# Oasys Chain Deployment Guide

This guide is specific for deploying Blockscout frontend for Oasys Chain.

## Docker Image

The Oasys-specific Blockscout frontend image is available on Docker Hub:

```sh
docker pull oasysgames/blockscout-v6-frontend:latest
```

You can find all available tags at [Docker Hub Repository](https://hub.docker.com/r/oasysgames/blockscout-v6-frontend/tags).

## Running the Container

To run the Oasys Blockscout frontend:

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> oasysgames/blockscout-v6-frontend:latest
```

For environment variables configuration, please refer to the [ENVS.md](./ENVS.md) file.

## Note

This is a fork of the original Blockscout frontend specifically customized for Oasys Chain. For the original Blockscout frontend documentation, please refer to other documents in the `docs` directory.
