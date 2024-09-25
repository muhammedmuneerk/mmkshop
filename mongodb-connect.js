// const { MongoClient } = require('mongodb');
// const state={
//   db:null
// }
// // MongoDB Atlas connection string
// const uri = 'mongodb+srv://shopping:2JKdYJ2jEEkPanoB@cluster0.18rqatc.mongodb.net/?retryWrites=true&w=majority';

// // Create a new MongoClient
// const client = new MongoClient(uri);

// async function connectToMongoDB(done) {
//   try {
//     // Connect to MongoDB Atlas
//     await client.connect();
//     console.log('Connected to MongoDB Atlas');
//     const dbname = client.db('shopping'); // Specify the database name
//     done(db, dbname); // Pass the database object to the callback
//   } catch (err) {
//     console.error('Error connecting to MongoDB Atlas', err);
//     done(err); // Pass the error to the callback
//   }
// }

// module.exports = connectToMongoDB;
// const { MongoClient } = require('mongodb');

// const uri = 'mongodb+srv://shopping:2JKdYJ2jEEkPanoB@cluster0.18rqatc.mongodb.net/?retryWrites=true&w=majority';

// async function connectToMongoDB(done) {
//   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//   try {
//     await client.connect();
//     console.log('Connected to MongoDB Atlas');
//     const db = client.db('shopping'); // Get the database object
//     done(null, db); // Pass the database object to the callback
//   } catch (err) {
//     console.error('Error connecting to MongoDB Atlas', err);
//     done(err); // Pass the error to the callback
//   }
// }

// module.exports = connectToMongoDB;
