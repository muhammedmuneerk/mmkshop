const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

let db;

const connect = async () => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(); // Make sure you're assigning db correctly
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

const get = () => db;

module.exports = { connect, get };
