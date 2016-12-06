.DEFAULT_GOAL_NAME := help

.PHONY: help
help:
	@# display usage

	@unmake $(MAKEFILE_LIST)


.PHONY: dev
dev:
	@# Start develop server
