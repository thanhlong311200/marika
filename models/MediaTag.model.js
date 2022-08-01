const {Schema, model} = require('mongoose');

const MediaTagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: String,
  topicId: String,
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

const MediaTagModel = model("MediaTag", MediaTagSchema);
module.exports = MediaTagModel
