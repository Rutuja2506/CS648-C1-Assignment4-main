/* eslint-disable no-unused-vars */
/* eslint no-restricted-globals: "off" */

require('dotenv').config();

const fs = require('fs');
const express = require('express');

const app = express();
const { ApolloServer } = require('apollo-server-express');
const { kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://Rutuja:California@2506@cluster0.cxjqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
let db;
const port = process.env.API_SERVER_PORT || 3000;


async function productlist() {
  // return ProdDB;
  const products = await db.collection('products').find({}).toArray();
  return products;
}
async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}
async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}
async function addprod(_, { product }) {
  const newProduct = Object.assign({}, product);
  newProduct.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(newProduct);
  const savedproduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedproduct;
}
const resolvers = {
  Query: {
    productlist,
  },
  Mutation: {
    addprod,
  },

};
const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });
// eslint-disable-next-line func-names
(async function () {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());