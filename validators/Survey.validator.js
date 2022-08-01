const { handlerResERROR } = require("../utils");
const {body, validationResult} = require("express-validator");

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('startDate', "field 'startDate' is required and must be of type date (YYYY-MM-DD)").isDate().run(req);
  await body('endDate', "field 'date' is required and must be of type date (YYYY-MM-DD)").isDate().run(req);
  await body('questions', "field 'questions' is required and must be of type array").isArray({min: 1}).run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload survey form failed",
    data: errors
  }));
}


const update = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.startDate !== undefined) {
    await body('startDate', "field 'startDate' must be of type date (YYYY-MM-DD)").isDate().run(req);
    data.startDate = req.body.startDate;
  }
  if(req.body.endDate !== undefined) {
    await body('endDate', "field 'endDate' must be of type date (YYYY-MM-DD)").isDate().run(req);
    data.endDate = req.body.endDate;
  }
  if(req.body.questions !== undefined) {
    await body('questions', "field 'questions' must be of type array").isArray({min: 1}).run(req);
    const msg = "items in questions must be of type object and object value must be of type ";
    await body('questions.*.question', msg + "string").isString().run(req);
    await body('questions.*.options', msg + "array").isArray({min: 1}).run(req);
    await body('questions.*.options.*', "items in options must be of type string").isString().run(req);
    await body('questions.*.numberOfAnswers', msg + "number").isNumeric().run(req);
    data.questions = req.body.questions;
  }
  if(req.body.status !== undefined) {
    await body('status', "field 'status' must be of type number").isNumeric().run(req);
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
    message: "Validation of the chang recipes form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
};
