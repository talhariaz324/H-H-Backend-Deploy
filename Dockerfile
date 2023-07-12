FROM node:18.16.0-alpine

ENV MONGO_URI=mongodb+srv://bsf2000799:bsf2000799@cluster0.fvxjrgu.mongodb.net/H&H?retryWrites=true&w=majority

WORKDIR /home/app

COPY package.json package-lock.json /home/app/

RUN npm install

COPY . /home/app

CMD ["npm", "start"]
