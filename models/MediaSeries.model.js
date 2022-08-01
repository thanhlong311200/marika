const {Schema, model} = require('mongoose');

const MediaSeriesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const MediaSeriesModel = model("MediaSeries", MediaSeriesSchema);
module.exports = MediaSeriesModel
