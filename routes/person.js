const express = require("express");
const route = express.Router();
const personController = require("../controllers/person");
route.get("/:personId?", personController.getPersons);
route.put("/:personId", personController.updatePerson);
route.delete("/:personId", personController.deletePerson);
route.post("/", personController.addPerson);

module.exports = route;
