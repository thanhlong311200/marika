const {Schema, model} = require('mongoose');

const MediaSchema = new Schema({
  userId: String,
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'image', 'audio'],
    default: 'video',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft',
  },
  categoryId: String,
  tagIds: [String],
  seriesId: Schema.ObjectId,
  episode: Number,
  topicId: String,
  urlFile: {
    type: String,
    required: true,
  },
  mp4Link: String,
  subtype: {
    type: String,
    enum: ['full', 'trailer', 'bonus'],
  },
  thumbnail: String,
  thumbnailMobile: String,
  description: String,
  detailInfo: String,
  acast: {},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});
// +tag
// +series
// +episode
const Media = model("Media", MediaSchema);
module.exports = Media
