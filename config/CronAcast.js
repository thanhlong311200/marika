const ENV = require("../utils/Env");
const axios = require("axios");
const Media = require("../models/Media.model");
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;

const ACAST_URL = ENV.getOrFail("A_CAST_URL");
const ACAST_KEY = ENV.getOrFail("A_CAST_KEY");
const ACAST_SHOW_ID = ENV.getOrFail("A_CAST_SHOW_ID");
const acast_uri = `${ACAST_URL}/shows/${ACAST_SHOW_ID}/episodes`
const URI_DB = ENV.get("DATABASE_URI", '');

const getACast = () => {
  return new Promise((resolve, reject) => {
    const headers = { "x-api-key": ACAST_KEY };
    axios.get(acast_uri, {headers})
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const handleAcast = async () => {
  console.log("====== start ======");
  const db = await mongoose.connect(URI_DB);
  try {
    const data = await getACast();
    if(!data) {
      await Media.remove({"type": "audio"});
      return;
    }
    const listAudio = await Media.find({"type": "audio"});
    const array = [];
    for (let audio of listAudio) {
      const audioId = audio._doc._id.toString();
      const idx = data.findIndex(val => val._id === audioId);
      if(idx === -1) {
        await Media.findByIdAndDelete(audio._id);
        continue;
      }
      const media = {
        "_id": data[idx]._id,
        "name": data[idx].title,
        "type": "audio",
        "status": data[idx].status,
        "description": data[idx].subtitle,
        "detailInfo": data[idx].summary,
        "subtype": data[idx].type,
        "urlFile": data[idx].audio,
        "acast": data[idx],
      }
      const id = media._id;
      delete media._id;
      await Media.findByIdAndUpdate(id, media);
    }
    for (let item of data){
      const idx = listAudio.findIndex(val => val._doc._id.toString() === item._id);
      if(idx > -1) continue;
      const media = {
        "_id": item._id,
        "name": item.title,
        "type": "audio",
        "status": item.status,
        "description": item.subtitle,
        "detailInfo": item.summary,
        "subtype": item.type,
        "urlFile": item.audio,
        "acast": item,
      }
      array.push(media);
    }
    if(array.length === 0) return;
    await Media.create(array);
  } catch (e) {
    console.log(e);
  } finally {
    await db.disconnect();
    console.log("====== start ======");
  }
}

const job = new CronJob('0 */2 * * * *', handleAcast);
job.start();
