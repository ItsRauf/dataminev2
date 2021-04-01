require("dotenv").config();

const CommitHandler = require("./src/CommitHandler");
const DatamineBot = require("./src/bot");
const Database = require("./src/Database");
const sendCommits = require("./src/sendCommits");
const getLatestCommit = require("./src/getLatestCommit");

DatamineBot.on("ready", async () => {
  Database();
  console.log("Connected to Discord.");
  try {
    DatamineBot.user.setActivity({
      name: `${
        (await getLatestCommit()).title.split("-")[1].trim().split(" ")[0]
      }.js`,
      type: "WATCHING",
    });
  } catch (err) {
    console.error(err);
  }
  await sendCommits(DatamineBot);
  await CommitHandler();
  setInterval(CommitHandler, 60000);
});

DatamineBot.login(process.env.TOKEN);

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);
