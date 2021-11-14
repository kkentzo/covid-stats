ESBUILD := ./node_modules/esbuild-linux-64/bin/esbuild
TAILWINDCSS := ./node_modules/.bin/tailwindcss

.PHONY: build/assets
build/assets:
	cd assets && ${ESBUILD} js/app.js --bundle --outfile=static/out.js
	cd assets && ${TAILWINDCSS} --input=css/app.css --output=static/out.css --postcss

.PHONY: update/data
update/data:
	go run data/main.go
	mv results.json countries.json assets/js/
