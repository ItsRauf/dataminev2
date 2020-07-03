const mongoose = require("mongoose");

const CommitSchema = new mongoose.Schema({
  buildNumber: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: false,
  },
  user: {
    username: { type: String, required: true },
    id: { type: Number, required: true },
    avatarURL: { type: String, required: true },
    url: { type: String, required: true },
  },
});

const Commit = mongoose.model("Commits", CommitSchema);

module.exports = Commit;
