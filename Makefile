install:
	npm i . -g

lint:
	find bin lib jslint -name "*.js" -print0 | xargs -0 node ./bin/jslint.js --stupid

.PHONY: install lint
