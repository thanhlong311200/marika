const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('dietaryId', "field 'dietaryId' is required and must be of type string").isString().run(req);
  await body('numberOfSnack', "field 'numberOfSnack' is required and must be of type number").isNumeric().run(req);
  await body('data', "field 'data' is required and must be of type array").isArray({min: 7}).run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload menu food form failed",
    data: errors
  }));
}

const update = async (req, res, next) => {
  const data = {};

  if (req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.description)data.description = req.body.description;
  if (req.body.dietaryId !== undefined) {
    await body('dietaryId', "field 'dietaryId' must be of type string").isString().run(req);
    data.dietaryId = req.body.dietaryId;
  }
  if (req.body.numberOfSnack !== undefined) {
    await body('numberOfSnack', "field 'numberOfSnack' must be of type number").isNumeric().run(req);
    data.numberOfSnack = req.body.numberOfSnack;
  }
  if (req.body.data !== undefined) {
    await body('data', "field 'data' must be of type array and length of array is greater than 7").isArray({min: 7}).run(req);
    const msg = (filed) => `items in data must be Object and value of field '${filed}' must be `;
    await body('data.*.day', msg + "string").isString()
      .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).run(req);
    await body('data.*.menuFood', msg + "array").isArray({min: 1}).run(req);
    await body('data.*.menuFood.*', "value of field menuFood must be String").isString().run(req);
    data.data = req.body.data;
  }

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    req.body = data;
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the chang menu food form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
}
