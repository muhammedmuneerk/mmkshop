const { MongoClient } = require('mongodb');

const state = {
  db: null,
};

module.exports.connect = async function (done) {
  console.log('Loaded MONGO_URI:', process.env.MONGO_URI); // Log to verify if MONGO_URI is loaded
  const url = process.env.MONGO_URI; // Directly use the environment variable
  const dbname = 'shopping';

  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    state.db = client.db(dbname);
    done(); // Call done() after a successful connection
  } catch (err) {
    done(err); // Pass the error to done() if something goes wrong
  }
};

module.exports.get = function () {
  return state.db;
};
