/* **********************************
 * Error route file for error link
 * *********************************/
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const errorController = require("../controllers/errorController");

// Route to build error view
router.get("/error", utilities.handleErrors(errorController.buildErrorView));

module.exports = router;