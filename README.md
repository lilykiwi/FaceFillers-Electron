![FaceFillers](img/preview.png)

For my 2019-2020 Computing HNC, one task involved creating an application with a Graphical User Interface (GUI), SQL Clauses, and a Relational SQL Database. This is a mockup design for a mobile food aggregator app, which performs database functions in order to gather and process data. It's developed in using Electron, making it similar to a webpage, allowing for easy conversion into an online app or mobile app.

This project doesn't have any future goals outside of refactoring the javascript already implemented (see [courier-controller.js](js/courier-controller.js) for how it should look). This is because the scope of the project was just to implement a database system with a user interface, without any "true" functionality like server hosting, database discovery, login systems, GPS tracking, etc, that you would expect to find in a food aggregator. Similarly, this doesn't use "real" data, instead utilising [fake SQL data](sqlscript) that functions inside the constraints of the app.

[store-controller-revamp.js](js/store-controller-revamp.js) is currently unfinished, but aims to replace the original store controller script in functionality while cleaning up the code significantly.

This project (currently) utilises:

- [NodeJS (^10.15.2)](https://github.com/nodejs/node)
- [MariaDB (^10.3)](https://mariadb.com/downloads)

With the npm packages through `npm install`:

- [Electron (^8.0.3)](https://www.npmjs.com/package/electron)
- [electron-packager (^14.2.1)](https://www.npmjs.com/package/electron-packager)
- [electron-reload (^1.5.0)](https://www.npmjs.com/package/electron-reload)
- [mysql (^2.18.1)](https://www.npmjs.com/package/mysql)
- [octicons (^8.5.0)](https://www.npmjs.com/package/@primer/octicons)

## Building

Since this uses NodeJS, building requires utilisation of the Node Package Manager (NPM). Future plans involve integrating [electron-packager](https://github.com/electron/electron-packager) for building, but in the testing phase this command should be used instead:

```shell
npm start
```

## Database Integration

In order to set up the database for use with this application, you need [MariaDB (^10.3)](https://mariadb.com/downloads) in order to host the database as a service. I use apt to install it, so I'm a version behind at the time of writing. After install, make sure that the service is running and run the client using sudo (or equivalent) and run (or copy/paste) the following script:

[plaintext SQL script](sqlscript)

This script will create the database, user, tables, and enter some data. That's all you need to get started!
