const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('type', "field 'type' must be 'hour'|'day'|'week'|'month'|'year'").isString().isIn(['hour', 'day', 'week', 'month', "year"]).run(req);
  await body('time', "field 'time' is required and must be of type date").isNumeric().run(req);
  await body('price', "field 'price' is required and must be of type number").isNumeric().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload membership form failed",
    data: errors
  }));
}

const update = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.amountOfSaving !== undefined) {
    await body('amountOfSaving', "field 'amountOfSaving' must be of type number").isNumeric().run(req);
    data.amountOfSaving = req.body.amountOfSaving;
  }
  if(req.body.description !== undefined) {
    await body('description', "field 'description' must be of type string").isString().run(req);
    data.description = req.body.description;
  }
  if(req.body.typeMembershipId !== undefined) {
    await body('typeMembershipId', "field 'typeMembershipId' must be of type string").isString().run(req);
    data.typeMembershipId = req.body.typeMembershipId;
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
    message: "Validation of the chang membership form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
}
