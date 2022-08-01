const {Schema, model} = require('mongoose');

const MediaTopicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'image', 'audio'],
    default: 'video',
  },
  subType: {
    type: String,
    enum: ['recipes', 'audio', 'video', 'other'],
    default: 'other',
  },
  categoryId: {
    type: String,
    required: true,
  },
  groupSeries: {
    type: Boolean,
    default: false,
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

const MediaTopicModel = model("MediaTopic", MediaTopicSchema);
module.exports = MediaTopicModel

