# syntax=docker/dockerfile:1.4
FROM mcr.microsoft.com/devcontainers/base:1.0.19-ubuntu-22.04
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# install tools that should be available in the dev container
WORKDIR /devcontainersetup/
ENV BASH_ENV /root/.env
RUN touch "$BASH_ENV" && \
    echo '. "'"$BASH_ENV"'"' >> ~/.bashrc && \
    echo '. "'"$BASH_ENV"'"' >> ~/.zshrc

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | PROFILE="$BASH_ENV" bash
COPY .nvmrc ./
RUN nvm install && \
   corepack enable && \
   corepack prepare pnpm@8.15.1 --activate
