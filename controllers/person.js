const AppError = require("../utils/appError");
let persons = global.db;

exports.getPersons = async (req, res, next) => {
  try {
    const { personId } = req.params;
    if (personId) {
      const person = persons.find((p) => p.id === personId);
      if (person) {
        return res.status(200).json({
          status: "success",
          data: person,
        });
      } else {
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
};
// POST /person - Create a new person
exports.addPerson = async (req, res, next) => {
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
};

// PUT /person/:personId - Update an existing person
exports.updatePerson = async (req, res, next) => {
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
};

// DELETE /person/:personId - Delete a person
exports.deletePerson = async (req, res, next) => {
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
      data: null,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
