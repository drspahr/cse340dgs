/* ***************************
 * Inventory route file for all 
 * handling
 * **************************/
// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation");

// Route to build inventory by classificatioin view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build the detail view page
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
// Route to build the Vehicle Management view
router.get("/", utilities.handleErrors(invController.buildManage));
// Route to build the Add Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClass));
// Route to build the Ad Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));
// Route to get the data for inventory list
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// Route to build Edit Inventory
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInv));
// Route to build Delete 
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteView));

// Route to post to database
router.post("/add-classification", 
    regValidate.classificationRules(),
    regValidate.checkClassData,
    utilities.handleErrors(invController.addNewClass));

router.post("/add-inventory", 
    regValidate.inventoryRules(),
    regValidate.checkInvData,
    utilities.handleErrors(invController.addNewInv));

// Route to update inventory
router.post("/update/", 
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

router.post("/delete/", utilities.handleErrors(invController.deleteVehicle));

module.exports = router;