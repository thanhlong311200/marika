function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing the change stream");
      changeStream.close();
      resolve();
    }, timeInMs)
  })
}

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []) {
  try {
    const dbName = process.env.DATABASE_NAME || "marikaday";
    // watch users
    // const collectionUser = client.db(dbName).collection("users");
    // const changeStreamUser = collectionUser.watch(pipeline);
    // changeStreamUser.on('change', (data) => {
    //   console.log("Users change:", data);
    // });
    // watch Payments
    const collectionPayments = client.db(dbName).collection("payments");
    const changeStreamPayments = collectionPayments.watch(pipeline);
    changeStreamPayments.on('change', (data) => {
      console.log('Payments change: ', data);
    });
    // watch Tracking
    const collectionTracking = client.db(dbName).collection("trackings");
    const changeStreamTracking = collectionTracking.watch(pipeline);
    changeStreamTracking.on('change', (data) => {
      console.log('Tracking change: ', data);
    });
    // watch QA
    const collectionQuestion = client.db(dbName).collection("questionanswers");
    const changeStreamQuestion = collectionQuestion.watch(pipeline);
    changeStreamQuestion.on('change', (data) => {
      console.log('Question change: ', data);
    });
    // watch Promo
    const collectionPromo = client.db(dbName).collection("promocodes");
    const changeStreamPromo = collectionPromo.watch(pipeline);
    changeStreamPromo.on('change', (data) => {
      console.log('Promo change: ', data);
    });
    console.log("Monitor Listings Using Event Emitter....")
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = {
  monitorListingsUsingEventEmitter,
}
