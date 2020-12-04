require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL,
};
