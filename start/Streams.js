const ENV = require('../utils/Env');
const {MongoClient} = require("mongodb");
const {monitorListingsUsingEventEmitter} = require("../watchs/changeStreams");
const uri = ENV.get("DATABASE_URI", '');

const Streams = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    await monitorListingsUsingEventEmitter(client);
    console.log("Watch database success !")
  } catch (e) {
    console.log("Watch error:", e)
  } finally {
  }
};
module.exports = Streams;
