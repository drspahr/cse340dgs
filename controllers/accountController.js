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
  console.log(`TEST03: Before call to getAccountByEmail (${account_email})`)
  const accountData = await accModel.getAccountByEmail(account_email);
  console.log(`TEST02: Finished getAccountByEmail (${accountData.account_email})`);
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
    console.log("TEST04: Just inside try block, before password compare");
    console.log(`TEST07: Before brcrypt.compare (${account_password}, ${accountData.account_password}) `)
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log(`TEST05: In first if .compare`);
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
    console.log(`TEST06: Inside the catch before return of error: ${error}`)
    return new Error('Access Forbidden');
  }
}

/* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManagement(req, res, next) {
  console.log("TEST01: buildManagement");
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

  module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildManagement }
  