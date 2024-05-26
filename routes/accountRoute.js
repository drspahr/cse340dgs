/* **************************************
 * Account route file for account login
 * *************************************/
// Resources needed
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post("/login", 
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin));

// Route top  build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Route to process registration
router.post(
    "/registration", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

// Route to build account managment view
router.get("/", utilities.checkLogin,utilities.handleErrors(accountController.buildManagement));

// Route to build update view
router.get("/update/:accountId", utilities.handleErrors(accountController.buildAccountUpdateVeiw));
// Route to update account user information
router.post("/update", 
    regValidate.updateRules(),
    regValidate.checkUpData,
    utilities.handleErrors(accountController.updateAccount));

router.post("/pass", 
    regValidate.updatePassRules(),
    regValidate.checkPassData,
    utilities.handleErrors(accountController.updatePassword));

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;