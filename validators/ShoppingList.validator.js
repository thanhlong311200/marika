const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const msgIngredients = "field 'ingredients' in data must be of type array";
const msgStatus = "field 'status' must be 'private'|'published'";

const create = async (req) => {
  await body('data', "field 'data' is required and must be of type array").isArray({min: 1}).run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return errors;
}

const update = async (req, res, next) => {
  const data = {};

  if(req.body.data !== undefined) {
    await body('data', "field 'data' is required and must be of type array").isArray({min: 1}).run(req);
    await body('data.*.mealId', "field 'mealId' in data must be string").isString().run(req);
    await body('data.*.date', "field 'date' in data must be of type date (YYYY-MM-DD)").isDate().run(req);
    await body('data.*.ingredients', msgIngredients).isArray({min: 1}).run(req);
    const msg = "items in ingredients must be of type object and object value must be of type ";
    await body('data.*.ingredients.*._id', msg + "string").isString().run(req);
    await body('data.*.ingredients.*.qty', msg + "number").isNumeric().run(req);
    await body('data.*.ingredients.*.displayQty', msg + "string").isString().run(req);
    await body('data.*.ingredients.*.order', msg + "number").isNumeric().run(req);
    await body('data.*.ingredients.*.status', msg + "boolean").isBoolean().run(req);
    await body('data.*.ingredients.*.buyStatus', msg + "boolean").isBoolean().run(req);
    data.data = req.body.data;
  }
  if(req.body.status !== undefined) {
    await body('status', msgStatus).isString().isIn(['private', 'published']).run(req);
    data.status = req.body.status;
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
    message: "Validation of the chang shopping list form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
}
