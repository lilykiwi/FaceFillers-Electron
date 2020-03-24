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

This project requires a MySQL database service to be running on the system, configured in a specific way. I personally used MariaDB, so any analogous database utility should function perfectly. The setup is available here: [mysql.md](mysql.md).
