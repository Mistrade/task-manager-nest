FROM arm64v8/node:20.11.0-alpine3.18 AS build
WORKDIR /usr/src/app
COPY . ./
RUN npm ci --legacy-peer-deps && npm cache clean --force
RUN npm run build be-core

FROM arm64v8/node:20.11.0-alpine3.18 AS stage
COPY --from=build /usr/src/app/dist .
COPY --from=build /usr/src/app/node_modules node_modules/
CMD ["node", "main.js"]
