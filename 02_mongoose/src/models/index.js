import mongoose from 'mongoose';
import MongoDB from 'mongodb';

import { DB_ADDRESS, DB_NAME, DB_PORT } from '../config/db';

// This will expose DB and connection to consumers
let connection;
let db;

/**
 * Connects to the database and mutates connection
 * It's usually not a good idea, but simplifies access to asynchronous DB connection
 */
const connectToDB = async () => {
  const url = `mongodb://${DB_ADDRESS}:${DB_PORT}`;
  const { MongoClient } = MongoDB;

  console.log('Connecting to dabaser using MongoDB adapter ...');
  connection = await MongoClient.connect(url, { useUnifiedTopology: true });
  console.log('Connected.');
  db = connection.db(DB_NAME);

  return connection;
};

const connectToMongoose = async () => {
  const url = `mongodb://${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`;
  console.log('Connecting to dabaser using mongoose ...');
  await mongoose.connect(url, { useNewUrlParser: true });
  console.log('Connected.');
  return mongoose.connection.db;
};


export { connectToMongoose, connectToDB, connection, db };

export default {
  connectToMongoose,
  connectToDB,
  connection,
  db,
};
