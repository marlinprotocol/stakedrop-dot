#!/bin/sh
if [ -z "$ENV" ]; then
    echo "ENV not defined, quit!"
    exit 1
fi

docker rmi -f `docker images -f "dangling=true" -q`

if [ $ENV = "prod" ]
then
    docker-compose -f docker-compose.yml build
    docker-compose -f docker-compose.yml up -d
else
    docker-compose -f docker-compose_test.yml build
    docker-compose -f docker-compose_test.yml up -d
fi