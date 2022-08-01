const {Schema, model} = require('mongoose');

const MediaCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'image', 'audio'],
    default: 'video',
    required: true
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

const MediaCategoryModel = model("MediaCategory", MediaCategorySchema);
module.exports = MediaCategoryModel
