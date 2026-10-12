require('dotenv').config();
require('./validateDatabaseConfig')();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  dialectOptions: process.env.DB_SSL === 'true'
    ? { ssl: { rejectUnauthorized: true } }
    : {},
  logging: false
};

module.exports = {
  development: common,
  test: common,
  production: common
};
