FROM node:10.15-jessie

RUN cd ~ && mkdir app

COPY package.json /home/app/package.json
COPY package-lock.json /home/app/package-lock.json
WORKDIR /home/app

RUN rm -rf node_modules
RUN npm install
RUN npm audit fix
COPY . /home/app

CMD [ "sh", "app.sh" ]