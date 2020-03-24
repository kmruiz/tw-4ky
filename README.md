four key metrics
=================

### Deployment Frequency

Number of times there has been a deploy through time. (Weekly, Monthly, every 5min)

### Lead Time For Changes

Time that is spent between code is committed and is deployed to production. (2h, 1 day)

### Mean Time To Recovery

Time between a failure and the subsequent recovery.  (failure = incident, and recovery)

### Change Failure Rate

Ratio between succesfull and failed deployments. (25%, 50%, 75%)

Preparing the Development Environment
-------------------------------------

The development environment is quite complex, as it requires:

* A Jenkins
* A SQL database
* A Graphite (or other statsd server)
* A Grafana (or other visualizer)

However, those steps are thought to prepare the environment with a premade docker-compose.

### Prepare the .dev folder

This will contain all the information of your development environment and it's ignored on git.

```sh
$> mkdir .dev
```

### Create a local SQLite database

To create the SQLite database with all the tables needed, there is a npm script that will run the migrations using knex. First, install all the npm dependencies specified in the package.json:

```sh
$> npm install
```

And then run the migration script:

```sh
$> npm run migration:apply
```

### Start the external dependencies (Jenkins, Graphite and Grafana)

All the dependencies are in the docker-compose.yml file, living in the root folder of the project. To instantiate them, just start the docker-compose:

```sh
$> docker-compose up
```

### Configuring Grafana

Grafana will be listening to the port 8082 in your machine, so navigate to:

`http://localhost:8082`

This will ask you for a login, in Grafana, the default login is `admin/admin`. Grafana will be asking after the first login for new credentials: put whatever is comfortable for you. It's a dockerized development environment after all and it doesn't contain critical information.

After logging in, go to `Add Data Source`, choose `Graphite`, and fill the information as this:

| Field | Value |
|-------|-------|
|URL|http://graphite.service|

And that's it.

Press `Save & Test` and everything should be working. Now you can create dashboards in Grafana using the information from Graphite.

### Configuring Jenkins

Jenkins will take a few minutes to start, but it will be available on:

`http://localhost:8080/`

When Jenkins is available, you'll see a form where you need to write your administrator password. The administration password will be stored on:

`.dev/jenkins_home/secrets/initialAdminPassword`

Provide it and press `Continue`.

It will ask which plugins you would like to install, I suggest to install suggested plugins (the first option) so you can play later with Jenkins and different types of tasks.

It will take some time (around 5min-10min), so be patient, it's installing a lot of things.

After that, Jenkins will ask you to create a new user. Do as you wish, this is for login purpouses and doesn't affect the installation.

I suggest to continue with the administrator user as it's a local installation.

#### Testing the Jenkins Integration

Jenkins APIs use Basic Authentication to authenticate clients. You can test your Jenkins integration creating a new job named `test-pipeline` through the UI.

Later, encode your credentials (as admin:password) using base64. For example with the following credentials:

`admin:password`

The base64 will look like:

`YWRtaW46cGFzc3dvcmQ=`

---

**Note**

There are online encoders for base64 online, like [this one](https://www.base64encode.org/). You can use it for non critical content. In this case, it's fine, as they are not production credentials.

---

Now you can use the base64 in the example test request that is living in [the Jenkins.example.http file](test/resources/Jenkins.example.http) changing the Authorization header.