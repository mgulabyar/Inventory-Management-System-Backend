const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully")
  } catch (error) {
    console.error(`Database Connection Error`);
    process.exit(1);
  }
};

module.exports = connectDB;
