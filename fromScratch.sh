#!/bin/sh
if [ -z "$ENV" ]; then
    echo "ENV not defined, quit!"
    exit 1
fi

sh stop.sh
sh start.sh