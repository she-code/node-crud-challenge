const express = require("express");
const route = express.Router();
const personController = require("../controllers/person");
route.get("/person", personController.getPersons);

module.exports = route;
