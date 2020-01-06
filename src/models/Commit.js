const mongoose = require('mongoose');

const CommitSchema = mongoose.Schema({
  buildNumber: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    required: false
  }
});

const Commit = mongoose.model('Commits', CommitSchema);

module.exports = Commit;