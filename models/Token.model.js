const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const tokenSchema = new Schema({
  userId: String,
  uidToken: String,
  isRevoke: Boolean,
  createdAt: Number,
  updatedAt: Number
}, {collection: 'tokens'});

module.exports = mongoose.model('Tokens', tokenSchema)
