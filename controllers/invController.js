const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ****************************
 * Build inventory by classification view
 * ***************************/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles", 
        nav, 
        grid,
        errors: null,
    });
}

/* ****************************
 * Build inventory detail
 * ***************************/
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId;
    console.log(inventory_id);
    const data = await invModel.getInventoryByInventoryId(inventory_id);
    const grid = await utilities.buildDetailGrid(data[0]);
    let nav = await utilities.getNav();
    const className = data[0].inv_model;
    res.render("./inventory/detail", {
        title: className, 
        nav, 
        grid,
        errors: null,
    });
}

/* ****************************
 * Build Management View
 * ***************************/
invCont.buildManage = async function (req, res) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        errors: null,
    });
}

/* ****************************
 * Build Add Classification View
 * ***************************/
invCont.buildAddClass = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    });
}

/* *******************************
 * Build Add Inventory View
 * ******************************/
invCont.buildAddInv = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
    });
}

/* ****************************
 * Add new classification to database
 * ***************************/
invCont.addNewClass = async function (req, res, next) {
    const { classification_name } = req.body;

    const regResult = await invModel.addClass(classification_name);
    
    if (regResult) {
        let nav = await utilities.getNav();
        req.flash("notice", `Added the new classification ${classification_name}.`)
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            error: null,
         });
    } else {
        req.flash("notice", "Sorry, could not add the classification.");
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            error: null,
        });
    }
}

/* ****************************
 * Add new inventory to database
 * ***************************/
invCont.addNewInv = async function (req, res, next) {
    let nav = await utilities.getNav();
    const  { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const regResult = await invModel.addInv(
        inv_make, 
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (regResult) {
        req.flash("notice", "New vehicle added to inventory.");
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the vehicle was not added.");
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            errors: null,
        });
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

  /* *****************************
   * Build Edit Inventory
   * ****************************/
  invCont.buildEditInv = async function (req, res, next) {
    const inventory_Id = parseInt(req.params.inventoryId);
    console.log(`TEST01: inventory id:${inventory_Id}`);
    let nav = await utilities.getNav();
    const invData = await invModel.getInventoryByInventoryId(inventory_Id);
    console.log(`TEST03: inv_id:${invData[0].inv_id}, classification_id:${invData[0].classification_id}`);
    let classificationList = await utilities.buildClassificationList(invData[0].classification_id);
    const invName = `${invData[0].inv_make} ${invData[0].inv_model}`;
    res.render("./inventory/edit-inventory", {
        title: "Edit " + invName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: invData[0].inv_id,
        inv_make: invData[0].inv_make,
        inv_model: invData[0].inv_model,
        inv_year: invData[0].inv_year,
        inv_description: invData[0].inv_description,
        inv_image: invData[0].inv_image,
        inv_thumbnail: invData[0].inv_thumbnail,
        inv_price: invData[0].inv_price,
        inv_miles: invData[0].inv_miles,
        inv_color: invData[0].inv_color,
        classification_id: invData[0].classification_id
    });
}

/* ****************************
 * Update Inventory 
 * ***************************/
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const  { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make, 
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model;
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("notice", "Sorry, the insert failed.");
        res.status(501).render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            inv_id,
            inv_make, 
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
    }
}

module.exports = invCont;