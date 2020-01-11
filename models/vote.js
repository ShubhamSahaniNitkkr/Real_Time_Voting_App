const mongoose = require("mongoose");
const VSchema = mongoose.Schema({
  stack: {
    type: "string",
    require: true
  },
  points: {
    type: "string",
    require: true
  }
});

const Vote = mongoose.model("Vote", VSchema);
module.exports = Vote;
