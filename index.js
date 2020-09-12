require("dotenv").config();

const CommitHandler = require("./src/CommitHandler");
const DatamineBot = require("./src/bot");
const Database = require("./src/Database");
const sendCommits = require("./src/sendCommits");
const getLatestCommit = require("./src/getLatestCommit");

DatamineBot.on("ready", async () => {
  Database();
  console.log("Connected to Discord.");
  DatamineBot.user.setActivity({
    name: `${(await getLatestCommit()).title.substr(19, 20)}.js`,
    type: "WATCHING",
  });
  await sendCommits(DatamineBot);
  await CommitHandler();
  setInterval(CommitHandler, 60000);
});

DatamineBot.login(process.env.TOKEN);

process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);
