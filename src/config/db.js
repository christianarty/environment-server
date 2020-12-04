const mongoose = require('mongoose');
const CONSTANTS = require('../constants');

const { DB_CONNECTION_URL } = CONSTANTS;

async function createConnection() {
  try {
    await mongoose.connect(DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('DB Connection successful');
  } catch (error) {
    console.error(error);
  }
}

module.exports = createConnection;
