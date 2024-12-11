const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const DB = process.env.DATABASE

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 1300;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

