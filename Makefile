-include .env .env.local

CURRENT_UID 		= $(shell id -u)
CURRENT_GID 		= $(shell id -g)
CURRENT_PATH 		= $(shell pwd)

NODE_IMG 			= node:lts-alpine
NODE_PORTS 			= 3000:3000

DOCKER_VOLUMES		= -v ${CURRENT_PATH}:/usr/src
DOCKER_RUN			= docker run ${DOCKER_EXTRA_PARAMS} --rm -u ${CURRENT_UID}:${CURRENT_GID} 
DOCKER_RUN_NODE 	= ${DOCKER_RUN} -w /usr/src ${DOCKER_VOLUMES} -p ${NODE_PORTS} ${NODE_IMG}

## 
## Create
## ------
## 

create-react-app: ## args: name - Create a react app
	@${DOCKER_RUN_NODE} npx create-react-app ${name}

.PHONY: create-react-app

## 
## Commands
## --------
## 

node: ## args: cmd - Execute a node command
	@${DOCKER_RUN_NODE} ${cmd}

yarn: ## args: cmd - Execute a yarn command
	@${DOCKER_RUN_NODE} yarn ${cmd}

.PHONY: node yarn

## 
## Project
## -------
## 

install: yarn.lock
	@${DOCKER_RUN_NODE} yarn install

start: ## Start project
start: install
	@${DOCKER_RUN_NODE} yarn start

.PHONY: start

## 

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
