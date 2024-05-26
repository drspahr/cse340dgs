const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* ***********************************************
 * Classification Validation and Check for errors
 * **********************************************/
validate.classificationRules = () => {
    return [
        // Must contain alphabet characters only
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("Classification Name")
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("./inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
}

/* ***********************************************
 * Inventory Validation and Check for errors
 * **********************************************/
validate.inventoryRules = () => {
    return [
        // Vehicle Make is required and must not be empty
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make"),

        // Vehicle Model is required and must not be empty
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Model"),

        // Vehicle Year is required and must not be empty and must be four numbes
        body("inv_year")
            .trim()
            .escape()
            .isNumeric()
            .notEmpty()
            .withMessage("Year"),

        // Vehicle Description is required and not be empty
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description"),
        
        // Images is required and not empty
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Image"),

        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Thumbnail"),

        // Price is require and not empty, is numeric
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Price"),

        // Miles is required and not empty, is numeric
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Miles"),

        // Color is required and not empty
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color"),
    ]
}

validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList();
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
        });
        return;
    }
    next();
}

// Errors to be directed back to the edit view
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList();
        res.render("./inventory/edit-inventory", {
            errors,
            title: "Edit " ,
            nav,
            classificationList,
            inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
        });
        return;
    }
    next();
}

module.exports = validate;