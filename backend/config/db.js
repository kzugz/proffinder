/**
* Database Connection Module
* --------------------------
* This module establishes a connection to MongoDB using Mongoose.
* It exports an async function `connectDB` that connects using the URI defined
* in the environment variables.

* Dependencies:
* - mongoose
* - process.env.MONGO_URI (environment variable)
*/

import mongoose from "mongoose";

/**
Connects to the MongoDB database.
Logs success or failure and exits the process on error.
*/
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    // Exit the Node.js process if the database connection fails
    process.exit(1);
  }
};

export default connectDB;