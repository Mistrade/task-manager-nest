dev-arm:
	docker-compose -f ./docker-compose.yml up --build -d
dev:
	docker-compose -f ./docker-compose.yml up --build -d