# user-feedback technical test

## Introduction

**About the data-store:**

The app was built supporting 2 data-stores: MySql and an InMemory data-store. The InMemory option was implemented
just as a fallback in case MySql gives trouble when you test-run the app. InMemory is an own implementation, it does not use Redis or similar to avoid depending on an external tool when test-running the app.

For MySql, when the app starts it will automatically create the database and it's tables.

**Validation modes:** 
* **strict:** In strict mode when creating a new Feedback entry the provided userId and sessionId must be known entities, i.e. they must exist in the data-store already.
* **permissive:** In permissive mode if they don't exist then they will be created before creating the new Feedback entry.

The app was tested on MacOS v10.12. I used GitHub task tools when working on the project, you can see [the issues/tasks history](https://github.com/sapeish/user-feedback/issues?utf8=✓&q=is%3Aissue+sort%3Acreated-asc+) and [the Kanban board](https://github.com/sapeish/user-feedback/projects/1) I used. 

## Endpoints
**To create a new Feedback entry:**
* `http://localhost:3300/api/v1/feedback/create/{sessionId}`
    * the payload on body is expected as in the following sample: `{
                       	"Ubi-UserId": "usr-000-024",
                       	"rating": "3",
                       	"comment": "all good"
                       }`
    * the `Ubi-UserId` value can be passed in the body OR as an Http header (as the instructions requested)
    
**To find the last 15 Feedback entries:**
* `http://localhost:3300/api/v1/feedback/find`

**To find the last 15 Feedback entries filtering by rating:**
* `http://localhost:3300/api/v1/feedback/find?rating={ratingToFilerFor}`

**To find the last Feedback entries changing the return limit:**
* `http://localhost:3300/api/v1/feedback/find?limit={resultLimit}&rating={ratingToFilerFor}`

**To find a Feedback entry by Id (extra):**
* `http://localhost:3300/api/v1/feedback/find/{feedbackId}`

## Running the app
* Prerequisites:
    * docker v18.03
    * docker-compose v1.21
    * node v11
    * npm v6.4
    * Port 3300 free (to be used by the Http server)
    * Port 3309 free (to be used by MySql container)
    * Install dependencies running `npm install` inside the user-feedback folder
     * MySql: No need to install (it will be started using Docker)

* Useful notes:
    * MySql: in case you wish to use an already installed instance:
        * You can change the connection settings of the app at `/config/config.js`
        * This app was built and tested using MySql v5.6
    * If you use [Insomnia](https://insomnia.rest/) rest client, you can import the test endpoint json config file located at `/test/.insomnia/`


#### Option 1: Run on Docker using MySql (easiest)
* Run: `docker-compose up` 
* Notes:
    * App will run in permissive mode
    * This will bring up 2 container: a MySql container and this app running in it's own Alpine based container.
    * It will take a few minutes for Docker to download and build images and libraries before the app starts for the first time.
    * Run `docker-compose down` to stop and delete the created containers.

#### Option 2: Run on local using InMemory
* Dependencies should be installed already (`npm install`)
* Set env vars: `export DATASTORE=memory&&export ENVIRONMENT=sandbox` (in Windows use `set DATASTORE=memory&&set ENVIRONMENT=sandbox`)
* Run: `npm run start`
* Notes:
    * App will run in permissive mode

#### Option 3: Run on local using MySql
* Dependencies should be installed already (`npm install`)
* Start MySql container: `docker-compose up ubi_mysql_dc`
* Make sure MySql container is ready before starting the app
* Set env vars: `export DATASTORE=mysql&&export ENVIRONMENT=sandbox` (in Windows use `set DATASTORE=mysql&&set ENVIRONMENT=sandbox`)
* Run: `npm run start`
* Notes:
    * App will run in permissive mode
    * It may take a few minutes for Docker to download images and start MySql
    * If you want to try strict mode set env var: `export VALIDATION_MODE=strict`
    * For strict mode you can add mock users and sessions to the database by running `npm run seeddb`, sessionIds added are `session-2001` to `session-2030`, userIds added are `user-1001` to `user-1030`
    * You can later clear all the info in the database by running `npm run cleardb`


## Running tests
* First:
    * set the env var `export NODE_ENV=test` (in Windows use `set NODE_ENV=test`)
    * dependencies should be installed already (`npm install`)

* Run all tests with: `npm run fulltest` (MySql container must be running `docker-compose up ubi_mysql_dc`)
* Run only integration tests with: `npm run itest` (MySql container must be running)
* Run only unit tests with: `npm run utest`


## Design

#### Frameworks:
I decided to use NodeJs since I am familiar with it already. I chose ExpressJs for the REST API since it makes it very easy to create endpoints and is very stable.
I wanted to try something I didnt use before so I chose to user an ORM for Javascript. After a bit of research I chose [sequelize](http://docs.sequelizejs.com/) because it is promise-based and it has built in migrations support. I also added logging and config libraries to the project, after some research I decide for [winston](https://github.com/winstonjs/winston) for logging since it supports rotating file logs out of the box. For config I used [nconf](https://github.com/indexzero/nconf) as it allows to retrieve config parameters from config files, environment variables, run parameters and also easily have different environment configs (sandbox, production, etc).

#### Internal architecture:
I separated 2 layers: the API and the Engine. The API is just a dumb presentation layer with no logic that only publishes endpoints to access data and operations.

Inside the API there is a separation of endpoints and controllers. Endpoints only define available operations and their constraints, no logic whatsoever. The controller is just a wrapper to access the business logic that lives inside the Engine, if there was a need to add some API-only logic it would go here rather than in the endpoints.

The Engine is currently accessed by the API as loaded classes but could also be separated to run on a different machine if needed and be accessed via an RPC mechanism.

Engine code was separated into: models, validators and data-store. Right now there is not much logic besides data validation but if there were then this layer is where logic would reside.

#### Api:
Express gives you total freedom on creating your endpoint paths. So I created the base path as `/api/v1/` to allow having different versions in the future easily distinguished.

For the Feedback creation endpoint the sessionId was required to be part of the path. Usually the hierarchical part of the path will tell you the resource you are acting on so for instance using `/api/v1/feedback/{param}` for creation could be confused as the param being the feedbackId instead of the sessionId. So I decided to maintain `/api/v1/feedback/{param}` to act upon a Feedback and `/api/v1/session/{param}` to act upon a Session, and therefor for the Feedback creation endpoint used `/api/v1/feedback/create/{string-param}`. The required parameters "rating" and "comment" are expected to be part of the body payload. The "Ubi-UserId" can be sent either in the body or as an Http header parameter as requested in the exercise instructions.

For retrieving Feedbacks I maintained the above explained path usage and used `/api/v1/feedback/find?limit={}&rating={}` accepting query strings for filters for the search.

#### Database:
I chose to use a relational database, and MySql was an easy choice since it's lightweight and has good performance. For the sake of this exercise the Feedabcks table could have been enough but to mimic a more realistic pre-existing database I created the following 3 tables where Sessions and Users have their own tables with more properties/columns:

<img src="https://raw.githubusercontent.com/sapeish/user-feedback/master/docs/user-feedback-db-design.png" alt="Database relational diagram" width="300px">

All tables have createdAt and updatedAt columns which help when there is a need to audit history about an entry. Extra columns in Sessions (gameId, startDate, endDate) and User (email, nickname) are not needed for this exercise, I added them just to illustrate a more realistic pre-existing database.

Id for Sessions and Users where defined as strings to allow complex Ids that could intrinsically give useful information at hand like for instance `ses-20181201-watchdogs2-23331` instead of just numeric Ids.

Feedbacks table has a numeric auto-incremental Id managed by the database. Rating is defined as an ENUM that allows only values of 1,2,3,4,5 so we have validation in the app but we can also rely on the database's validation.

Since I am using SequielizeJs all the queries are built by the ORM and I had no need to manually write them. Whenever there is a situation that the autogenerated query is identified as not performing enough the ORM allows you to write your own queries as well.

#### Migrations:
I added database migrations to illustrate how useful they are when needing to change a database in production and keeping track of the changes. At the folder `/datastore/migrations` there are 3 migrations which are automatically ran when the app starts for the first time and the database is to be created. The table SequelizeMeta is automatically created by the ORM to track the migrations already executed in this MySql instance.

I also created 2 helpful scripts:
* `./database/gen-migration.sh` will create a new migration comparing the state of the last migration and a current modified state of the models. For instance useful after adding a column to Feedbacks at `/engine/models/feedback.js`
* `./database/run-migrations.sh` will run all the migrations that were still not ran in the database.

#### Performance:
For this solution to have good performance I believe the most critical focus is on storage and data filtering. Since rating filtering is expressly required I would add an index in the "rating" column of the Feedbacks table to increase performance on the search query if needed.

## Code Documentation
I documented a few classes as sample, for instance the class [MySqlDS.js](https://github.com/sapeish/user-feedback/blob/master/engine/datastore/mysqlDS.js). I used Javadoc style comments that later can be used to generate a documentation page using tools like [JSDoc](http://usejsdoc.org/).
