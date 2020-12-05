const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const CONSTANTS = require('./constants');
const connectToMongo = require('./config/db');

const PORT = CONSTANTS.PORT || 4000;
const app = express();
connectToMongo();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to Environment-Server!');
});
app.use('/env', require('./env/env.routes'));

// App start
app.listen(PORT, () =>
  console.log(`Environment Server listening on port ${PORT}`),
);
