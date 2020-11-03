#!/bin/sh
if [ -z "$ENV" ]; then
    echo "ENV not defined, quit!"
    exit 1
fi

if [ $ENV = "prod" ]
then
    docker-compose -f docker-compose.yml down
else
    docker-compose -f docker-compose_test.yml down
fi