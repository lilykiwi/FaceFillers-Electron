# FaceFillers-Electron

For my 2019-2020 Computing HNC, one task involved creating an application with a Graphical User Interface (GUI), SQL Clauses, and a Relational SQL Database.

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
