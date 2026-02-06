# Backend MiAwor
Created this project to do a backend to MiAwor Mobile and Web(admin) <br/>
Using NodeJs with multer, mysql, sequelize
## Goals
- Learn how to receive an image, save and send it to frontend
- Learn how to use Sequelize to manipulate the DB(database)

## To do
- Improve endpoint organization

## Connecting project to mysql
```
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
```

## Running
### Install the dependences
`npm install`
### Run the project
`npm start`
