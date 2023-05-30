FROM node:14-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NODE_ENV production
USER node

EXPOSE 4000
# CMD [ "npm", "run", "start" ]
CMD ["sh", "-c", "npm run seed ; npm run start"]
