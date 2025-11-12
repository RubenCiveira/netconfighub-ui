PROJECT_NAME = {{name}}-ui
IMAGE = $(PROJECT_NAME)-frontend
SONAR_HOST_URL=http://localhost:9000
SONAR_TOKEN=sqa_67eedcbd6077003ee9f5ec37ca751ed930df554e

clean:
	rm -rf node_modules/ dist/
	npm cache clean --force

test:
	npm run test

lint:
	npm run lint || echo "Linting no disponible en package.json"

format:
	npm run pretify

quality:
	npx sonar-scanner -Dsonar.projectKey=$(PROJECT_NAME) -Dsonar.host.url=$(SONAR_HOST_URL) -Dsonar.token=$(SONAR_TOKEN) -Dsonar.sourceEncoding=UTF-8

docker-build:
	docker build --no-cache --force-rm -f src/docker/Dockerfile -t civi/{{name}}-ui .

docker-run:
	docker run -p 4200:80 -e APP_ROOT="/" --name angular-container civi/{{name}}-ui
	
