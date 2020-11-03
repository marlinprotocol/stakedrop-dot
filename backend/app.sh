#!/bin/sh
if [ -z "$NODE_ENV" ]; then
    echo "NODE_ENV not defined, quit!"
    exit 1
fi

DIR="/home/app/node_modules"
if [ -d "$DIR" ]; then
  # Take action if $DIR exists. #
  echo "node_modules exists. Skipping installation"
else
  echo "Installing node_modules ${DIR}..."
  if [ $NODE_ENV = "prod" ]
  then
      npm install
      npm audit fix 
  else
      npm install --save-dev
  fi
fi

if [ $NODE_ENV = "prod" ]
then
    npm run prod
else
    npm run dev
fi