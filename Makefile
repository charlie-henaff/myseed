-include .env .env.local

NODE_IMG            = node:lts-alpine
NODE_PORTS          = 80:3000

DOCKER_VOLUMES      = -v ./:/usr/src
DOCKER_RUN          = docker run $(DOCKER_EXTRA_PARAMS) --rm -u 1000:1000
DOCKER_RUN_NODE     = $(DOCKER_RUN) -w /usr/src $(DOCKER_VOLUMES) -p $(NODE_PORTS) $(NODE_IMG)

.DEFAULT_GOAL :=    help
.PHONY:             help

help:
	@grep -Eh '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


## 
##Create
##-----------------------------------------------------------------------------
.PHONY: create-react-pwa create-react-app 

create-react-pwa: ## Create a react pwa
	@make -s create-react-app template=cra-template-pwa

create-react-app: ## args: t="[template]" - Create a react app
ifneq ($(wildcard $(CURRENT_PATH)/src/.),)
	@echo "src folder exist remove it to create an app"
else
ifndef template
	@$(DOCKER_RUN_NODE) npx create-react-app app
else
	@$(DOCKER_RUN_NODE) npx create-react-app app --template $(template) 
endif
	@chown -R $(CURRENT_UID):$(CURRENT_GID) app/
	@mv app/* ./ 
	@rm -rf app/
endif


##
##Commands 
##-----------------------------------------------------------------------------
.PHONY: node npm npx

node: ## args: c="[command]" - Execute a node command
	@$(DOCKER_RUN_NODE) $(c)
 
npm: ## args: c="[command]" - Execute a npm command 
	@$(DOCKER_RUN_NODE) npm $(c)

npx: ## args: c="[command]" - Execute a npx command
	@$(DOCKER_RUN_NODE) npx $(c)


## 
##Dependencies
##-----------------------------------------------------------------------------
.PHONY: install update

node_modules: package.json
	@$(DOCKER_RUN_NODE) npm install

install: package.json ## Install dependencies
	@$(DOCKER_RUN_NODE) npm install

update: package.json ## Update dependencies
	@$(DOCKER_RUN_NODE) npm update


## 
##Project 
##-----------------------------------------------------------------------------
.PHONY: build start serve

build: node_modules src public ## Build project
	@$(DOCKER_RUN_NODE) npm run build

start: node_modules src ## Start project
	@$(DOCKER_RUN_NODE) npm start

serve: node_modules build ## Serve project
	@$(DOCKER_RUN_NODE) sh -c "npm install -g serve && serve -s build"

##