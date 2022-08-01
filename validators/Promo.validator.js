const {isNumber} = require("lodash");
const {handlerResERROR, stringToInt} = require("../utils");
const {body, validationResult} = require("express-validator");

const checkCreatePromo = (req, res, next) => {
  if (req?.body?.percent) req.body.percent = stringToInt(req?.body?.percent)
  if (req?.body?.price) req.body.price = stringToInt(req?.body?.price)
  if (req?.body?.numberOfUse) req.body.numberOfUse = stringToInt(req?.body?.numberOfUse)
  if (typeof req?.body?.autoGenerate === 'string') req.body.autoGenerate = req.body.autoGenerate === 'true'
  // console.log("req.body:", req.body);
  const {percent = 0, price = 0, autoGenerate = true, promoCode = ''} = req.body;
  if ((!price && !percent) || price < 0 || percent < 0 || (!autoGenerate && !promoCode) || (!autoGenerate && promoCode?.length < 3))
    return res.status(422).send(handlerResERROR({
      message: "Validator data!",
      code: "E_VALIDATION"
    }));
  return next()
}

const checkUpdatePromo = (req, res, next) => {
  // console.log("req.body:", req.body);
  if (req?.body?.percent) {
    req.body.percent = stringToInt(req?.body?.percent)
    if (req.body.percent === false) return res.status(422).send(handlerResERROR({
      "message": "Validator data update!"
    }));
  }
  if (req?.body?.price) {
    req.body.price = stringToInt(req?.body?.price)
    if (req.body.price === false) return res.status(422).send(handlerResERROR({
      "message": "Validator data update!"
    }));
  }
  if (req?.body?.numberOfUse) {
    req.body.numberOfUse = stringToInt(req?.body?.numberOfUse)
    if (req.body.numberOfUse === false) return res.status(422).send(handlerResERROR({
      "message": "Validator data update!"
    }));
  }
  // console.log("req.body2: ", req.body);
  const {percent, price, numberOfUse} = req.body;
  let countErr = 0
  if (isNumber(numberOfUse) && numberOfUse < 0) countErr += 1
  if (isNumber(price) && price < 0) countErr += 1
  if (isNumber(percent) && (percent < 0 || percent >= 100)) countErr += 1
  if (!countErr)
    return next()
  return res.status(422).send(handlerResERROR({
    "message": "Validator data update!"
  }));
}

const requireAiaCode = async (req, res, next) => {
  await body('email').isEmail().notEmpty().run(req)
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json(handlerResERROR({
      message: "Validation data !",
      data: errors.array().map(value => ({'field': value.param, 'message': value.msg}))
    },
  ));
}

module.exports = {
  checkCreatePromo,
  checkUpdatePromo,
  requireAiaCode
}
