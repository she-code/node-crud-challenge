const app = require("../index");
// let Person = app.get("db");

exports.getPersons = async (req, res, next) => {
  try {
    const { personId } = req.params;
    let Person = global.db;
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
};
