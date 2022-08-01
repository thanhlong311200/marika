const {Schema, model} = require('mongoose');

const MembershipTypeSchema = new Schema({
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

const MembershipTypeModel = model("MembershipsType", MembershipTypeSchema);
module.exports = MembershipTypeModel
