# Awesome Project Build with TypeORM

This is the backend part for the test assignment, frontend part can be found [there](https://github.com/skayred/alpha-ui)
In order to get the project running, you need to pull both projects and build their Docker images:

```
cd alpha-ui
sh build.sh
cd ../alpha-backend
sh build.sh
```

Alternatively, you can use the prebuilt images, available at Docker Hub.

## Running details

You can use Docker Compose to run all the components - UI, Backend, and PostgreSQL database. To start the installation, please run the command like below:

```
cd alpha-backend
DBPASSWORD=CHANGE_ME docker-compose up -d
```

This command will first run the UI and DB, then wait for the DB startup, and then run the backend. Backend will run the migrations and seed the data if the database is empty upon the run process.

## UI access

When the Docker Compose is ready, you can access the UI through your [localhost:3000](https://localhost:3000)

## Testing details

The file under `./test/schema.test.ts` contains the set of e2e tests that uses the real GraphQL queries, so that can be refererred as the querying examples.
