const express = require("express");
// const { v4: uuidv4 } = require("uuid");

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const globalErrorHandler = require("./controllers/errorController");
let persons = [
  {
    id: "1",
    name: "Sam",
    age: "26",
    hobbies: [],
  },
]; //This is your in memory database
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("db", persons);
global.db = persons;

//TODO: Implement crud of person
const personRoute = require("./routes/person");
app.use("/person", personRoute);

// Handle non-existing endpoints
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Page not found",
  });
});
app.use(globalErrorHandler);
if (require.main === module) {
  app.listen(3000);
}
module.exports = app;
