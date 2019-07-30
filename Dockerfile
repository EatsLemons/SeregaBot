FROM arm32v7/node

WORKDIR /app

COPY . /app

RUN npm install -g typescript
RUN npm install
RUN tsc

ENTRYPOINT [ "node", "build/app.js"]