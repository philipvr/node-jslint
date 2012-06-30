install-local:
	npm i .

install:
	npm i . -g

lint:
	find bin lib jslint -name "*.js" -print0 | xargs -0 node ./bin/jslint.js --stupid

update:
	node ./bin/jslint.js --update

.PHONY: install global-install lint update
