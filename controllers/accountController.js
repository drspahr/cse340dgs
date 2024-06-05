/* **************************
 * Account Controller 
 * *************************/
const utilities = require("../utilities");
const accModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
/* **************************************
 * Process Registration
 * *************************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword
  try {
    //regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing registration.');
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ***********************************************
 * Process Login Request
 * **********************************************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600});
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
      } else {
        res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000});
      }
    return res.redirect("/account/");
    }
  } catch (error) {
    return new Error('Access Forbidden');
  }
}

/* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  let classList = await utilities.getNewClass();
  let invList = await utilities.getNewInventory();
  res.render("account/management", {
    title: "Account Management",
    nav,
    classList,
    invList,
    errors: null,
  });
}

/* ***************************************
 * Build Update account view
 * **************************************/
async function buildAccountUpdateVeiw(req, res, next) {
  const account_id = parseInt(req.params.accountId);
  const aData = await accModel.getAccountById(account_id);
  let nav = await utilities.getNav();
  res.render("account/update-account", {
    title: "Account Update",
    nav,
    errors: null,
    account_id: aData[0].account_id,
    account_firstname: aData[0].account_firstname,
    account_lastname: aData[0].account_lastname,
    account_email: aData[0].account_email,
  });
}

// Update Account
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    const name = updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash("notice", `The account for ${name} has been updated.`);
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed");
    res.status(501).render("./account/update-account", {
      title: "Account Update",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

// Update Password
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_password } = req.body;
  let hashedPassword;
  try {
     //regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the password.');
      res.status(500).render("account/update-account", {
        title: "Account Update",
        nav,
        errors: null,
      })
    }

  const updateResult = await accModel.updatePassword(
    account_id,
    account_firstname,
    account_lastname,
    hashedPassword
  );

  if (updateResult) {
    const name = updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash("notice", `The password for ${name} had been updated.`);
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed");
    res.status(501).render("./account/update-account", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }
}

/* *************************
 * Logout
 * ************************/
async function accountLogout(req, res, next) {
  let nav = await utilities.getNav();
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  res.render("index", {
    title: "Home",
    nav,
    errors: null
  })
}

  module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildManagement, buildAccountUpdateVeiw, updateAccount, updatePassword, accountLogout }