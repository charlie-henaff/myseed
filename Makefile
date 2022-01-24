include .env .env.local

CURRENT_UID 		= $(shell id -u)
CURRENT_GID 		= $(shell id -g)
CURRENT_PATH 		= $(shell pwd)

NODE_IMG 			= node:lts-alpine
NODE_PORTS 			= 3000:3000

RUN_NODE 			= docker run ${DOCKER_EXTRA_PARAMS} --rm -u ${CURRENT_UID}:${CURRENT_GID} -w /usr/src -v ${CURRENT_PATH}:/usr/src -p ${NODE_PORTS} ${NODE_IMG}

## 
## Create
## ------
## 

create-react-app: ## args: name - Create a react app
	@${RUN_NODE} npx create-react-app ${name}

.PHONY: create-react-app

## 
## Commands
## --------
## 

node: ## args: cmd - Execute a node command
	@${RUN_NODE} ${cmd}

yarn: ## args: cmd - Execute a yarn command
	@${RUN_NODE} yarn ${cmd}

.PHONY: node yarn

## 
## Project
## -------
## 

install: yarn.lock
	@${RUN_NODE} yarn install

start: ## Start project
start: install
	${RUN_NODE} yarn start

.PHONY: start

## 

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help