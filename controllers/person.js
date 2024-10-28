const { v4: uuidv4 } = require("uuid");

const AppError = require("../utils/appError");

let persons = global.db;

// GET /person - get all persons
exports.getPersons = async (req, res, next) => {
  try {
    return res.status(200).json(persons);
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
//GET /person/:personId - get person endpoint
exports.getPerson = async (req, res, next) => {
  try {
    const { personId } = req.params;

    if (personId) {
      const person = persons.find((p) => p.id === personId);
      if (person) {
        return res.status(200).json(person);
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Person not found",
        });
      }
    }
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
// POST /person - Create a new person
exports.addPerson = async (req, res, next) => {
  try {
    const { name, age, hobbies } = req.body;

    // Validate input data
    const validationErrors = [];

    // Validate name
    if (!name) {
      validationErrors.push("Name is required");
    } else if (typeof name !== "string") {
      validationErrors.push("Name must be a string");
    }
    // Validate age
    if (age === undefined) {
      validationErrors.push("Age is required");
    } else if (typeof age !== "number") {
      validationErrors.push("Age must be a number");
    }

    // Validate hobbies
    if (!Array.isArray(hobbies)) {
      validationErrors.push("Hobbies must be an array");
    } else if (
      hobbies.length > 0 &&
      !hobbies.every((hobby) => typeof hobby === "string")
    ) {
      validationErrors.push("Hobbies must be an array of strings");
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: validationErrors,
      });
    }

    // Create new person object
    const newPerson = {
      id: uuidv4(),
      name,
      age,
      hobbies,
    };

    persons.push(newPerson);

    res.status(200).json({
      status: "success",
      data: {
        newPerson,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /person/:personId - Update an existing person
exports.updatePerson = async (req, res, next) => {
  try {
    const { personId } = req.params;
    const { name, age, hobbies } = req.body;

    const personIndex = persons.findIndex((p) => p.id === personId);
    if (personIndex === -1) {
      return next(new AppError("Person not found", 404));
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
};

// DELETE /person/:personId - Delete a person
exports.deletePerson = async (req, res, next) => {
  try {
    const { personId } = req.params;
    if (!personId) {
      return next(new AppError("Id is required", 400));
    }
    const personIndex = persons.findIndex((p) => p.id === personId);

    if (personIndex === -1) {
      return next(new AppError("Person not found", 404));
    }

    const deletedPerson = persons.splice(personIndex, 1)[0];
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
