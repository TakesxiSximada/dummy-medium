.DEFAULT_GOAL_NAME := help

NODE_MODULES_BIN := $(CURDIR)/node_modules/.bin
GULP := $(NODE_MODULES_BIN)/gulp
WEBPACK := $(NODE_MODULES_BIN)/webpack
WEBPACK_DEV_SERVER := $(NODE_MODULES_BIN)/webpack-dev-server



.PHONY: help
help:
	@# display usage

	@unmake $(MAKEFILE_LIST)


.PHONY: webpack-dev-server
webpack-dev-server:
	@# Start develop server

	$(WEBPACK_DEV_SERVER) --content-base $(CURDIR)/dst --inline

.PHONY: build
build:
	@# Build files

	$(WEBPACK)

.PHONY: watch
watch:
	@# Start develop server

	$(GULP) watch

.PHONY: release
release:
	@# Build files

	GIT_COMMIT_HASH=`git rev-parse HEAD` $(GULP) build --release

.PHONY: clean
clean:
	@# Clear file

	rm -rf dst
