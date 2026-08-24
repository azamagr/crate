const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

// Runs once before any test file's tests start.
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

// Runs after every individual test, so tests never see leftover data
// from a previous test — each test starts with a clean, empty database.
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Runs once after all tests in a file finish.
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
