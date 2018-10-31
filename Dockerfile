FROM node:8.12.0

# Bundle app source
COPY src /src/
COPY package.json index.js /

RUN cd /; npm install

CMD ["node", "index.js"]