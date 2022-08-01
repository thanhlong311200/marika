const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const CampaignSchema = new Schema({
  name: {type: String, required: true},
  start: {type: String, default: null},
  end: {type: String, default: null},
  idsMembership: Array,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, {collection: 'campaign'});

const Campaign = mongoose.model("campaign", CampaignSchema);
module.exports = Campaign
