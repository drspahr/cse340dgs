const utilities = require("../utilities/");

const errCont = {};

/* *********************************
 * Build Error Link View
 * ********************************/
errCont.buildErrorView = async function(err,req, res, next) {
    let nav = await utilities.getNav();
    console.error(`Error at: "${req.orginalUrl}" : ${err.messgae}`);
    if (err.status == 500) {
        message = err.message;
    } else {
        message = 'Some error! Try again, maybe something different.';
    }
    res.render('./errors/error', {
        title: err.status || 'Server Error',
        message,
        nav 
    })
}

module.exports = errCont;