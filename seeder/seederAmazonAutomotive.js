/***

 For bulk uploading -> node seederAmazonProduct -import
 For bulk deleteing -> node seederAmazonProduct -delete

 Make sure in seeder directory.
 ***/

const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: '../config/config.env' });

// Load models
const AmazonAutomotive = require('../models/AmazonAutomotive');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const amazonAutomotive = JSON.parse(
  fs.readFileSync(`../_data/amazonAutomotive.json`, `utf-8`),
);

// import all the data into the database
const importData = async () => {
  try {
    await AmazonAutomotive.create(amazonAutomotive);
    console.info('Data was imported'.green.inverse);
  } catch (error) {
    console.error('There was an error', error);
  }
  process.exit();
};

// delete all data
const deleteData = async () => {
  try {
    await AmazonAutomotive.deleteMany();
    console.info('Data was deleted from db'.green.inverse);
  } catch (error) {
    console.error('There was an error', error);
  }
};

if (process.argv[2] === '-import') {
  importData();
}

if (process.argv[2] === '-delete') {
  deleteData();
}
