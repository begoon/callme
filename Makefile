all: dev

SITE=https://demin.ws/callme/

live:
	open $(SITE)

dev:
	bun index.html

test:
	bun test
