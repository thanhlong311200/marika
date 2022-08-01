const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const create = async (req, res, next) => {
  if(req.roles === "member")
    await body('date', "field 'date' must be of type date (YYYY-MM-DD)").isDate().run(req);
  await body('mealId', "field 'mealId' is required and must be of type string").isString().run(req);

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

  if(req.body.date !== undefined) {
    await body('date', "field 'date' must be of type date (YYYY-MM-DD)").isDate().run(req);
    data.date = req.body.date;
  }
  if(req.body.swap !== undefined) {
    await body('swap', "field 'swap' must be of type boolean").isIn([true, false]).run(req);
    data.swap = req.body.swap;
  }
  if(req.body.mealId !== undefined) {
    await body('mealId', "field 'mealId' must be of type boolean").isString().run(req);
    data.mealId = req.body.mealId;
  }
  if(req.body.recipe !== undefined) {
    await body('recipe', "field 'recipe' must be of type string").isString().run(req);
    data.recipe = req.body.recipe;
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

const createList = async (req, res, next) => {
  await body('data', "field 'data' is required and must be of type array").isArray({min: 1}).run(req);
  const msg = (filed) => `items in data must be Object and value of field '${filed}' must be `;
  await body('data.*.swap', msg("swap") + "boolean").isIn([true, false]).run(req);
  await body('data.*.mealId', msg("mealId") + "string").isString().run(req);
  // await body('data.*.recipe', msg("recipe") + "string").isString().run(req);
  if(req.roles === "member")
    await body('data.*.date', msg("date") + "date (YYYY-MM-DD)").isDate().run(req);
  req.body = req.body.data;

  let errors = validationResult(req);
  if (errors.isEmpty()) return next();

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the menu food form failed",
    data: errors
  }));
}

const mealPlan = async (req, res, next) => {
  const data = {}
  await body('mealPlanId', "field 'mealPlanId' is required and must be of type string").isString().run(req);
  data.mealPlanId = req.body.mealPlanId;
  if(req.body.startDate !== undefined) {
    await body('startDate', "field 'startDate' must be of type date").isDate().run(req);
    data.startDate = req.body.startDate;
  }

  let errors = validationResult(req);
  if (errors.isEmpty()) return next();

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the meal plan form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
  createList,
  mealPlan,
}
