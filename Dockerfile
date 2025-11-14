FROM node:20-alpine

COPY ./package.json /app/
COPY ./package-lock.json /app/
COPY ./app.js /app/
COPY ./views /app/views/
COPY ./public /app/public/
COPY ./models /app/models/
COPY ./seeds /app/seeds/
COPY ./nodemon.json /app/nodemon.json
COPY ./layouts /app/layouts/
COPY ./AppError.js /app/AppError.js



WORKDIR /app

RUN npm install

CMD ["node", "app.js"]
