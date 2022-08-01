const {handlerResERROR, stringToInt} = require("../utils");

const checkCreate = (req, res, next) => {
  const {membershipId = ''} = req.body;
  // if(typeof orders === 'string') req.body.orders = JSON.parse(orders)
  if (!membershipId)
    return res.status(422).send(handlerResERROR({
      message: "Validator data!",
      code: "E_VALIDATION"
    }));
  next()
}

const checkUpdate = (req, res, next) => {
  if (!req.body.status) return res.status(422).send(handlerResERROR({
    message: "Validator data!",
    code: "E_VALIDATION"
  }));
  req.body = {status: req.body.status}
  return next()
}

module.exports = {
  checkCreate,
  checkUpdate
}
