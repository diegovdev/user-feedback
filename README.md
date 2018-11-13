# user-feedback technical test

### Introduction

**About the datastore:**

The app was build supporting 2 datastores: MySql and an InMemory datastore. The InMemory option was implemented
just as a fallback in case MySql gives trouble when you test run the app. InMemory is an own implementation, it does not use Redis or similar.

**Validation modes:** 
* **strict:** In strict mode when creating a new Feedback entry the provided userId and sessionId must exist in the datastore already.
* **permissive:** In permissive mode if they don't exist then they will be created before creating the new Feedback entry.

The app was tested on MacOS v10.12.

### Endpoints
To create a new Feedback entry:
* `http://localhost:3300/api/v1/feedback/create/{sessionId}`
    * the payload on body is expected as in the following sample: `{
                       	"Ubi-UserId": "usr-000-024",
                       	"rating": "3",
                       	"comment": "all good"
                       }`
    * the `Ubi-UserId` value can be passed in the body OR as an Http header (as the instructions request)
    
To find last 15 Feedback entries:
* `http://localhost:3300/api/v1/feedback/find`

To find Feedback entries filtering by rating:
* `http://localhost:3300/api/v1/feedback/find?rating={ratingToFilerFor}`

To find Feedback entries changing the return limit:
* `http://localhost:3300/api/v1/feedback/find?limit={resultLimit}&rating={ratingToFilerFor}`

To find Feedback entry by Id:
* `http://localhost:3300/api/v1/feedback/find/{feedbackId}`

### Running the app
* Prerequisites:
    * docker v18.03
    * node v11
    * npm v6.4
    * Ports 3300 and 3309 free
    * Install dependencies running `npm install` inside the user-feedback folder 

##### Run on Docker using MySql (easiest):
* Run: `docker-compose up` 
* Notes:
    * App will run in permissive mode
    * This will bring up 2 container: a MySql container and the app runing in it's own Alpine based container.
    * It may take a few minutes for Docker to download and build images and libraries before the app starts for the first time.
    * Run `docker-compose down` to stop and delete the created containers.

##### Run on local using InMemory:
* Run: `DATASTORE=memory npm run start`
* Notes:
    * App will run in permissive mode
    * If you want to try strict mode run: `VALIDATION_MODE=strict DATASTORE=memory npm run start`

##### Run on local using MySql:
* Start MySql container: `docker-compose up ubi_mysql_dc`
* Make sure MySql container is ready before starting the app
* Run: `DATASTORE=mysql npm run start`
* Notes:
    * App will run in permissive mode
    * It may take a few minutes for Docker to download images and start MySql
    * If you want to try strict mode run: `VALIDATION_MODE=strict DATASTORE=mysql npm run start`


### Running tests
* Run all tests with: `npm run alltest` (MySql container must be running)
* Run integration tests with: `npm run itest` (MySql container must be running)
* Run unit tests with: `npm run utest`


