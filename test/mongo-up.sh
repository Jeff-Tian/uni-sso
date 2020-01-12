#!/usr/bin/env bash

container_name='local-mongo'

if [ "$(docker inspect -f '{{.State.Running}}' $container_name)" = "true" ]; then
  echo "$container_name is already running."
else
  docker kill $container_name || echo "$container_name is already killed"
  docker rm $container_name || echo "$container_name not exist"
  docker run -d -p 27017:27017 --name $container_name mongo:3.4

  sleep 5
fi


