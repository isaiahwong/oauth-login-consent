BUILD_ID := $(shell git rev-parse --short HEAD 2>/dev/null || echo no-commit-id)
IMAGE_NAME := registry.gitlab.com/isaiahwong/cluster/client/oauth
VERSION := 0.0.1

.PHONY: build
.DEFAULT_GOAL := build

help: ## List targets & descriptions
	@cat Makefile* | grep -E '^[a-zA-Z_-]+:.*?## .*$$' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build docker image
	docker build -t $(IMAGE_NAME):latest . --rm=true

build-sha:
	docker build -t $(IMAGE_NAME):$(BUILD_ID) . --rm=true

push: 
	docker push $(IMAGE_NAME):latest

push-sha:
	docker push $(IMAGE_NAME):$(BUILD_ID)

build-all:
	make build
	make build-sha
push-all:
	make push
	make push-sha

build-push:
	make build-all
	make push-all

set-image:
	kubectl set image deployments/oauth-front-deployment oauth-front=$(IMAGE_NAME)

set-image-latest:
	kubectl set image deployments/oauth-front-deployment oauth-front=$(IMAGE_NAME):latest

set-image-sha:
	kubectl set image deployments/oauth-front-deployment oauth-front=$(IMAGE_NAME):$(BUILD_ID)

docker-compose:
	docker-compose -f docker-compose.yml -f quickstart-postgres.yml up --build

docker-compose-recreate:
	docker-compose -f docker-compose.yml -f quickstart-postgres.yml up --force-recreate --build

docker-compose-down:
	docker-compose -f docker-compose.yml -f quickstart-postgres.yml down

create-api-client:
	docker-compose -f docker-compose.yml exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445 \
    --id auth-code-client-2 \
    --secret secret \
    --grant-types authorization_code,refresh_token \
    --response-types code,id_token \
    --scope openid,offline \
    --callbacks http://127.0.0.1:5555/callback

	docker-compose -f docker-compose.yml exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445 \
    --id auth-code-client-2 \
    --secret secret \
    --grant-types authorization_code,refresh_token \
    --response-types code,id_token \
    --scope openid,offline \
    --callbacks	http://127.0.0.1:3000/auth/clients/claims/noop

start-oauth-client:
	docker-compose -f docker-compose.yml exec hydra \
	hydra token user \
	--client-id auth-code-client-2 \
	--client-secret secret \
	--endpoint http://127.0.0.1:4444/ \
	--port 5555 \
	--scope openid,offline
	