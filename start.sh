docker rmi -f `docker images -f "dangling=true" -q`
docker-compose -f docker-compose_test.yml build
docker-compose -f docker-compose_test.yml up -d