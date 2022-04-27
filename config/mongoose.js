const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csv_upload');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'ERROR CONNECTING TO DATABASE...'));
db.once('open', () => {
  console.log('Successfully connected to database');
});
module.exports = db;