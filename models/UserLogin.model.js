const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const UsersLoginSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: false},
  roles: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  membershipExp: String,
  status: {
    type: Boolean,
    default: true
  },
  isFirebase: Boolean,
  isGoogle: Boolean,
  isFacebook: Boolean,
  isDelete: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, {collection: 'users'});

const UsersLogin = mongoose.model("Users", UsersLoginSchema);
module.exports = UsersLogin
