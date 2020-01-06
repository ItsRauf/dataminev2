const Commit = require("./models/Commit");

module.exports = function getLatestCommit() {
  return Commit.findOne().sort("-buildNumber");
};
