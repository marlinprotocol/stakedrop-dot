#!/bin/sh
DIR="/home/app/node_modules"
if [ -d "$DIR" ]; then
  # Take action if $DIR exists. #
  echo "node_modules exists. Skipping installation"
else
  echo "Installing node_modules ${DIR}..."
  npm install
  npm audit fix
fi

npm run dev