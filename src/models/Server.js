const mongoose = require('mongoose');

const ServerSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  }
});

const Server = mongoose.model('Servers', ServerSchema);

module.exports = Server;