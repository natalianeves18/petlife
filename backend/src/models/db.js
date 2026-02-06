const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DB_NAME || "petlife";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "1234";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
});

sequelize.authenticate().then(() => {
    console.log("Conexão feita com sucesso")
}).catch(() => {
    console.log("Erro ao conectar ao banco")
})
module.exports = sequelize;
