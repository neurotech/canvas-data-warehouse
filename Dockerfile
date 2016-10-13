FROM mhart/alpine-node:6.5.0

WORKDIR /src
ADD . .

CMD ["node", "index.js"]
