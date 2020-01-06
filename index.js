require("dotenv").config();

const CommitHandler = require("./src/CommitHandler");
const DatamineBot = require("./src/bot");
const Database = require("./src/Database");
const sendCommits = require("./src/sendCommits");

DatamineBot.on("ready", async () => {
  Database();
  console.log("Connected to Discord.");
  async function loop() {
    await CommitHandler();
    await sendCommits(DatamineBot);
  }
  await loop();
  setInterval(loop, 50000);
});

DatamineBot.login(process.env.TOKEN);
