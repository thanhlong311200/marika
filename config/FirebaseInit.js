const admin = require("firebase-admin");
const ENV = require("../utils/Env");
const path = ENV.getOrFail("FIREBASE_AUTH_PATCH");
// const serviceAccount = require(`${path}`);

// admin.initializeApp({
//   credential: admin.credential.cert(undefined, undefined)
// });

module.exports = admin
