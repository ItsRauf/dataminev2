const { connect, connection } = require("mongoose");

module.exports = () => {
  connect(process.env.DBURI, {
    dbName: process.env.DBNAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  connection.on("error", console.error.bind(console, "Connection error:"));
  connection.once("open", () => {
    console.log("Connected to Database.");
  });
  return connection
}