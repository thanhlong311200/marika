const {Schema, model} = require('mongoose');

const MyProgramSchema = new Schema({
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
})

const MyProgram = model("MyProgram", MyProgramSchema);
module.exports = MyProgram
