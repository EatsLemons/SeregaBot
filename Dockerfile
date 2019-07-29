FROM mhart/alpine-node:12

WORKDIR /app

COPY . /app

RUN npm install -g typescript
RUN npm install
RUN tsc

ENTRYPOINT [ "node", "build/app.js"]