# syntax=docker/dockerfile:1.4
FROM ubuntu:22.04 AS tools
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update && \
    apt-get install --no-install-recommends --no-install-suggests -yqq \
      ca-certificates curl

ENV BASH_ENV /root/.env
RUN touch "$BASH_ENV" && \
    echo '. "'"$BASH_ENV"'"' >> ~/.bashrc && \
    echo 'shopt -s globstar' >> "$BASH_ENV"

WORKDIR /repo/

# Install nvm, node, pnpm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | PROFILE="$BASH_ENV" bash
COPY .nvmrc ./
RUN nvm install && \
   corepack enable && \
   corepack prepare pnpm@8.15.3 --activate
RUN mkdir /output/ && printf "\
nvm  $(nvm -v)\n\
node $(node -v)\n\
npm  $(npm -v)\n\
pnpm $(pnpm -v)\n\
" |& tee /output/versions.txt



FROM tools AS common-dependencies
COPY pnpm-lock.yaml ./
#ADD https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Stockholm /tmp/currenttime
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm fetch --color |& tee /output/pnpm-fetch.txt
COPY \
    .editorconfig \
    package.json \
    pnpm-workspace.yaml \
    README.md \
    tsconfig.json \
    ./
COPY apps/app/package.json apps/app/package.json
COPY packages/test/package.json packages/test/package.json
RUN pnpm install --color --frozen-lockfile --offline |& tee /output/pnpm-install.txt



FROM common-dependencies AS apps-app
RUN mkdir -p /output/apps/app/
COPY submodules/PokeAPI/sprites/sprites/pokemon/other/official-artwork/*.png submodules/PokeAPI/sprites/sprites/pokemon/other/official-artwork/
COPY apps/app/ apps/app/
COPY packages/test/ packages/test/
WORKDIR /repo/apps/app/

FROM apps-app AS apps-app-build
ENV NEXT_TELEMETRY_DISABLED 0
RUN FORCE_COLOR=1 pnpm build |& tee /output/apps/app/build.txt

FROM apps-app AS apps-app-check
RUN pnpm check |& tee /output/apps/app/check.txt

FROM apps-app AS apps-app-lint
RUN pnpm lint --color |& tee /output/apps/app/lint.txt

FROM apps-app AS apps-app-test
RUN pnpm test --color |& tee /output/apps/app/test.txt



FROM common-dependencies AS packages-test
RUN mkdir -p /output/packages/test/
COPY packages/test/ packages/test/
WORKDIR /repo/packages/test/

FROM packages-test AS packages-test-check
RUN pnpm check |& tee /output/packages/test/check.txt

FROM packages-test AS packages-test-lint
RUN pnpm lint --color |& tee /output/packages/test/lint.txt

FROM packages-test AS packages-test-test
RUN pnpm test --color |& tee /output/packages/test/test.txt



FROM scratch AS ci
COPY --from=apps-app-build /output/ /
COPY --from=apps-app-check /output/ /
COPY --from=apps-app-lint /output/ /
COPY --from=apps-app-test /output/ /
COPY --from=packages-test-check /output/ /
COPY --from=packages-test-lint /output/ /
COPY --from=packages-test-test /output/ /



FROM scratch AS build
COPY --from=apps-app-build /repo/apps/app/out/ /
