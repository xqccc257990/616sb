FROM node:10.15.1
MAINTAINER joy
COPY  node_modules ./node_modules/
COPY  dist ./dist/
COPY  app.js ./app.js
WORKDIR ./
CMD node app