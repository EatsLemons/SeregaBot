FROM mhart/alpine-node:12

WORKDIR /app

COPY . /app

RUN npm install -g typescript
RUN npm install
RUN tsc

ENTRYPOINT [ "node", "build/app.js" ]
CMD [ "chan=${CHAN}", "roles=${ROLES}", "t_token=${TWITCH_TOKEN}", "d_token=${DISCORD_TOKEN}" ]

#docker run -p 9000:9000 -e NODE_ENV=dev -e CLUSTER=0 -d me/app