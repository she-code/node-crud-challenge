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
const AppError = require("./utils/appError");
// app.get("/person", (req, res) => {
//   try {
//     // Return the entire array if no specific person is searched for
//     const person = persons;
//     if (person) {
//       return res.status(200).json({
//         status: "success",
//         message: "Data retrieved successfully",
//         data: person,
//       });
//     }
//   } catch (error) {
//     console.log({ error });
//     return res.status(500).json({
//       status: "fail",
//       message: "Error retrieving data",
//     });
//   }
// });
// app.get("/person/:id", (req, res) => {
//   try {
//     let id = req.params.id;
//     const person = persons.find((data) => data.id == id);
//     if (!person) {
//       return res.status(404).json({
//         status: "fail",
//         message: "User not found",
//         data: {},
//       });
//     }
//     return res.status(200).json({
//       status: "success",
//       message: "Data retrieved successfully",
//       data: person,
//     });
//   } catch (error) {
//     console.log({ error });
//     return res.status(500).json({
//       status: "fail",
//       message: "Error retrieving data",
//     });
//   }
// });
// GET /person - Retrieve all persons
// GET /person/:personId - Retrieve person by ID
app.get("/person/:personId?", (req, res, next) => {
  try {
    const { personId } = req.params;
    let Person = app.get("db");
    console.log({ Person });
    if (personId) {
      const person = persons.find((p) => p.id === personId);
      if (person) {
        return res.status(200).json({
          status: "success",
          data: person,
        });
      } else {
        // return res.status(404).json({
        //   status: "fail",
        //   message: "Person not found",
        // });
        return next(new AppError("Person not found", 404));
      }
    }

    return res.status(200).json({
      status: "success",
      data: persons,
    });
  } catch (error) {
    console.error(error);

    return next(error);
  }
});

// POST /person - Create a new person
app.post("/person", (req, res, next) => {
  try {
    const { name, age, hobbies } = req.body;

    if (!name || typeof age !== "number" || !Array.isArray(hobbies)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
      });
    }

    const newPerson = {
      id: uuidv4(),
      name,
      age,
      hobbies,
    };

    persons.push(newPerson);
    res.status(201).json({
      status: "success",
      data: newPerson,
    });
  } catch (error) {
    return next(error);
  }
});

// PUT /person/:personId - Update an existing person
app.put("/person/:personId", (req, res, next) => {
  try {
    const { personId } = req.params;
    const { name, age, hobbies } = req.body;

    const personIndex = persons.findIndex((p) => p.id === personId);
    if (personIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Person not found",
      });
    }

    if (!name || typeof age !== "number" || !Array.isArray(hobbies)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
      });
    }

    persons[personIndex] = { ...persons[personIndex], name, age, hobbies };
    res.status(200).json({
      status: "success",
      data: persons[personIndex],
    });
  } catch (error) {
    return next(error);
  }
});

// DELETE /person/:personId - Delete a person
app.delete("/person/:personId", (req, res) => {
  try {
    const { personId } = req.params;
    const personIndex = persons.findIndex((p) => p.id === personId);

    if (personIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Person not found",
      });
    }

    const deletedPerson = persons.splice(personIndex, 1)[0];
    res.status(200).json({
      status: "success",
      data: deletedPerson,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// Handle non-existing endpoints
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Resource not found",
  });
});
app.use(globalErrorHandler);
if (require.main === module) {
  app.listen(3000);
}
module.exports = app;
